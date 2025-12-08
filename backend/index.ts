import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './api/auth/auth.routes.js';
import usersRoutes from './api/users/users.routes.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Server is running',
    port: port 
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

