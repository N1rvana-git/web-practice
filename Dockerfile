# Simple static site container for Rikas landing pages
FROM nginx:1.27-alpine

# Remove default nginx assets
RUN rm -rf /usr/share/nginx/html/*

# Copy static site into nginx web root
COPY index.html rikas.html /usr/share/nginx/html/
COPY styles.css rikas.css modal.css /usr/share/nginx/html/
COPY script.js modal.js /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/

# Expose default nginx port
EXPOSE 80

# Use default nginx entrypoint/cmd
