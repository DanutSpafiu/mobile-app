import { Request, Response } from 'express';
import * as usersService from './users.service';
import bcrypt from 'bcrypt';
import prisma from '../utils/prisma';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

// GET /api/users - Get all users (protected route, typically for admin)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await usersService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

// GET /api/users/me - Get current authenticated user's profile
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // req.user is set by auth middleware
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await usersService.getUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
};

// GET /api/users/:id - Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await usersService.getUserById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

// PUT /api/users/:id - Update user profile (username, email)
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;

    // Validate that the authenticated user can only update their own profile
    if (req.user?.id !== id) {
      return res.status(403).json({ error: 'Forbidden: You can only update your own profile' });
    }

    // Validation
    if (!username && !email) {
      return res.status(400).json({ error: 'At least one field (username or email) is required' });
    }

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await usersService.getUserByEmail(email);
      if (existingUser && existingUser.id !== id) {
        return res.status(409).json({ error: 'Email is already taken' });
      }
    }

    const updatedUser = await usersService.updateUser(id, { username, email });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// PUT /api/users/:id/password - Update user password
export const updateUserPassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Validate that the authenticated user can only update their own password
    if (req.user?.id !== id) {
      return res.status(403).json({ error: 'Forbidden: You can only update your own password' });
    }

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    // Get user with password to verify current password
    // First get user to find email
    const userProfile = await usersService.getUserById(id);
    if (!userProfile) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user with password included for verification
    const user = await usersService.getUserByEmail(userProfile.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await usersService.isPasswordCorrect(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await usersService.updateUserPassword(id, hashedPassword);

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
};

// DELETE /api/users/:id - Delete user account
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate that the authenticated user can only delete their own account
    if (req.user?.id !== id) {
      return res.status(403).json({ error: 'Forbidden: You can only delete your own account' });
    }

    await usersService.deleteUser(id);
    res.status(200).json({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user account' });
  }
};
