# chai-aur-redis

A collection of Redis learning examples and Node.js demos built around caching, temporary data storage, and Redis-backed features.

## Repository Overview

This workspace contains small Redis-focused projects that demonstrate key Redis patterns with Express and Node.js.

### Folders

- `01-foundation-of-redis`
  - Concept notes for Redis fundamentals.
  - Contains documentation explaining Redis basics and common data structures.

- `02-setup-local-redis`
  - A local Redis + MongoDB caching example.
  - Demonstrates how to cache product data in Redis and fall back to MongoDB on cache miss.
  - Main app file: `src/index.js`
  - Model file: `src/models/productSchema.js`

- `03-site-banner`
  - A simple site banner storage API using Redis.
  - Stores banner text at Redis key `app:banner`.
  - Supports banner create, read, delete, and existence-check operations.

- `04-login-opt-with-ttl`
  - A one-time password (OTP) example using Redis TTL.
  - Stores OTP values for phone numbers with a 30-second expiration.
  - Includes OTP generation, verification, single-use invalidation, and TTL inspection.

- `05-user-profile-cache-json-vs-hash`
  - A Redis caching comparison example for user profiles.
  - Demonstrates storing profile data as JSON strings vs Redis Hashes.
  - Includes endpoints for writing and reading both JSON and Hash-based profiles.

- `06-email-queue-with-redis-lists`
  - A Redis-backed email job queue example using list operations.
  - Adds email jobs with `LPUSH` and processes jobs with `RPOP`.
  - Demonstrates a simple queue worker pattern and job payload serialization.

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

### `05-user-profile-cache-json-vs-hash`

```bash
cd 05-user-profile-cache-json-vs-hash
npm install
node src/index.js
```

API endpoints:

- `POST /user/:id/json` to cache profile data as JSON
- `GET /user/:id/json` to read JSON-stored profile data
- `POST /user/:id/hash` to cache profile data as a Redis Hash
- `GET /user/:id/hash` to read Hash-stored profile data

### `06-email-queue-with-redis-lists`

```bash
cd 06-email-queue-with-redis-lists
npm install
node src/index.js
```

API endpoints:

- `POST /emails` with `{ "to": "...", "subject": "...", "body": "..." }` to enqueue an email job
- `GET /emails/process-one` to dequeue and process a single email job

## Notes

- The sample servers in `02-setup-local-redis`, `03-site-banner`, `04-login-opt-with-ttl`, `05-user-profile-cache-json-vs-hash`, and `06-email-queue-with-redis-lists` all use port `3000` by default.
- Run only one app on port `3000` at a time, or update the port in `src/index.js`.
- `02-setup-local-redis` also depends on MongoDB, so start the `mongo` service before running it.
- The `06-email-queue-with-redis-lists` example demonstrates a simple queue flow; it does not include retry or persistent failure handling.

## Suggested Improvements

- Add sample data seeding for `02-setup-local-redis`.
- Add README files for `03-site-banner`, `04-login-opt-with-ttl`, `05-user-profile-cache-json-vs-hash`, and `06-email-queue-with-redis-lists`.
- Add production-ready queue handling and retry logic for `06-email-queue-with-redis-lists`.
