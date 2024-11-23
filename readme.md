# Caso 5: Aplicación de Comercio

A Node.js e-commerce application built with Express and TypeScript.

## Live Demo

Visit the application at: [https://app-de-comercio.vercel.app/login](https://app-de-comercio.vercel.app/login)

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

### Deployment

The application is deployed on Vercel. To deploy your own instance:

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel --prod
   ```

## Database Seeding

Load sample data into the database:
```bash
npm run seed
```

## Testing

Run all tests:
```
npm test
```

Run tests in watch mode:
```
npm run test:watch
```

Generate coverage report:
```
npm run test:coverage
```

## Default Credentials

### Admin Account
- Username: `admin`
- Password: `1234`

### User Account
- Username: `usuario`
- Password: `usuario`

## API Documentation

For detailed API documentation, visit:
[Postman Documentation](https://documenter.getpostman.com/view/13303225/2sAXxY2TPU)