Title: chore(deps): bump vite to ^7.3.0 🔒

Body:
**Resumo:** atualiza `devDependencies.vite` de `^4.4.5` para `^7.3.0` para mitigar vulnerabilidades apontadas pelo `npm audit` (impactando `esbuild` e `vite`). Inclui checklist de upgrade em `/.github/UPGRADE_VITE_7.3.0.md`.

### Checklist para revisão / testes
- [ ] `npm run generate-lockfile`
- [ ] `npm install`
- [ ] `npm run check-deps` (confirmar que vulnerabilidades foram resolvidas)
- [ ] `npm run dev` (navegar nas rotas principais)
- [ ] `npm run build` (confirmar build sem erros)
- [ ] Verificar console do navegador e warnings
- [ ] Consultar changelog do Vite 7.x para ajustes necessários

**Notas:** atualização é major; pode requerer ajustes em `vite.config.js` ou plugins. Se houver regressões, reverter e aplicar mitigação temporária.

Labels sugeridas: `maintenance`, `security`, `dependencies`

Reviewers sugeridos: responsável pelo frontend ou CI.
"Nota: verifica��o m�nima para criar PR" 
