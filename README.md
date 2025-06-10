# NFT Store, Chat, and Forums Web Application

[TASKS](/TASKS.md)

- **NFT Store**: Buy, sell, and manage NFTs with metadata and asset storage.
- **Chat**: Real-time messaging with high-throughput storage.
- **Forums**: Structured discussion feeds with posts and replies.
- **Blockchain**: Local Ethereum network for NFT transactions.
- **Authentication**: Secure user management with Keycloak.
- **Caching**: Redis for NFT image URLs.
- **Monitoring**: Glitchtip for error tracking.
- **To be added local sort of paypal in the future**

## Architecture

- **Frontend**: React with Vite (`localhost:3000`).
- **API**: Apollo GraphQL (`localhost:4000/graphql`).
- **Microservices**:
  - **NFT Service**: Django, manages NFT products and metadata.
  - **Chat Service**: Node.js, handles real-time chat.
  - **Forum Service**: Django, manages feeds and posts.
  - **Auth Service**: Node.js with Keycloak.
  - **User Service**: Node.js with Keycloak.
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

## License

MIT License. See `LICENSE` for details.
