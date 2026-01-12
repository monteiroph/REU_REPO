# Projeto MiniCars Reserve

Pequenas instruções para configurar e verificar dependências no ambiente Windows.

## Scripts úteis

- `npm run check-deps` — executa `npm audit --json` e gera `audit-summary.json` com um resumo das vulnerabilidades.
- `npm run audit-fix` — tenta aplicar correções automáticas (`npm audit fix`) e grava `audit-fix.json`.
- `npm run check-deps:fix` — executa `audit-fix` e em seguida `check-deps` para atualizar os relatórios.

## Variáveis de ambiente

Copie o arquivo `.env.example` para `.env.local` e preencha as variáveis necessárias antes de rodar o app:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Erro comum no Windows: "execução de scripts foi desabilitada neste sistema"

Se você receber esse erro ao executar scripts no PowerShell, use uma destas soluções:

1) Bypass temporário (seguro para a sessão atual):

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
npm install
npm run check-deps
```

2) Alterar para `RemoteSigned` (persistente para o usuário atual):

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Get-ExecutionPolicy -List
```

3) Alternativa simples: usar o Prompt de Comando (cmd.exe) ou Git Bash:

```cmd
npm install
npm run check-deps
```

Feche a janela do PowerShell quando terminar se usou o modo `Bypass` (retorna ao padrão automaticamente).

## Rodando o servidor de desenvolvimento

1. Preencha `.env.local` conforme acima.
2. Instale dependências:

```powershell
npm install
```

3. Rode o servidor:

```powershell
npm run dev
```

Se ocorrerem erros, cole o log do terminal e envie para análise.

## Licença

Este projeto é licenciado sob a Licença **MIT** — veja o arquivo `LICENSE` para mais detalhes.
