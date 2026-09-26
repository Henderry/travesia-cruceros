# Frontend (React + Vite)
FROM node:22-alpine AS frontend
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
ENV VITE_BASE_URL2=/api/
RUN npm run build

# Dependencias del API
FROM composer:2 AS vendor
WORKDIR /app
COPY backend/composer.json backend/composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --ignore-platform-reqs

# Apache + PHP + MariaDB: el frontend en /, el API en /api y la base de datos en el mismo contenedor
FROM php:8.3-apache
RUN apt-get update \
    && apt-get install -y --no-install-recommends mariadb-server \
    && rm -rf /var/lib/apt/lists/* \
    && docker-php-ext-install mysqli \
    && a2enmod rewrite \
    && sed -ri 's/^Listen 80$/Listen ${PORT}/' /etc/apache2/ports.conf \
    && sed -ri 's/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/' /etc/apache2/sites-available/000-default.conf \
    && sed -ri 's/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf \
    && printf 'date.timezone=America/Costa_Rica\nupload_max_filesize=10M\npost_max_size=12M\n' > /usr/local/etc/php/conf.d/travesia.ini
COPY docker/mariadb.cnf /etc/mysql/mariadb.conf.d/99-travesia.cnf
COPY docker/apache-mpm.conf /etc/apache2/conf-enabled/travesia-mpm.conf

ENV PORT=8080 \
    TZ=America/Costa_Rica \
    DB_HOST=127.0.0.1 \
    DB_USERNAME=travesia \
    DB_PASSWORD=travesia \
    DB_DBNAME=travesia

WORKDIR /var/www/html
COPY --from=frontend /app/dist/ ./
COPY backend/ ./api/
COPY --from=vendor /app/vendor/ ./api/vendor/
COPY bd.sql /var/www/bd.sql
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN cp api/config.example.php api/config.php \
    && mkdir -p api/Log /run/mysqld \
    && printf 'Require all denied\n' > api/Log/.htaccess \
    && chown -R www-data:www-data api/Log api/uploads \
    && chown mysql:mysql /run/mysqld \
    && chmod +x /usr/local/bin/entrypoint.sh \
    && (mariadbd --user=mysql &) \
    && until mariadb-admin ping --silent 2>/dev/null; do sleep 1; done \
    && mariadb -e "CREATE DATABASE travesia CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci; \
                   CREATE USER 'travesia'@'127.0.0.1' IDENTIFIED BY 'travesia'; \
                   GRANT ALL ON travesia.* TO 'travesia'@'127.0.0.1';" \
    && php api/tools/instalar-bd.php /var/www/bd.sql \
    && mariadb-admin shutdown

EXPOSE 8080
CMD ["entrypoint.sh"]
