#!/usr/bin/env node
import { exec } from 'child_process';
import { writeFileSync } from 'fs';

const cmd = 'npm audit --json';
console.log('Executando: npm audit --json (poderá demorar alguns segundos)...');

exec(cmd, { maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
  if (!stdout) {
    console.error('Nenhuma saída do comando `npm audit`. Verifique se o Node/npm está instalado.');
    if (stderr) console.error(stderr);
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(stdout);
  } catch (e) {
    console.error('Falha ao parsear saída do `npm audit`:', e.message);
    process.exit(1);
  }

  const summary = {};

  // Prefer metadata.vulnerabilities (npm >=7), fallback para data.vulnerabilities
  if (data.metadata && data.metadata.vulnerabilities) {
    summary.vulnerabilities = data.metadata.vulnerabilities;
    summary.totalDependencies = data.metadata.totalDependencies;
  } else if (data.vulnerabilities) {
    const counts = { critical: 0, high: 0, moderate: 0, low: 0, info: 0 };
    Object.values(data.vulnerabilities).forEach((v) => {
      const sev = v.severity || 'info';
      if (counts[sev] !== undefined) counts[sev]++;
    });
    summary.vulnerabilities = counts;
  } else {
    summary.vulnerabilities = {};
  }

  summary.advisories = data.advisories ? Object.keys(data.advisories).length : 0;

  // Top vulnerable packages (by severity)
  const top = [];
  if (data.advisories) {
    for (const adv of Object.values(data.advisories)) {
      top.push({ module_name: adv.module_name, severity: adv.severity, title: adv.title, findings: adv.findings?.length || 0 });
    }
  } else if (data.vulnerabilities) {
    for (const [pkg, vuln] of Object.entries(data.vulnerabilities)) {
      top.push({ module_name: pkg, severity: vuln.severity || 'unknown', title: vuln.title || '' });
    }
  }
  top.sort((a, b) => severityRank(b.severity) - severityRank(a.severity));
  summary.top = top.slice(0, 10);

  const out = { summary, raw: data };
  writeFileSync('audit-summary.json', JSON.stringify(out, null, 2));

  console.log('\nResumo do npm audit:');
  console.log(JSON.stringify(summary.vulnerabilities, null, 2));

  if (summary.top.length) {
    console.log('\nTop pacotes vulneráveis:');
    summary.top.forEach((t) => console.log(`- ${t.module_name} (${t.severity}) ${t.title ? '- ' + t.title : ''}`));
  }

  if (data.actions && data.actions.length) {
    console.log('\nAções sugeridas para correção:');
    data.actions.forEach((a) => console.log(`- ${a.action} (resolves: ${a.resolves?.length || 0})`));
  } else {
    console.log('\nNenhuma correção automática sugerida pelo npm audit.');
  }

  console.log('\nArquivo `audit-summary.json` gerado na raiz com detalhes completos.');
  process.exit(0);
});

function severityRank(s) {
  if (!s) return 0;
  if (s === 'critical') return 4;
  if (s === 'high') return 3;
  if (s === 'moderate') return 2;
  if (s === 'low') return 1;
  return 0;
}
