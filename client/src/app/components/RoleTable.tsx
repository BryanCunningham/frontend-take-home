'use client';

import { useEffect, useState } from 'react';
import { 
  Table, 
  // Box, 
  // Heading, 
  Text, 
  // Card, 
  Flex, 
  Button, 
  // TextField,
  ScrollArea,
  IconButton,
  Skeleton,
  Select,
  Callout,
  Popover,
  Dialog,
  TextField
} from '@radix-ui/themes';
import { CheckIcon, Cross1Icon, DotsHorizontalIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';

import { type Role } from '../api/roles/route';
import { useRoles } from '../context/RolesProvider';
import { formatDate } from '../utils';

const LoadingRow = () => {
  return (
    <Table.Row>
      <Table.Cell >
        <Skeleton  />
      </Table.Cell>
      <Table.Cell >
        <Skeleton />
      </Table.Cell>
      <Table.Cell>
        <Skeleton />
      </Table.Cell>
    </Table.Row>
  );
}

type EditingRole = {
  id: string;
  name: string;
}

const RolesTable = () => {
  const [editingRole, setEditingRole] = useState<EditingRole | null>(null);
  const [editedRoleName, setEditedRoleName] = useState('');
  const [isSavingRole, setIsSavingRole] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { rolesData, isRolesLoading, setRolesData } = useRoles();
  console.log('rolesData', {rolesData});
  const handleEditRole = (role: Role) => {
    setEditingRole({
      id: role.id,
      name: role.name,
    });
    setError(null);
  };

  const handleSaveRole = async (roleId: string) => {
    if (!editedRoleName.trim()) {
      setError('Role name cannot be empty');
      return;
    }

    setIsSavingRole(true);
    setError(null);

    try {
      const result = await fetch(`/api/roles/${roleId}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: editedRoleName.trim() }),
      });

      const updatedRole = await result.json();

      setRolesData({
        ...rolesData,
        roles: [...rolesData?.roles || [], updatedRole]
      });

      setEditingRole(null);
    } catch (err) {
      setError('Failed to update role. Please try again.');
      console.error('Error updating role:', err);
    } finally {
      setIsSavingRole(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingRole(null);
    setError(null);
  };

  return (
    <>
      <Flex direction="column" gap="4">
        {error && (
          <Callout.Root color="red">
            <Flex width="100%" justify="between" gap="2" align="center">
              <Flex gap="2" align="center">
                <Callout.Icon>
                  <ExclamationTriangleIcon />
                </Callout.Icon>
                <Callout.Text>
                  {error}
                </Callout.Text>
              </Flex>
              <Button variant="outline" color="red" onClick={() => window.location.reload()}>Refresh</Button>
            </Flex>
          </Callout.Root>
        )}

        <ScrollArea>
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Last updated</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="right"></Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            
            <Table.Body>
              {isRolesLoading && [...Array(10)].map((_, index) => (
                <LoadingRow key={index} />
              ))}
              {rolesData?.roles && rolesData.roles.map((role) => (
                <Table.Row key={role.id}>
                  <Table.Cell>
                    {editingRole?.id === role.id ? (
                      <TextField.Root 
                        value={editedRoleName}
                        onChange={(e) => setEditedRoleName(e.target.value)}
                        placeholder="Role name"
                      />
                    ) : (
                      <Text>{role.name}</Text>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Text>{role.description}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>{formatDate(new Date(role?.updatedAt || ''), { year: 'numeric', month: 'short', day: 'numeric' })}</Text>
                  </Table.Cell>
                  <Table.Cell align="right">
                    {editingRole?.id === role.id ? (
                      <Flex gap="2" justify="end">
                        <Button 
                          variant="soft" 
                          color="green" 
                          onClick={() => handleSaveRole(role.id)}
                          disabled={isSavingRole}
                          loading={isSavingRole}
                        >
                          <CheckIcon />
                          Save
                        </Button>
                        <Button 
                          variant="soft" 
                          color="gray" 
                          onClick={handleCancelEdit}
                          disabled={isSavingRole}
                        >
                          <Cross1Icon />
                          Cancel
                        </Button>
                      </Flex>
                    ) : (
                      <Popover.Root>
                          <Popover.Trigger>
                            <IconButton 
                              variant="ghost"
                              color="gray"
                              radius="full"
                              size="2"
                            >
                              <DotsHorizontalIcon />
                            </IconButton>
                          </Popover.Trigger>
                          <Popover.Content>
                            <Button variant="ghost" color="gray" onClick={() => handleEditRole(role)}>  
                              Edit role
                            </Button>
                          </Popover.Content>
                        </Popover.Root>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </ScrollArea>
        {rolesData?.roles && rolesData.roles.length > 0 && (
          <Text size="1" color="gray">
            Total roles: {rolesData.roles.length}
          </Text>
        )}
      </Flex>
    </>
  );
}

export default RolesTable;