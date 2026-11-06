// Bundles index.html + all src files into:
//   dist/index.html    — one self-contained file (open offline, host on GitHub Pages, send on WhatsApp)
//   dist/artifact.html — the same app without <html>/<head>/<body> wrappers, for claude.ai Artifacts
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]);
const css = readFileSync(join(root, 'src/css/app.css'), 'utf8');
const js = scripts.map((s) => `/* ${s} */\n` + readFileSync(join(root, s), 'utf8').replace(/<\/script/gi, '<\\/script')).join('\n');
const fonts = html.match(/<link rel="preconnect"[^>]*>\s*<link rel="preconnect"[^>]*>\s*<link rel="stylesheet" href="https:\/\/fonts[^>]*>/)[0];
const desc = html.match(/<meta name="description"[^>]*>/)[0];

const full = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>JRF Sadhana</title>
${desc}
${fonts}
<style>
${css}
</style>
</head>
<body>
<noscript>This app needs JavaScript.</noscript>
<script>
${js}
</script>
</body>
</html>
`;
const artifact = `<title>JRF Sadhana</title>
<meta name="claude:viewport-fit-sides" content="cover">
${fonts}
<style>
${css}
</style>
<script>
${js}
</script>
`;
mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(join(root, 'dist/index.html'), full);
writeFileSync(join(root, 'dist/artifact.html'), artifact);
console.log(`dist/index.html ${(full.length / 1024).toFixed(0)} KB · dist/artifact.html ${(artifact.length / 1024).toFixed(0)} KB · ${scripts.length} scripts`);
