#!/bin/sh
# Crea la base de datos la primera vez y arranca Apache
php /var/www/html/api/tools/instalar-bd.php /var/www/bd.sql || echo "No se pudo preparar la base de datos; se intentará de nuevo en el próximo inicio."
exec apache2-foreground
