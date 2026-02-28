const express = require('express');
const crypto = require('crypto');
const { exec } = require('child_process');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = Number(process.env.PORT || 9000);
const SECRET = process.env.GITHUB_WEBHOOK_SECRET;
const REPO_DIR = process.env.REPO_DIR || process.cwd();
const BRANCH = process.env.BRANCH || 'main';

if (!SECRET) {
  console.error('Erreur: GITHUB_WEBHOOK_SECRET est manquant dans .env');
  process.exit(1);
}

app.use(express.raw({ type: 'application/json' }));

app.post('/api/secret-github-hook', (req, res) => {
  const signature = req.headers['x-hub-signature-256'];

  if (!signature) {
    return res.status(401).send('Signature manquante');
  }

  const hmac = crypto.createHmac('sha256', SECRET);
  const digest = `sha256=${hmac.update(req.body).digest('hex')}`;

  const sigBuffer = Buffer.from(signature);
  const digestBuffer = Buffer.from(digest);

  if (
    sigBuffer.length !== digestBuffer.length ||
    !crypto.timingSafeEqual(sigBuffer, digestBuffer)
  ) {
    console.error("Alerte: tentative d'acces avec une mauvaise signature.");
    return res.status(403).send('Signature invalide ! Acces refuse.');
  }

  res.status(200).send('Webhook recu et valide, deploiement en cours...');
  console.log('Push detecte ! Lancement du git pull et du build...');

  const cmd = `git pull origin ${BRANCH} && npm install && npm run build`;
  exec(cmd, { cwd: path.resolve(REPO_DIR) }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erreur critique pendant le build: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`Infos/Warnings: ${stderr}`);
    }
    console.log(`Deploiement reussi:\n${stdout}`);
  });
});

app.listen(PORT, () => {
  console.log(`Serveur Webhook en ecoute sur le port ${PORT}`);
});
