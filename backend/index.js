import express from 'express'
import { PrismaClient } from './generated/prisma';

const prisma = new PrismaClient();

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Server running on port 3000');
})