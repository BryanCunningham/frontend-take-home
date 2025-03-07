import { NextResponse } from 'next/server';

// TODO: Find a way to share these types with the server
export type Role = {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  isDefault?: boolean;
} 

export const GET = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const roles = await response.json();
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
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles`, {
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

export const getRoleById = async (id: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return { error: `Role with ID ${id} not found`, status: 404 };
      }
      throw new Error(`Error: ${response.status}`);
    }
    
    return { data: await response.json(), status: 200 };
  } catch (error) {
    console.error(`Error fetching role ${id}:`, error);
    return { error: `Failed to fetch role ${id}`, status: 500 };
  }
}

export const updateRoleById = async (id: string, roleData: any) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roleData),
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return { error: `Role with ID ${id} not found`, status: 404 };
      }
      throw new Error(`Error: ${response.status}`);
    }
    
    return { data: await response.json(), status: 200 };
  } catch (error) {
    console.error(`Error updating role ${id}:`, error);
    return { error: `Failed to update role ${id}`, status: 500 };
  }
}

export const deleteRoleById = async (id: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return { error: `Role with ID ${id} not found`, status: 404 };
      }
      throw new Error(`Error: ${response.status}`);
    }
    
    return { data: await response.json(), status: 200 };
  } catch (error) {
    console.error(`Error deleting role ${id}:`, error);
    return { error: `Failed to delete role ${id}`, status: 500 };
  }
}
