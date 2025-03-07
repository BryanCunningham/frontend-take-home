import { NextResponse } from 'next/server';

import { type Role } from '@/app/api/roles/route';

export type User = {
  id: string;
  first: string;
  last: string;
  roleId: string;
  role?: Role["name"];
  photo?: string;
  createdAt: string;
  updatedAt: string;
}

export type UsersResponse = {
  data: User[];
  pages: number;
  prev: number;
  next: number;
}

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const includeRoles = searchParams.get("includeRoles") === "true";
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 10;

  try {
    const usersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!usersResponse.ok) {
      throw new Error(`Error: ${usersResponse.status}`);
    }

    const users: UsersResponse = await usersResponse.json();

    if (includeRoles) {
      const rolesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (rolesResponse.ok) {
        const roles = await rolesResponse.json();
        
        const usersWithRoles = users.data.map((user: User) => {
          const role = roles.data.find((role: Role) => role.id === user.roleId);
          return {
            ...user,
            role: role ? role.name : null,
          };
        });

        const responseWithRoles: UsersResponse = {
          ...users,
          data: usersWithRoles,
        };

        return NextResponse.json(responseWithRoles);
      }
    }

    if (!usersResponse.ok) {
      throw new Error(`Error: ${usersResponse.status}`);
    }

    return NextResponse.json(users);
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
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const newUser = await response.json();
    return NextResponse.json(newUser, { status: 201 });
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