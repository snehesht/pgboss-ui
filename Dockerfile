FROM node:18-alpine3.16

WORKDIR /home/node/app

COPY . .

RUN npm install && \
    npm install -g nx

RUN npx nx run-many --target=build --all

ENV NODE_ENV=production
ENV DISABLE_AUTH=true
ENV AUTH_USERNAME=admin
ENV AUTH_PASSWORD=admin
ENV JWT_SECRET=
ENV PGBOSS_DATABASE_URL=

EXPOSE 4200
EXPOSE 4201

CMD nx run-many --target serve --all --prod
