FROM nginx:alpine
COPY *.html /usr/share/nginx/html/
COPY *.pdf /usr/share/nginx/html/
COPY *.css /usr/share/nginx/html/
COPY *.js /usr/share/nginx/html/
COPY *.png /usr/share/nginx/html/
COPY *.jpg /usr/share/nginx/html/
COPY *.svg /usr/share/nginx/html/
COPY blog /usr/share/nginx/html/blog
COPY nginx.conf /etc/nginx/templates/default.conf.template
CMD ["nginx", "-g", "daemon off;"]
