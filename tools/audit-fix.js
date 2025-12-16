#!/usr/bin/env node
import { exec } from 'child_process';
import { writeFileSync } from 'fs';

console.log('Executando: npm audit fix --json ...');

exec('npm audit fix --json', { maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
  if (!stdout) {
    console.error('\nNenhuma saída do comando `npm audit fix`. Provavelmente não há lockfile.');
    console.error('Execute `npm i --package-lock-only` ou `npm run generate-lockfile` e tente novamente.');
    if (stderr) console.error(stderr);
    process.exit(0);
  }

  let data;
  try {
    data = JSON.parse(stdout);
  } catch (e) {
    console.error('Falha ao parsear saída do `npm audit fix`:', e.message);
    writeFileSync('audit-fix.json', stdout);
    console.log('Arquivo `audit-fix.json` criado (conteúdo bruto).');
    process.exit(0);
  }

  writeFileSync('audit-fix.json', JSON.stringify(data, null, 2));
  console.log('\nArquivo `audit-fix.json` gerado com sucesso.');

  if (data.actions && data.actions.length) {
    console.log('\nAções aplicadas:');
    data.actions.forEach((a) => console.log(`- ${a.action} (resolves: ${a.resolves?.length || 0})`));
  } else {
    console.log('\nNenhuma correção automática aplicada (ou nenhuma vulnerabilidade corrigível).');
  }

  process.exit(0);
});
