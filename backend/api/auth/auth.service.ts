import bcrypt from 'bcrypt';
import prisma from '../utils/prisma';
import * as usersService from '../users/users.service';

// Register a new user
export const registerUser = async (username: string, email: string, password: string) => {
  // Check if user already exists
  const existingUser = await usersService.getUserByEmail(email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Check if username is taken
  const existingUsername = await prisma.user.findUnique({
    where: { username },
  });
  if (existingUsername) {
    throw new Error('Username is already taken');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

// Login user
export const loginUser = async (email: string, password: string) => {
  // Find user by email (includes password for verification)
  const user = await usersService.getUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

