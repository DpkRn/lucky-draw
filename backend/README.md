# Backend API for Real-Time User Location

## Endpoints

- `POST /api/location` — Update a user's location
  - Body: `{ userId, lat, lng }`
- `GET /api/locations` — Get all user locations

## Getting Started

```
cd backend
node index.js
```

The server will run on port 5000 by default.
