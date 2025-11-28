#!/usr/bin/env python3
"""
Sistema de Verificação de Veracidade de Informações
Implementação completa com tipagem estrita e zero dependências externas.
"""

import json
import sqlite3
import re
import hashlib
import logging
from abc import ABC, abstractmethod
from dataclasses import dataclass, asdict
from enum import Enum
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
import os


# ============================================================================
# 1. DATA CONTRACTS - A VERDADE DOS DADOS
# ============================================================================

class EvidenceType(Enum):
    EMAIL = "email"
    ATTACHMENT = "attachment"
    EXTERNAL_API = "external_api"


class ValidationStatus(Enum):
    VERIFIED_TRUE = "verified_true"
    VERIFIED_FALSE = "verified_false"
    INCONCLUSIVE = "inconclusive"


@dataclass
class Evidence:
    id: str
    content: str
    source_type: EvidenceType
    timestamp: float
    metadata: Dict[str, Any]


@dataclass
class VerificationResult:
    claim_checked: str
    status: ValidationStatus
    confidence_score: float  # 0.0 to 1.0
    supporting_evidences: List[str]  # IDs das evidências
    reasoning_trace: str


# ============================================================================
# 2. AUDIT LOGGER - RASTREABILIDADE TOTAL
# ============================================================================

class AuditLogger:
    """Registra cada decisão do sistema em formato estruturado."""
    
    def __init__(self, db_path: str = ":memory:"):
        self.db_path = db_path
        self.conn = sqlite3.connect(db_path)
        self._init_db()
    
    def _init_db(self) -> None:
        """Cria tabela de auditoria se não existir."""
        cursor = self.conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS audit_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp REAL NOT NULL,
                event_type TEXT NOT NULL,
                claim TEXT,
                evidence_ids TEXT,
                result_status TEXT,
                confidence REAL,
                reasoning TEXT,
                metadata TEXT
            )
        """)
        self.conn.commit()
    
    def log_verification(
        self, 
        claim: str, 
        result: VerificationResult,
        metadata: Optional[Dict[str, Any]] = None
    ) -> None:
        """Registra uma verificação completa."""
        cursor = self.conn.cursor()
        cursor.execute("""
            INSERT INTO audit_log 
            (timestamp, event_type, claim, evidence_ids, result_status, confidence, reasoning, metadata)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            datetime.now().timestamp(),
            "VERIFICATION",
            claim,
            json.dumps(result.supporting_evidences),
            result.status.value,
            result.confidence_score,
            result.reasoning_trace,
            json.dumps(metadata or {})
        ))
        self.conn.commit()
    
    def log_ingestion(self, evidence: Evidence) -> None:
        """Registra ingestão de evidência."""
        cursor = self.conn.cursor()
        cursor.execute("""
            INSERT INTO audit_log 
            (timestamp, event_type, evidence_ids, metadata)
            VALUES (?, ?, ?, ?)
        """, (
            evidence.timestamp,
            "INGESTION",
            json.dumps([evidence.id]),
            json.dumps(evidence.metadata)
        ))
        self.conn.commit()
    
    def get_logs(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Recupera logs mais recentes."""
        cursor = self.conn.cursor()
        cursor.execute("""
            SELECT * FROM audit_log 
            ORDER BY timestamp DESC 
            LIMIT ?
        """, (limit,))
        
        columns = [desc[0] for desc in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]
    
    def close(self) -> None:
        """Fecha conexão com banco de dados."""
        self.conn.close()


# ============================================================================
# 3. INGESTION ENGINE - CONVERSÃO DE DADOS
# ============================================================================

class IngestionEngine:
    """Converte dados brutos em objetos Evidence."""
    
    def __init__(self, audit_logger: AuditLogger):
        self.audit_logger = audit_logger
    
    def _generate_id(self, content: str, source_type: EvidenceType) -> str:
        """Gera ID único baseado no conteúdo."""
        hash_input = f"{content}{source_type.value}{datetime.now().timestamp()}"
        return hashlib.sha256(hash_input.encode()).hexdigest()[:16]
    
    def ingest_text(
        self, 
        content: str, 
        source_type: EvidenceType,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Evidence:
        """Ingere texto simples."""
        evidence = Evidence(
            id=self._generate_id(content, source_type),
            content=content,
            source_type=source_type,
            timestamp=datetime.now().timestamp(),
            metadata=metadata or {}
        )
        self.audit_logger.log_ingestion(evidence)
        return evidence
    
    def ingest_json(self, json_str: str) -> List[Evidence]:
        """Ingere JSON e extrai múltiplas evidências."""
        try:
            data = json.loads(json_str)
            evidences = []
            
            if isinstance(data, dict):
                data = [data]
            
            for item in data:
                content = json.dumps(item.get('content', item))
                evidence = self.ingest_text(
                    content=content,
                    source_type=EvidenceType.EXTERNAL_API,
                    metadata=item.get('metadata', {})
                )
                evidences.append(evidence)
            
            return evidences
        except json.JSONDecodeError as e:
            logging.error(f"Falha ao parsear JSON: {e}")
            return []
    
    def ingest_email_mock(
        self, 
        subject: str, 
        body: str, 
        sender: str,
        timestamp: Optional[float] = None
    ) -> Evidence:
        """Mock de ingestão de email."""
        content = f"Subject: {subject}\nFrom: {sender}\nBody: {body}"
        return self.ingest_text(
            content=content,
            source_type=EvidenceType.EMAIL,
            metadata={
                "sender": sender,
                "subject": subject,
                "received_at": timestamp or datetime.now().timestamp()
            }
        )


# ============================================================================
# 4. TRUTH SEEKER - MOTOR DE VERIFICAÇÃO
# ============================================================================

class TruthSeeker:
    """Núcleo lógico de verificação de afirmações."""
    
    def __init__(self, audit_logger: AuditLogger):
        self.audit_logger = audit_logger
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Extrai palavras-chave importantes."""
        # Remove pontuação e converte para minúsculas
        cleaned = re.sub(r'[^\w\s]', ' ', text.lower())
        words = cleaned.split()
        
        # Remove stopwords comuns
        stopwords = {'o', 'a', 'de', 'em', 'para', 'com', 'por', 'que', 'e', 'do', 'da'}
        keywords = [w for w in words if w not in stopwords and len(w) > 3]
        
        return keywords
    
    def _calculate_relevance(self, claim: str, evidence: Evidence) -> float:
        """Calcula relevância entre claim e evidência."""
        claim_keywords = set(self._extract_keywords(claim))
        evidence_keywords = set(self._extract_keywords(evidence.content))
        
        if not claim_keywords:
            return 0.0
        
        # Jaccard similarity
        intersection = claim_keywords & evidence_keywords
        union = claim_keywords | evidence_keywords
        
        return len(intersection) / len(union) if union else 0.0
    
    def _extract_numeric_claim(self, claim: str) -> Optional[Tuple[str, float]]:
        """Extrai valores numéricos de uma afirmação."""
        # Procura por padrões como "70%", "70 por cento", "70 porcento"
        patterns = [
            r'(\d+(?:\.\d+)?)\s*%',
            r'(\d+(?:\.\d+)?)\s*por\s*cento',
            r'(\d+(?:\.\d+)?)\s*porcento'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, claim.lower())
            if match:
                value = float(match.group(1))
                return ("percentage", value)
        
        # Procura números gerais
        match = re.search(r'(\d+(?:\.\d+)?)', claim)
        if match:
            return ("number", float(match.group(1)))
        
        return None
    
    def _verify_numeric_claim(
        self, 
        claim_value: Tuple[str, float], 
        evidences: List[Evidence]
    ) -> Tuple[ValidationStatus, float, List[str], str]:
        """Verifica claims numéricas contra evidências."""
        claim_type, claim_num = claim_value
        supporting = []
        total_evidence_score = 0.0
        matching_count = 0
        
        reasoning = f"Verificando claim numérica: {claim_num} ({claim_type})\n"
        
        for evidence in evidences:
            evidence_value = self._extract_numeric_claim(evidence.content)
            if evidence_value:
                ev_type, ev_num = evidence_value
                reasoning += f"  - Evidência {evidence.id[:8]}: {ev_num} ({ev_type})\n"
                
                # Tolerância de 5% para comparação
                tolerance = 0.05
                if abs(ev_num - claim_num) / claim_num <= tolerance:
                    supporting.append(evidence.id)
                    total_evidence_score += 1.0
                    matching_count += 1
                    reasoning += f"    ✓ MATCH (dentro da tolerância de {tolerance*100}%)\n"
                else:
                    reasoning += f"    ✗ NO MATCH (diferença: {abs(ev_num - claim_num)})\n"
        
        if matching_count >= 2:
            status = ValidationStatus.VERIFIED_TRUE
            confidence = min(0.9, 0.6 + (matching_count * 0.1))
            reasoning += f"\nCONCLUSÃO: VERIFICADO (>= 2 evidências concordantes)\n"
        elif matching_count == 1:
            status = ValidationStatus.INCONCLUSIVE
            confidence = 0.5
            reasoning += f"\nCONCLUSÃO: INCONCLUSIVO (apenas 1 evidência)\n"
        else:
            status = ValidationStatus.VERIFIED_FALSE
            confidence = 0.7
            reasoning += f"\nCONCLUSÃO: FALSO (nenhuma evidência concordante)\n"
        
        return status, confidence, supporting, reasoning
    
    def _verify_textual_claim(
        self, 
        claim: str, 
        evidences: List[Evidence]
    ) -> Tuple[ValidationStatus, float, List[str], str]:
        """Verifica claims textuais usando relevância semântica."""
        relevance_scores = []
        supporting = []
        reasoning = f"Verificando claim textual: '{claim}'\n"
        
        for evidence in evidences:
            relevance = self._calculate_relevance(claim, evidence)
            relevance_scores.append((evidence.id, relevance))
            reasoning += f"  - Evidência {evidence.id[:8]}: relevância {relevance:.2f}\n"
            
            if relevance > 0.3:  # Threshold de relevância
                supporting.append(evidence.id)
        
        if not relevance_scores:
            return ValidationStatus.INCONCLUSIVE, 0.0, [], reasoning + "\nSem evidências.\n"
        
        avg_relevance = sum(r for _, r in relevance_scores) / len(relevance_scores)
        max_relevance = max(r for _, r in relevance_scores)
        
        if max_relevance > 0.5 and avg_relevance > 0.3:
            status = ValidationStatus.VERIFIED_TRUE
            confidence = min(0.85, avg_relevance + 0.3)
        elif max_relevance > 0.3:
            status = ValidationStatus.INCONCLUSIVE
            confidence = 0.5
        else:
            status = ValidationStatus.VERIFIED_FALSE
            confidence = 0.6
        
        reasoning += f"\nRelevância média: {avg_relevance:.2f}, máxima: {max_relevance:.2f}\n"
        reasoning += f"CONCLUSÃO: {status.value}\n"
        
        return status, confidence, supporting, reasoning
    
    def verify_claim(self, claim: str, evidences: List[Evidence]) -> VerificationResult:
        """
        Verifica uma afirmação contra um conjunto de evidências.
        
        Args:
            claim: A afirmação a ser verificada
            evidences: Lista de evidências disponíveis
            
        Returns:
            VerificationResult com status, confiança e raciocínio
        """
        if not evidences:
            result = VerificationResult(
                claim_checked=claim,
                status=ValidationStatus.INCONCLUSIVE,
                confidence_score=0.0,
                supporting_evidences=[],
                reasoning_trace="Nenhuma evidência disponível para verificação."
            )
            self.audit_logger.log_verification(claim, result)
            return result
        
        # Tenta extrair valor numérico da claim
        numeric_claim = self._extract_numeric_claim(claim)
        
        if numeric_claim:
            status, confidence, supporting, reasoning = self._verify_numeric_claim(
                numeric_claim, evidences
            )
        else:
            status, confidence, supporting, reasoning = self._verify_textual_claim(
                claim, evidences
            )
        
        result = VerificationResult(
            claim_checked=claim,
            status=status,
            confidence_score=confidence,
            supporting_evidences=supporting,
            reasoning_trace=reasoning
        )
        
        self.audit_logger.log_verification(claim, result)
        return result


# ============================================================================
# 5. SISTEMA INTEGRADO
# ============================================================================

class TruthVerificationSystem:
    """Sistema completo de verificação de veracidade."""
    
    def __init__(self, db_path: str = ":memory:"):
        self.audit_logger = AuditLogger(db_path)
        self.ingestion_engine = IngestionEngine(self.audit_logger)
        self.truth_seeker = TruthSeeker(self.audit_logger)
        self.evidences: Dict[str, Evidence] = {}
    
    def add_evidence(self, evidence: Evidence) -> None:
        """Adiciona evidência ao sistema."""
        self.evidences[evidence.id] = evidence
    
    def add_text_evidence(
        self, 
        content: str, 
        source_type: EvidenceType,
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """Adiciona evidência textual e retorna o ID."""
        evidence = self.ingestion_engine.ingest_text(content, source_type, metadata)
        self.add_evidence(evidence)
        return evidence.id
    
    def verify(self, claim: str) -> VerificationResult:
        """Verifica uma afirmação contra todas as evidências."""
        evidence_list = list(self.evidences.values())
        return self.truth_seeker.verify_claim(claim, evidence_list)
    
    def get_audit_logs(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Recupera logs de auditoria."""
        return self.audit_logger.get_logs(limit)
    
    def close(self) -> None:
        """Fecha conexões e libera recursos."""
        self.audit_logger.close()


# ============================================================================
# 6. FUNÇÃO MAIN - SIMULAÇÃO REAL
# ============================================================================

def main() -> None:
    """
    Simula cenário real usando dados do projeto 'Amparo Digital'.
    Valida a afirmação: "O projeto Amparo Digital reduziu o papel em 70%"
    """
    
    print("=" * 80)
    print("SISTEMA DE VERIFICAÇÃO DE VERACIDADE - AMPARO DIGITAL")
    print("=" * 80)
    print()
    
    # Inicializa sistema
    system = TruthVerificationSystem(db_path=":memory:")
    
    # ========================================================================
    # FASE 1: INGESTÃO DE EVIDÊNCIAS
    # ========================================================================
    
    print("[1] Carregando evidências do projeto Amparo Digital...\n")
    
    # Evidência 1: Email do gestor do projeto
    system.add_text_evidence(
        content="""
        Prezados,
        
        Gostaria de compartilhar os resultados do primeiro semestre do projeto Amparo Digital.
        Conseguimos digitalizar 85% dos processos administrativos e reduzimos o consumo
        de papel em aproximadamente 70%, representando uma economia de R$ 45.000 em
        material de escritório.
        
        A equipe está de parabéns!
        
        João Silva
        Gerente de Projeto
        """,
        source_type=EvidenceType.EMAIL,
        metadata={
            "sender": "joao.silva@amparodigital.org",
            "subject": "Resultados Q2 - Amparo Digital",
            "department": "Gestão de Projetos"
        }
    )
    
    # Evidência 2: Relatório financeiro (simulado como API externa)
    system.add_text_evidence(
        content=json.dumps({
            "project": "Amparo Digital",
            "period": "2024-Q2",
            "metrics": {
                "papel_reduzido_percentual": 71.2,
                "economia_reais": 44850,
                "processos_digitalizados": 340,
                "processos_totais": 400
            }
        }),
        source_type=EvidenceType.EXTERNAL_API,
        metadata={
            "api_endpoint": "finance.api/reports",
            "api_version": "v2",
            "confidence": 0.95
        }
    )
    
    # Evidência 3: Ata de reunião (attachment)
    system.add_text_evidence(
        content="""
        ATA DE REUNIÃO - COMITÊ DE SUSTENTABILIDADE
        Data: 15/06/2024
        
        PAUTA: Avaliação de impacto ambiental do Amparo Digital
        
        RESOLUÇÃO:
        Foi apresentado que o projeto Amparo Digital alcançou uma redução de 70% no
        consumo de papel nos últimos 6 meses. O comitê aprovou a continuidade do
        projeto e sugeriu expandir para outros departamentos.
        
        PARTICIPANTES:
        - Maria Santos (Sustentabilidade)
        - João Silva (TI)
        - Carlos Mendes (Administrativo)
        """,
        source_type=EvidenceType.ATTACHMENT,
        metadata={
            "file_type": "PDF",
            "file_size_kb": 245,
            "author": "Maria Santos"
        }
    )
    
    # Evidência 4: Contraditória (para testar robustez)
    system.add_text_evidence(
        content="""
        Relatório informal: Alguns departamentos ainda reportam uso elevado de papel.
        Estimativas iniciais sugerem redução de apenas 45% no consumo geral.
        """,
        source_type=EvidenceType.EMAIL,
        metadata={
            "sender": "feedback@interno.org",
            "confidence": 0.3
        }
    )
    
    print(f"✓ {len(system.evidences)} evidências carregadas no sistema.\n")
    
    # ========================================================================
    # FASE 2: VERIFICAÇÃO DA AFIRMAÇÃO
    # ========================================================================
    
    claim = "O projeto Amparo Digital reduziu o papel em 70%"
    
    print(f"[2] Verificando afirmação: '{claim}'\n")
    print("-" * 80)
    
    result = system.verify(claim)
    
    # ========================================================================
    # FASE 3: APRESENTAÇÃO DO RESULTADO
    # ========================================================================
    
    print("\n[3] RESULTADO DA VERIFICAÇÃO\n")
    
    result_dict = {
        "claim_checked": result.claim_checked,
        "status": result.status.value,
        "confidence_score": result.confidence_score,
        "supporting_evidences": result.supporting_evidences,
        "reasoning_trace": result.reasoning_trace,
        "timestamp": datetime.now().isoformat(),
        "evidences_analyzed": len(system.evidences)
    }
    
    # Output JSON formatado
    print(json.dumps(result_dict, indent=2, ensure_ascii=False))
    
    print("\n" + "=" * 80)
    print("AUDITORIA E LOGS")
    print("=" * 80)
    
    logs = system.get_audit_logs(limit=5)
    print(f"\nÚltimas {len(logs)} operações registradas:")
    for log in logs[-5:]:
        print(f"  - {log['event_type']} @ {datetime.fromtimestamp(log['timestamp']).strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Cleanup
    system.close()
    
    print("\n✓ Sistema finalizado com sucesso.\n")


if __name__ == "__main__":
    # Configuração de logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s [%(levelname)s] %(message)s'
    )
    
    main()
