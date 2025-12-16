# UPGRADE: Vite -> 7.3.0

Objetivo: atualizar `vite` para `^7.3.0` para mitigar vulnerabilidade reportada pelo `npm audit` (inclui atualização transitiva de `esbuild`).

Checklist para a branch `fix/vite-7.3.0`:

1. Atualizar `devDependencies.vite` para `^7.3.0` (feito nesta branch).
2. Gerar lockfile localmente:

```powershell
npm run generate-lockfile
```

3. Instalar dependências:

```powershell
npm install
```

4. Executar auditoria e confirmar vulnerabilidades removidas:

```powershell
npm run check-deps
```

5. Testes manuais e checagens:
- `npm run dev` — navegue pelas rotas (Home, Catalog, Login, Admin)
- `npm run build` — confirmar que o build produz artefatos sem erros
- Verificar console e warnings do browser

6. Verificar changelog do Vite 7.x e adaptar configurações se necessário (ex.: `server.fs`, `server.host`, plugins incompatíveis).

7. Se tudo OK, abrir PR com descrição: motivo (segurança), resultados (`npm run check-deps`), e lista de testes realizados.

Notas:
- A atualização para 7.3.0 é semver-major; pode requerer pequenas mudanças no `vite.config.js` ou em plugins.
- Se houver problemas, revertendo a dependência e aplicar mitigação temporária (reinforce server config) é opção.
