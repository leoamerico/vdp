#!/usr/bin/env python3
"""
Teste rápido do Sistema de Verificação de Veracidade
"""

from truth_verification_system import TruthVerificationSystem, EvidenceType
import json

def test_quick():
    """Teste simplificado do sistema."""
    
    # Inicializa
    system = TruthVerificationSystem()
    
    # Adiciona 3 evidências
    system.add_text_evidence(
        "O projeto reduziu papel em 70%",
        EvidenceType.EMAIL,
        {"sender": "gestor@empresa.com"}
    )
    
    system.add_text_evidence(
        "Relatório mostra redução de 71% no consumo",
        EvidenceType.EXTERNAL_API,
        {"confidence": 0.95}
    )
    
    system.add_text_evidence(
        "Economia de 45% foi registrada",
        EvidenceType.ATTACHMENT,
        {"type": "PDF"}
    )
    
    # Verifica claim
    result = system.verify("O projeto reduziu o papel em 70%")
    
    # Output JSON formatado
    output = {
        "claim": result.claim_checked,
        "status": result.status.value,
        "confidence": f"{result.confidence_score:.1%}",
        "evidences_found": len(result.supporting_evidences),
        "total_evidences": len(system.evidences)
    }
    
    print("\n" + "="*60)
    print("RESULTADO DA VERIFICAÇÃO")
    print("="*60)
    print(json.dumps(output, indent=2, ensure_ascii=False))
    print("\nSTATUS:", "✅ VERIFICADO" if result.status.value == "verified_true" else "⚠️ " + result.status.value.upper())
    print("="*60 + "\n")
    
    system.close()

if __name__ == "__main__":
    test_quick()
