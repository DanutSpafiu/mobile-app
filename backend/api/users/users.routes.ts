import { Router } from 'express';
import * as usersController from './users.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Get current user's profile
router.get('/me', authenticate, usersController.getCurrentUser);

// Get all users (for admin or protected)
router.get('/', authenticate, usersController.getAllUsers);

// Get a user by ID
router.get('/:id', authenticate, usersController.getUserById);

// Update a user's profile (username, email)
router.put('/:id', authenticate, usersController.updateUser);

// Update a user's password
router.put('/:id/password', authenticate, usersController.updateUserPassword);

// Delete a user
router.delete('/:id', authenticate, usersController.deleteUser);

export default router;
