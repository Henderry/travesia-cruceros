#!/bin/sh
# Con la base de datos local, se inicia MariaDB antes que Apache
if [ "$DB_HOST" = "127.0.0.1" ] || [ "$DB_HOST" = "localhost" ]; then
    mariadbd --user=mysql &
    intentos=0
    until mariadb-admin ping --silent 2>/dev/null; do
        intentos=$((intentos + 1))
        [ "$intentos" -ge 60 ] && break
        sleep 1
    done
fi
php /var/www/html/api/tools/instalar-bd.php /var/www/bd.sql || echo "No se pudo preparar la base de datos."
exec apache2-foreground
