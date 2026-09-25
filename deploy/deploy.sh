#!/bin/sh
# Aggiornamento del portfolio a una versione, in /srv/portfolio/deploy.sh sul VPS (di root, permessi 755).
# Lo lancia il job deploy della CI come utente deploy, con una chiave SSH che può eseguire
# solo questo script. A mano, anche per tornare a una versione precedente:
#
#   sudo /srv/portfolio/deploy.sh SHA_DEL_COMMIT
set -eu

tag="${1:-}"
case "$tag" in
  *[!0-9a-f]*) tag= ;;
esac
if [ "${#tag}" -ne 40 ]; then
  echo "Versione non valida: serve lo SHA completo di un commit" >&2
  exit 2
fi

cd /srv/portfolio
exec 9> /run/lock/portfolio-deploy.lock
flock 9

# La versione resta scritta nel .env: un compose up lanciato a mano non torna a latest.
sed -i "s/^TAG=.*/TAG=$tag/" .env
grep -qx "TAG=$tag" .env || { echo "Manca la riga TAG= nel .env" >&2; exit 1; }

docker compose pull web
docker compose up -d web

# Il sito deve rispondere entro un minuto.
i=0
until docker compose exec -T web node -e "fetch('http://localhost:3000/').then(r => process.exit(r.ok ? 0 : 1), () => process.exit(1))"; do
  i=$((i + 1))
  if [ "$i" -ge 30 ]; then
    docker compose logs web --tail 30
    echo "Il sito non risponde" >&2
    exit 1
  fi
  sleep 2
done

# Le immagini delle versioni vecchie: per tornare indietro si riscaricano da GHCR.
docker image ls --format '{{.Repository}}:{{.Tag}}' \
  | grep -E '^ghcr\.io/gabrielemenghi/portfolio:' \
  | grep -v ":$tag\$" \
  | xargs -r docker image rm > /dev/null 2>&1 || true

docker compose ps
echo "Portfolio aggiornato a $tag"
