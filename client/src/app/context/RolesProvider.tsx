'use client';
import { createContext, useContext, useState, useEffect, ReactNode, SetStateAction, Dispatch, useMemo } from 'react';
import { Role } from '@/app/api/roles/route';


type RolesData = {
  roles: Role[];
  pages?: number;
  prev?: string;
  next?: string;
}

type RolesContextType = {
  rolesData: RolesData | undefined;
  isRolesLoading: boolean;
  rolesError: string | null;
  roleIdToRoleNameMap: Map<string, string>;
  setRolesData: Dispatch<SetStateAction<RolesData | undefined>>;
};

const RolesContext = createContext<RolesContextType | undefined>(undefined);

export const RolesProvider = ({ children }: { children: ReactNode }) => {
  const [rolesData, setRolesData] = useState<RolesData | undefined>(undefined);
  const [rolesError, setRolesError] = useState<string | null>(null);
  const [isRolesLoading, setIsRolesLoading] = useState(false);

  const roleIdToRoleNameMap = useMemo(() => {
    const rolesMap = new Map<string, string>();

    rolesData?.roles.forEach((role) => {
      rolesMap.set(role.id, role.name);
    });

    return rolesMap;
  }, [rolesData]);
  
   useEffect(() => {
    const fetchRoles = async () => {
      setIsRolesLoading(true);
      try {
        const response = await fetch('/api/roles');
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();

        setRolesData({
          roles: data.data,
          pages: data.pages,
          prev: data.prev,
          next: data.next,
        });

        setRolesError(null);
      } catch (err) {
        console.error('Error fetching roles:', err);
        setRolesError('Failed to load roles. Please try again.');
      } finally {
        setIsRolesLoading(false);
      }
    };

    fetchRoles();
  }, []);

  return (
    <RolesContext.Provider value={{ rolesData, isRolesLoading, rolesError, roleIdToRoleNameMap, setRolesData }}>
      {children}
    </RolesContext.Provider>
  );
};

export const useRoles = () => {
  const context = useContext(RolesContext);
  if (context === undefined) {
    throw new Error('useRoles must be used within a RolesProvider');
  }
  return context;
}; 