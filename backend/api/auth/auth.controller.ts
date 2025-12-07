import { Request, Response } from 'express';
import * as authService from './auth.service';
import { generateToken } from '../utils/generateToken';

// POST /api/auth/register - Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Register user
    const user = await authService.registerUser(username, email, password);

    // Generate JWT token
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token,
    });
  } catch (error: any) {
    console.error('Error registering user:', error);
    
    if (error.message === 'User with this email already exists' || 
        error.message === 'Username is already taken') {
      return res.status(409).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Failed to register user' });
  }
};

// POST /api/auth/login - Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Login user
    const user = await authService.loginUser(email, password);

    // Generate JWT token
    const token = generateToken(user.id);

    res.status(200).json({
      message: 'Login successful',
      user,
      token,
    });
  } catch (error: any) {
    console.error('Error logging in:', error);
    
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Failed to login' });
  }
};

