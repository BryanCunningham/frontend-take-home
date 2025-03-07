import { NextResponse } from 'next/server';
import { Role } from '../../../shared/types';

// Mock data or fetch from your database
const roles: Role[] = [
  { id: '1', name: 'Admin' },
  { id: '2', name: 'User' },
  // Add more roles as needed
];

export async function GET() {
  return NextResponse.json({ roles });
} 