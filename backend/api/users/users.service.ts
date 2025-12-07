import prisma from '../utils/prisma';
import { User } from '../../generated/prisma/client';
import bcrypt from 'bcrypt';

// Exclude password from user object
export const excludePassword = (user: User) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Get all users (without passwords)
export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return users;
};

// Get user by ID (without password)
export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
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

// Get user by email (includes password - for auth purposes only)
export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user;
};

// Update user
export const updateUser = async (id: string, data: { username?: string; email?: string }) => {
  const user = await prisma.user.update({
    where: { id },
    data,
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

// Update user password
export const updateUserPassword = async (id: string, hashedPassword: string) => {
  await prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });
};

// Delete user
export const deleteUser = async (id: string) => {
  await prisma.user.delete({
    where: { id },
  });
};

//Verify if the passowrd is right


// Compares a plain password with the hashed password from user record.
// Returns true if passwords match, otherwise false.
export const isPasswordCorrect = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  // If passwords are not hashed, fallback to plain string comparison (for dev/placeholder)
  // Prefer to always hash passwords in production for security.
  if (!hashedPassword.startsWith('$2')) {
    return plainPassword === hashedPassword;
  }
  return await bcrypt.compare(plainPassword, hashedPassword);
};
