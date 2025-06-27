# Telehealth Platform

## Overview
This project is a telehealth platform built using Node.js, Express, and TypeScript. It provides a RESTful API for managing clinics and their services, with a PostgreSQL database for data persistence.

## Features
- Create and manage clinics
- RESTful API for clinic operations
- PostgreSQL database integration
- Docker support for easy deployment

## Technologies Used
- Node.js
- Express
- TypeScript
- PostgreSQL
- Docker

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- PostgreSQL (version 12 or higher)
- Docker (for containerization)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd telehealth-platform
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the PostgreSQL database:
   - Create a database for the application.
   - Update the database configuration in `src/config/database.ts` with your database credentials.

### Running the Application
You can run the application in development mode using:
```
npm run dev
```

### Docker Setup
To run the application using Docker, follow these steps:
1. Build the Docker image:
   ```
   docker build -t telehealth-platform .
   ```

2. Start the services using Docker Compose:
   ```
   docker-compose up
   ```

### API Documentation
Refer to the API documentation for details on the available endpoints and their usage.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.