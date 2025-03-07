import { NextResponse } from 'next/server';

// TODO: Move to .env
const API_BASE_URL = 'http://localhost:3002';

// TODO: Find a way to share these types with the server
export type Role = {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  isDefault?: boolean;
}

export type RolesData = {
  roles: Role[];
  pages?: number;
  prev?: string;
  next?: string;
}

export const GET = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/roles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const roles: RolesData = await response.json();
    return NextResponse.json(roles);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    
    const response = await fetch(`${API_BASE_URL}/roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const newRole = await response.json();
    return NextResponse.json(newRole, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
