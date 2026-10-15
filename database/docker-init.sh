#!/usr/bin/env bash
# Import schema + seed on first run; skip when milk_store already has tables.
set -euo pipefail

HOST="${MYSQL_HOST:-mysql}"
USER="${MYSQL_USER:-root}"
PASS="${MYSQL_ROOT_PASSWORD:-root}"
DB="${MYSQL_DATABASE:-milk_store}"
SQL_DIR="${SQL_DIR:-/sql}"

mysql_cmd() {
  mysql --protocol=TCP -h"$HOST" -P"${MYSQL_PORT:-3306}" -u"$USER" -p"$PASS" --default-character-set=utf8mb4 "$@"
}

echo "[db-init] Waiting for MySQL at ${HOST}..."
ready=0
for _ in $(seq 1 60); do
  if mysql_cmd -e "SELECT 1" >/dev/null 2>&1; then
    ready=1
    break
  fi
  sleep 2
done

if [ "$ready" != "1" ]; then
  echo "[db-init] ERROR: MySQL not ready after waiting."
  exit 1
fi

exists="$(
  mysql_cmd -N -e \
    "SELECT COUNT(*) FROM information_schema.tables
     WHERE table_schema='${DB}' AND table_name='products';" 2>/dev/null || echo 0
)"

if [ "${exists}" = "1" ]; then
  echo "[db-init] Database '${DB}' already imported — skip."
  exit 0
fi

echo "[db-init] First run — importing schema + seed data..."
mysql_cmd < "${SQL_DIR}/milk_store.sql"
mysql_cmd "${DB}" < "${SQL_DIR}/seed_data.sql"
echo "[db-init] Import completed."
