# PgBoss UI

Dashboard for [pg-boss](https://github.com/timgit/pg-boss)

### Environment Variables

```
PGBOSS_DATABASE_URL=
DISABLE_AUTH=
AUTH_USERNAME=
AUTH_PASSWORD=
JWT_SECRET=
```

### Usage

```bash
npm install

# Install NX CLI
npm install -g nx

# Run PgBoss Dashboard and WebSocket server
nx run-many --target serve --all


# Open http://localhost:4200 in the browser
```
