import { NextApiRequest, NextApiResponse } from 'next';
import { Role } from '../../../shared/types';

// Mock data or fetch from your database
const roles: Role[] = [
  { id: '1', name: 'Admin' },
  { id: '2', name: 'User' },
  // Add more roles as needed
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json({ roles });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 