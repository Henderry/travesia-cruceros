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

# Apache + PHP: el frontend en / y el API en /api
FROM php:8.3-apache
RUN docker-php-ext-install mysqli \
    && a2enmod rewrite \
    && sed -ri 's/^Listen 80$/Listen ${PORT}/' /etc/apache2/ports.conf \
    && sed -ri 's/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/' /etc/apache2/sites-available/000-default.conf \
    && sed -ri 's/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf \
    && printf 'date.timezone=America/Costa_Rica\nupload_max_filesize=10M\npost_max_size=12M\n' > /usr/local/etc/php/conf.d/travesia.ini
ENV PORT=8080 TZ=America/Costa_Rica
WORKDIR /var/www/html
COPY --from=frontend /app/dist/ ./
COPY backend/ ./api/
COPY --from=vendor /app/vendor/ ./api/vendor/
COPY bd.sql /var/www/bd.sql
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN cp api/config.example.php api/config.php \
    && mkdir -p api/Log \
    && printf 'Require all denied\n' > api/Log/.htaccess \
    && chown -R www-data:www-data api/Log api/uploads \
    && chmod +x /usr/local/bin/entrypoint.sh
EXPOSE 8080
CMD ["entrypoint.sh"]
