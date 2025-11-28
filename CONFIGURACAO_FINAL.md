# 🎯 Configuração Final - Atualize Seu .env

## ✅ Informações Confirmadas

Baseado na sua planilha:

- **Spreadsheet ID**: [SEU_SPREADSHEET_ID]
- **Permissões**: ✅ Compartilhada publicamente (Qualquer pessoa com o link)
- **Servidor**: ✅ Rodando em `http://localhost:5173/`

---

## 📝 Atualize o Arquivo `.env`

### Passo 1: Abra o arquivo

Abra o arquivo: `d:\antigravity\vdp\frontend\.env`

### Passo 2: Cole este conteúdo

```env
VITE_GOOGLE_API_KEY=[SEU_API_KEY]
VITE_SPREADSHEET_ID=[SEU_SPREADSHEET_ID]
```

### Passo 3: Salve o arquivo

Pressione **Ctrl+S** para salvar.

### Passo 4: Reinicie o servidor

No terminal onde está rodando `bun dev`:

1. Pressione **Ctrl+C** para parar
2. Execute novamente:

   ```bash
   bun dev
   ```

---

## 🧪 Teste a Conexão

Depois de reiniciar o servidor, acesse:

### Opção 1: Página de Teste Visual

```
http://localhost:5173/teste-conexao.html
```

Clique em **"🚀 Executar Testes"** e verifique se todas as seções mostram ✅.

### Opção 2: Dashboard Principal

```
http://localhost:5173/
```

Os cards devem carregar com os dados reais da sua planilha!

---

## 🔍 Verificação Rápida

Para confirmar que o `.env` está correto, execute no terminal:

```powershell
Get-Content "d:\antigravity\vdp\frontend\.env"
```

Deve mostrar:

```
VITE_GOOGLE_API_KEY=[SEU_API_KEY]
VITE_SPREADSHEET_ID=[SEU_SPREADSHEET_ID]
```

---

## ✅ Checklist Final

- [ ] Atualizei o arquivo `.env` com o Spreadsheet ID correto
- [ ] Salvei o arquivo (Ctrl+S)
- [ ] Reiniciei o servidor (Ctrl+C e depois `bun dev`)
- [ ] Acessei `http://localhost:5173/teste-conexao.html` para testar
- [ ] Todos os testes mostraram ✅

---

## 🎉 Pronto

Depois desses passos, o erro 400 vai desaparecer e você verá os dados reais da planilha no dashboard! 🚀

**Dica**: Se ainda aparecer erro 400 após reiniciar, limpe o cache do navegador com **Ctrl+Shift+R**.
