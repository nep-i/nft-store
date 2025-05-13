# NFT Store, Chat, and Forums Web Application

## Overview

This project is a blockchain-based web application featuring an NFT store, real-time chat, and discussion forums. It uses a microservices architecture with a React frontend, GraphQL API, and containerized services via Docker. The infrastructure optimizes data storage using PostgreSQL for structured data and MongoDB for flexible, high-write data, minimizing redundancy. Redis handles caching, MinIO stores NFT assets, and Nginx manages routing. Authentication is powered by Keycloak, and a local Ethereum blockchain is simulated with Ganache. Monitoring is provided by Glitchtip.

## Features

- **NFT Store**: Buy, sell, and manage NFTs with metadata and asset storage.
- **Chat**: Real-time messaging with high-throughput storage.
- **Forums**: Structured discussion feeds with posts and replies.
- **Blockchain**: Local Ethereum network for NFT transactions.
- **Authentication**: Secure user management with Keycloak.
- **Caching**: Redis for NFT image URLs.
- **Monitoring**: Glitchtip for error tracking.

## Architecture

- **Frontend**: React with Vite (`localhost:3000`).
- **API**: Apollo GraphQL (`localhost:4000/graphql`).
- **Microservices**:
  - **NFT Service**: Django, manages NFT products and metadata.
  - **Chat Service**: Node.js, handles real-time chat.
  - **Forum Service**: Django, manages feeds and posts.
  - **Auth Service**: Node.js with Keycloak.
- **Databases**:
  - **PostgreSQL**: Stores `User`, `Feed`, `Post`, `Transaction` (structured, relational data).
  - **MongoDB**: Stores `Chat`, `Message`, `Product`, `Cart`, `Favorites`, `History` (unstructured, high-write data).
- **Caching**: Redis for NFT art URLs.
- **Storage**: MinIO for NFT assets.
- **Routing**: Nginx for load balancing.
- **Blockchain**: Ganache for local Ethereum network.
- **Containerization**: Docker with Docker Compose.

## Data Management

To address data crossover concerns:

- **PostgreSQL**: Handles relational data (e.g., users, transactions, posts) with strong consistency and joins.
- **MongoDB**: Manages schemaless, high-write data (e.g., chats, messages, NFT metadata) for flexibility and performance.
- **No Redundancy**: Messages are stored only in MongoDB and referenced in PostgreSQL (e.g., `posts.message_id`), avoiding duplication.
- **GraphQL**: Abstracts queries across both databases using the repository pattern for consistent access.

## Prerequisites

- Docker and Docker Compose
- Node.js 24 (for local development)
- Python 3.11 (for Django services)
- Git

## Setup Instructions

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd nft-store
   ```

2. **Create Directory Structure**:

   ```bash
   mkdir -p frontend graphql nft-service chat-service forum-service auth-service nginx persistent-data/db persistent-data/kc-data
   ```

3. **Save Configuration Files**:

   - Place the `Dockerfile` in `frontend/Dockerfile`.
   - Save `docker-compose.yml` in the root directory.
   - Save `nginx/nginx.conf` in `nginx/nginx.conf`.
   - Store `postgres_schema.sql` in `persistent-data/db/postgres_schema.sql`.
   - Store `mongo_db.js` in `persistent-data/db/mongo_db.js`.
   - Save `schema.graphql` in `graphql/schema.graphql`.

4. **Configure Frontend**:

   - Create `frontend/package.json`:
     ```json
     {
       "name": "frontend",
       "version": "1.0.0",
       "scripts": {
         "dev": "vite",
         "build": "tsc && vite build",
         "preview": "vite preview"
       },
       "dependencies": {
         "react": "^18.2.0",
         "react-dom": "^18.2.0",
         "@apollo/client": "^3.7.0",
         "graphql": "^16.6.0"
       },
       "devDependencies": {
         "vite": "^4.0.0",
         "@vitejs/plugin-react": "^3.0.0",
         "typescript": "^4.9.0"
       }
     }
     ```
   - Create `frontend/vite.config.ts`:

     ```typescript
     import { defineConfig } from "vite";
     import react from "@vitejs/plugin-react";

     export default defineConfig({
       plugins: [react()],
       server: {
         port: 3000,
         host: true,
         proxy: {
           "/graphql": {
             target: "http://graphql:4000",
             changeOrigin: true,
             ws: true,
           },
           "/auth": {
             target: "http://keycloak:8080",
             changeOrigin: true,
           },
         },
       },
       build: {
         outDir: "dist",
       },
     });
     ```

5. **Initialize Databases**:

   - **PostgreSQL**:
     ```bash
     docker-compose up -d postgres
     ```
     The schema in `persistent-data/db/postgres_schema.sql` is loaded automatically.
   - **MongoDB**:
     ```bash
     docker-compose up -d mongodb
     ```
     The schema in `persistent-data/db/mongo_db.js` is loaded automatically.

6. **Run Glitchtip Migrations**:

   ```bash
   docker-compose up -d glitchtip
   docker-compose exec glitchtip ./manage.py makemigrations
   docker-compose exec glitchtip ./manage.py migrate
   ```

7. **Run the Application**:

   ```bash
   docker-compose up -d
   ```

8. **Access Services**:
   - Frontend: `http://localhost:3000`
   - GraphQL: `http://localhost:4000/graphql`
   - Keycloak: `http://localhost:8080`
   - Glitchtip: `http://localhost:8000`

## Development

- **Frontend**: Run `npm run dev` in `frontend/` for live reloading.
- **Services**: Modify code in `nft-service`, `chat-service`, etc., and restart containers (`docker-compose restart <service>`).
- **Database Changes**:
  - Update `persistent-data/db/postgres_schema.sql` or `persistent-data/db/mongo_db.js` and recreate containers (`docker-compose up -d --build`).
  - For Django services, apply migrations (`python manage.py migrate`).

## Testing

- **GraphQL Queries**: Use Apollo Studio at `http://localhost:4000/graphql`.
- **Redis Caching**: Verify with `redis-cli -h localhost -p 6379` (e.g., `GET nft:art:<product_id>`).
- **Errors**: Monitor via Glitchtip at `http://localhost:8000`. Register at `http://localhost:8000` to appear in the `users_user` table.

## Notes

- **Data Crossover**: Messages are stored in MongoDB and referenced in PostgreSQL to prevent duplication. Use the repository pattern for consistent data access.
- **Single Database Option**: Consolidating to PostgreSQL with JSONB is possible but may reduce performance for high-write operations (e.g., chats). Test under load before switching.
- **Nginx Configuration**: The current `nginx.conf` routes only to `frontend` and `auth-service`. Uncomment other upstreams and locations as services are implemented.
- **Security**:
  - Update `SECRET_KEY`, MinIO, and Keycloak credentials for production.
  - Secure environment variables (e.g., `VITE_API_URL`).
- **Blockchain**: Ganache is used locally. For production, integrate with a testnet (e.g., Sepolia).
- **Performance**:
  - Add indexes to PostgreSQL (`users.id`, `posts.feed_id`) and MongoDB (`chats.id`, `products.id`).
  - Use Redis for session management or rate limiting if needed.
- **Devbox**: The provided `devbox.json` includes Node.js, Python, and Docker Compose for development. Run `devbox shell` to set up the environment.

## License

MIT License. See `LICENSE` for details.
