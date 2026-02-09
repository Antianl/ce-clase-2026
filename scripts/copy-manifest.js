const fs = require('fs');
const path = require('path');

const root = process.cwd();
const source = path.join(root, 'manifest.json');
const destDir = path.join(root, 'dist');
const destination = path.join(destDir, 'manifest.json');

// Crear carpeta dist si no existe
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copiar archivo
try {
  fs.copyFileSync(source, destination);
  console.log('✅ manifest.json copiado a dist/');
} catch (err) {
  console.error('❌ Error copiando manifest.json:', err);
  process.exit(1);
}