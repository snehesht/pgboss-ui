# PgBoss UI

Dashboard for [pg-boss](https://github.com/timgit/pg-boss)

### Environment Variables

```
PGBOSS_DATABASE_URL=postgres://postgres:password@localhost:5432/outlet_pgboss
DISABLE_AUTH=false
AUTH_USERNAME=admin
AUTH_PASSWORD=admin
JWT_SECRET=F5bK140uD1st3cKBSYuVg5VujUV1brr7
```

### Usage

```bash
npm install

# Install NX CLI
npm install -g nx

# Run PgBoss Dashboard and WebSocket server
nx run-many --target serve --all
```
