import { NextResponse } from 'next/server';

const API_BASE_URL = 'http://localhost:3002';

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
  const { id } = await params;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (response.status === 404) {
      return NextResponse.json(
        { error: `User with ID ${id} not found` },
        { status: 404 }
      );
    }

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const user = await response.json();
    return NextResponse.json(user);
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

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
  const { id } = await params;

  try {
    const body = await request.json();
    
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.status === 404) {
      return NextResponse.json(
        { error: `User with ID ${id} not found` },
        { status: 404 }
      );
    }

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const updatedUser = await response.json();
    return NextResponse.json(updatedUser);
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

export const DELETE = async (request: Request, { params }: { params: { id: string } }) => {
  const { id } = params;
  
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404) {
      return NextResponse.json(
        { error: `User with ID ${id} not found` },
        { status: 404 }
      );
    }

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const deletedUser = await response.json();
    return NextResponse.json(deletedUser);
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