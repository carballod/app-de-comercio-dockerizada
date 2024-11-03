# Caso 5: Aplicación de Comercio

A Node.js e-commerce application built with Express and TypeScript.

## Prerequisites

- Node.js (v14+)
- npm (v6+)
- MongoDB

## Installation

1. Clone the repository:
   ```
   git clone [repository-url]
   cd [project-directory]
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add:
   ```
   PORT=3000
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   MONGODB_URI=mongodb:database
   ```

## Running the Application

### Production Mode
1. Build the TypeScript files:

   ```
   npm run build
   ```

2. Start the server:
   ```
   npm start
   ```

### Development Mode

Run the application with hot-reload enabled:

```
npm run dev
```

The application will be available at `http://localhost:3000`.

## Default Credentials

### Admin Account

- Username: `admin`
- Password: `hashedPassword123`

### User Account

- Username: `usuario`
- Password: `prueba`

## API Documentation

For detailed API documentation, visit:
[Postman Documentation](https://documenter.getpostman.com/view/13303225/2sAXxY2TPU)
