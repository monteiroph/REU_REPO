# Criar PR automatizado (script local)

Este arquivo descreve como usar o script `tools/create-pr-from-local.js` para enviar alterações (como `package-lock.json` e o workflow) e abrir um Pull Request automaticamente.

Requisitos
- Node 18+ (requer `fetch` global) e `npm`.
- Um PAT (Personal Access Token) do GitHub com pelo menos o escopo `repo`. Opcionalmente, inclua `workflow` se quiser que o script também tenha permissão para manipular workflows.

Passos (PowerShell)
1. Exporte o token no terminal (substitua `ghp_xxx` pelo seu PAT):

```powershell
$env:GITHUB_TOKEN = 'ghp_xxx'
```

2. Execute o script usando o comando npm (o script `create-pr` está disponível no `package.json`):

```powershell
npm run create-pr -- --repo monteiroph/REU_REPO --branch fix/vite-lockfile-node20 --title "chore(deps): update lockfile & workflow node to 20" --body-file PR_FIX_VITE_7_3_0.md --files package-lock.json,.github/workflows/check-upgrade.yml --labels maintenance,security,dependencies
```

Passos (macOS / Linux)

```bash
GITHUB_TOKEN=ghp_xxx npm run create-pr -- --repo monteiroph/REU_REPO --branch fix/vite-lockfile-node20 --title "chore(deps): update lockfile & workflow node to 20" --body-file PR_FIX_VITE_7_3_0.md --files package-lock.json,.github/workflows/check-upgrade.yml --labels maintenance,security,dependencies
```

O que o script faz
- Cria a branch (se ela não existir) a partir de `main`.
- Atualiza/cria os arquivos listados na branch (usando GitHub Contents API).
- Cria o PR com o título e corpo fornecidos.
- Adiciona labels (opcional).

Observações de segurança
- Não comite o token nem compartilhe publicamente. Use validade curta (ex.: 1 dia) e revogue o token quando terminar: https://github.com/settings/tokens
- O script precisa de conectividade com a API do GitHub.

Verificação pós-PR
- Depois que o PR for criado, abra-o no GitHub e verifique os checks (`Actions`) e artefatos (se ocorrerem falhas, os logs estarão disponíveis como artefatos pelo workflow que adicionamos).

Ajuda adicional
- Se preferir, posso gerar o comando pronto para colar no seu terminal com o PAT embutido (não recomendado), ou posso orientá-lo passo-a-passo. Me diga se quer que eu abra o PR para você (eu só preciso do token **temporário** ou que você rode o comando localmente).