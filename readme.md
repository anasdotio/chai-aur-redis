# chai-aur-redis

A collection of Redis learning examples and Node.js demos built around caching, temporary data storage, and Redis-backed features.

## Repository Overview

This workspace contains small Redis-focused projects that demonstrate key Redis patterns with Express and Node.js.

### Folders

- `01-foundation-of-redis`
  - Concept notes for Redis fundamentals.
  - Contains a small documentation file explaining the basics of Redis.

- `02-setup-local-redis`
  - A local Redis + MongoDB caching example.
  - Demonstrates how to cache product data in Redis and fall back to MongoDB when needed.
  - Main app file: `src/index.js`
  - Model file: `src/models/productSchema.js`

- `03-site-banner`
  - A simple site banner storage API using Redis.
  - Stores banner text at Redis key `app:banner`.
  - Supports create, read, delete, and existence check operations.

- `04-login-opt-with-ttl`
  - A one-time password (OTP) example using Redis TTL.
  - Stores OTP values for phone numbers with a 30-second expiration.
  - Includes OTP generation, verification, and TTL inspection.

- `05-user-profile-cache-json-vs-hash`
  - Placeholder folder for comparing JSON cache storage versus Redis Hash structures.
  - Currently empty and ready for future examples.

## Services

This repo includes a `docker-compose.yml` file that can start local Redis and MongoDB services:

- `redis` on port `6379`
- `mongo` on port `27017`

To start services:

```bash
docker compose up -d
```

## How to Run Each Example

Each example folder is a separate Node.js app. Install dependencies and run the server from the folder.

### `02-setup-local-redis`

```bash
cd 02-setup-local-redis
npm install
npm start
```

Then open:

- `GET /redis` to verify Redis connectivity.
- `GET /products` to fetch cached products.

### `03-site-banner`

```bash
cd 03-site-banner
npm install
node src/index.js
```

API endpoints:

- `POST /banner` with `{ "message": "..." }`
- `GET /banner`
- `DELETE /banner`
- `GET /banner/exists`

### `04-login-opt-with-ttl`

```bash
cd 04-login-opt-with-ttl
npm install
node src/index.js
```

API endpoints:

- `POST /otp` with `{ "phone": "1234567890" }`
- `POST /otp/verify` with `{ "phone": "1234567890", "otp": "..." }`
- `GET /otp/:phone/ttl`

## Notes

- The sample servers in `03-site-banner` and `04-login-opt-with-ttl` both use port `3000`.
- Run only one app on port `3000` at a time, or update the port in `src/index.js`.
- `02-setup-local-redis` also depends on MongoDB, so start the `mongo` service first.

## Suggested Improvements

- Add sample data seeding for `02-setup-local-redis`.
- Fill `05-user-profile-cache-json-vs-hash` with a comparison example.
- Add README files for `03-site-banner` and `04-login-opt-with-ttl`.
