FROM node:24-alpine AS build
WORKDIR /app
COPY . .
RUN npm ci 
RUN npm run build

FROM nginx:1.29.0-alpine
COPY --from=build /app/dist /var/www/html/
COPY --from=build /app/dist /usr/share/nginx/html
RUN chmod -R 755 /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
