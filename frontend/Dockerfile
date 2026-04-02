FROM nginx:alpine

# Copy static files to nginx html directory
COPY . /usr/share/nginx/html

# Copy nginx config as template (will be processed at startup)
COPY nginx.conf /etc/nginx/conf.d/default.conf.template

# Copy and set up entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Remove the copied shell script from html directory
RUN rm -f /usr/share/nginx/html/docker-entrypoint.sh /usr/share/nginx/html/nginx.conf

# Expose port
EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
