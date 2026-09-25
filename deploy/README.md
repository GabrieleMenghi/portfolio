# Deploy sul VPS

A ogni push su `main` con la CI verde:

1. il job `immagine` costruisce l'immagine e la pubblica su GHCR (`ghcr.io/gabrielemenghi/portfolio`);
2. il job `deploy` entra nel VPS come utente `deploy` e lancia `/srv/portfolio/deploy.sh` con lo SHA del commit;
3. lo script scarica quella versione, riavvia il sito, aspetta che risponda e cancella le immagini vecchie;
4. il job `pulizia` lascia su GHCR solo le ultime 10 versioni.

Il sito non pubblica porte: lo raggiunge il Caddy condiviso in `/srv/proxy`, sulla rete Docker `proxy`.

A mano, anche per tornare a una versione precedente: `sudo /srv/portfolio/deploy.sh SHA_COMPLETO_DEL_COMMIT`. Il deploy non copia `compose.yaml` né lo script: se cambiano nel repo, la copia sul VPS si aggiorna a mano.

## Preparazione, una volta sola

L'utente `deploy` esiste già (è quello di Razor). Il portfolio gli aggiunge una **seconda chiave**, che può lanciare solo lo script del portfolio. Al posto di `IP_DEL_VPS` va l'indirizzo del server. I comandi dal PC vanno lanciati in Git Bash.

### 1. Chiave dedicata e segreti del repository (dal PC)

In una cartella temporanea, con la passphrase vuota (Invio due volte):

```bash
ssh-keygen -t ed25519 -C "github-actions portfolio" -f deploy-portfolio
gh secret set DEPLOY_SSH_KEY -R GabrieleMenghi/portfolio < deploy-portfolio
gh secret set DEPLOY_HOST -R GabrieleMenghi/portfolio --body "IP_DEL_VPS"
ssh-keygen -F IP_DEL_VPS | grep ssh-ed25519 | gh secret set DEPLOY_KNOWN_HOSTS -R GabrieleMenghi/portfolio
```

`DEPLOY_KNOWN_HOSTS` è l'impronta del server già verificata dal PC: la CI non si collega a un server diverso.

### 2. Cartella, compose e script (dal PC, poi sul VPS)

```bash
scp deploy/compose.yaml deploy/deploy.sh debian@IP_DEL_VPS:/tmp/
```

Sul VPS:

```bash
sudo install -d -o root -g root -m 755 /srv/portfolio
sudo install -o root -g root -m 644 /tmp/compose.yaml /srv/portfolio/compose.yaml
sudo install -o root -g root -m 755 /tmp/deploy.sh /srv/portfolio/deploy.sh
echo "TAG=latest" | sudo tee /srv/portfolio/.env > /dev/null
rm /tmp/compose.yaml /tmp/deploy.sh
```

`/srv/portfolio` deve restare di root e scrivibile solo da root, altrimenti `deploy` potrebbe sostituire lo script.

### 3. Seconda chiave e `sudo` per `deploy` (sul VPS)

Al posto di `CHIAVE_PUBBLICA` il contenuto di `deploy-portfolio.pub`, tutto su una riga. La riga si **aggiunge** (`-a`) a quella di Razor, che resta com'è:

```bash
sudo tee -a /home/deploy/.ssh/authorized_keys > /dev/null <<'EOF'
restrict,command="sudo /srv/portfolio/deploy.sh \"$SSH_ORIGINAL_COMMAND\"" CHIAVE_PUBBLICA
EOF
echo 'deploy ALL=(root) NOPASSWD: /srv/portfolio/deploy.sh' | sudo tee -a /etc/sudoers.d/deploy > /dev/null
sudo visudo -c
```

`visudo -c` deve dire `parsed OK`.

### 4. Caddy (sul VPS)

Aggiungi al Caddyfile condiviso in `/srv/proxy` il blocco di [`Caddyfile.example`](../Caddyfile.example), poi `cd /srv/proxy && sudo docker compose restart caddy`. Il certificato arriva da solo quando il dominio punta al VPS.

### 5. Primo deploy

Un push su `main`, oppure *Re-run* dell'ultima esecuzione della CI. Al primo giro l'immagine su GHCR nasce privata: rendila pubblica da GitHub, pacchetto `portfolio` → *Package settings* → *Change visibility* → *Public*, così il VPS la scarica senza credenziali.

Prova dal PC: `ssh -i deploy-portfolio -o IdentitiesOnly=yes deploy@IP_DEL_VPS id` deve rispondere `Versione non valida`, senza aprire una shell. Poi cancella la chiave dal PC: è già nei segreti.
