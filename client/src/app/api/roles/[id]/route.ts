import { NextResponse } from 'next/server';

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
  const { id } = params;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (response.status === 404) {
      return NextResponse.json(
        { error: `Role with ID ${id} not found` },
        { status: 404 }
      );
    }

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const role = await response.json();
    return NextResponse.json(role);
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
  const { id } = params;
  
  try {
    const body = await request.json();
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.status === 404) {
      return NextResponse.json(
        { error: `Role with ID ${id} not found` },
        { status: 404 }
      );
    }

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const updatedRole = await response.json();
    return NextResponse.json(updatedRole);
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404) {
      return NextResponse.json(
        { error: `Role with ID ${id} not found` },
        { status: 404 }
      );
    }

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const deletedRole = await response.json();
    return NextResponse.json(deletedRole);
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