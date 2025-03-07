'use client';

import { useState, useEffect } from 'react';
import { 
  Table, 
  Callout,
  Text, 
  Flex,
  Button,
  TextField,
  ScrollArea,
  Avatar,
  Skeleton,
  Popover,
  IconButton,
  Dialog,
  Select
} from '@radix-ui/themes';
import { CheckIcon, Cross1Icon, DotsHorizontalIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { User, UsersResponse } from '@/app/api/users/route';
import { Pagination } from './ui';
import { formatDate } from '../utils';
import { useRoles } from '../context/RolesProvider';
import { SearchField } from './ui';

type UsersData = {
  users: User[];
  pages?: number;
  prev?: number;
  next?: number;
}

const formatUsersData = (data: UsersResponse) => {
  const { data: users, pages, prev, next } = data;

  return {
    users,
    pages,
    prev,
    next,
  };
}

const userResultsCache = new Map<number, UsersData>();

const LoadingRow = () => {
  return (
    <Table.Row>
      <Table.Cell>
        <Skeleton width="32px" height="32px" />
      </Table.Cell>
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

const UserTable = () => {
  const [usersData, setUsersData] = useState<UsersData | undefined>(undefined);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  // Need the role data to show updates to role names and to build select options
  const { roleIdToRoleNameMap } = useRoles();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/users');
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data: UsersResponse = await response.json();
        
        const formattedData = formatUsersData(data);

        setUsersData(formattedData);

        userResultsCache.set(1, formattedData);

        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);
  
  const filteredUsers = usersData?.users.filter(user => {
    const searchString = searchTerm.toLowerCase();
    const fullName = `${user.first} ${user.last}`.toLowerCase();
    return fullName.includes(searchString) || user.roleId.toLowerCase().includes(searchString);
  }) || [];

  const handleEditUser = (user: User) => {
    setEditedUser({
      id: user.id,
      first: user.first,
      last: user.last,
      roleId: user.roleId
    });
    setError(null);
  };

  const handleDeleteUser = async (userId: string) => {
    setIsSavingUser(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      const deletedUser = await response.json();
      const remainingUsers = usersData?.users.filter(user => user.id !== deletedUser.id) || [];

      setUsersData({
        ...usersData,
        users: remainingUsers
      });
      
      setEditedUser({});
    } catch (err) {
      setError('Failed to delete user. Please try again.');
      console.error('Error deleting user:', err);
    } finally {
      setIsSavingUser(false);
    }
  };

  const handleSaveUser = async (userId: string) => {
    if (!editedUser.first?.trim() || !editedUser.last?.trim()) {
      setError('First and last name are required');
      return;
    }
    setIsSavingUser(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const updatedUser = await response.json();
      const otherUsers = usersData?.users.filter(user => user.id !== userId) || [];

      setUsersData({
        ...usersData,
        users: [...otherUsers, updatedUser]
      });
      
      setEditedUser({});
    } catch (err) {
      setError('Failed to update user. Please try again.');
      console.error('Error updating user:', err);
    } finally {
      setIsSavingUser(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedUser({});
    setError(null);
  };

  const handlePageChange = async (page: number) => {
    const cachedResults = userResultsCache.get(page);

    if (cachedResults) {
      setUsersData(cachedResults);
    } else {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/users?includeRoles=true&page=${page}`);
        const data: UsersResponse = await response.json();
        const formattedData = formatUsersData(data);

        userResultsCache.set(page, formattedData);

        setUsersData(formattedData);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <Flex direction="column" gap="5">
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

        <SearchField placeholder="Search by name..." onChange={setSearchTerm} searchTerm={searchTerm} />

          <ScrollArea>
            <Table.Root variant="surface">
              <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>User</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Joined</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            
            <Table.Body>
              {isLoading && [...Array(10)].map((_, index) => (
                <LoadingRow key={index} />
              ))}
              {filteredUsers.length > 0 && !isLoading && (
                filteredUsers.map((user) => (
                  <Table.Row key={user.id} align="center">
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        <Avatar
                          size="2"
                          src={user.photo}
                          fallback={`${user.first[0]}${user.last[0]}`}
                          radius="full"
                        />
                        {editedUser?.id === user.id ? (
                          <Flex direction="column" gap="2">
                            <TextField.Root 
                              value={editedUser.first}
                              onChange={(e) => setEditedUser({
                                ...editedUser,
                                first: e.target.value
                              })}
                              placeholder="First name"
                            />
                            <TextField.Root 
                              value={editedUser.last}
                              onChange={(e) => setEditedUser({
                                ...editedUser,
                                last: e.target.value
                              })}
                              placeholder="Last name"
                            />
                          </Flex>
                        ) : (
                          <Text>{user.first} {user.last}</Text>
                        )}
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>
                      {editedUser?.id === user.id ? (
                        <Select.Root 
                          value={editedUser.roleId}
                          onValueChange={(value) => setEditedUser({
                            ...editedUser,
                            roleId: value
                          })}
                        >
                          <Select.Trigger />
                          <Select.Content>
                            {[...roleIdToRoleNameMap.entries()].map(([roleId, roleName]) => {
                              return (
                                <Select.Item key={roleId} value={roleId}>
                                  {roleName}
                                </Select.Item>
                              )
                            })}
                          </Select.Content>
                        </Select.Root>
                      ) : (
                        <Text>{roleIdToRoleNameMap.get(user.roleId) || user.roleId}</Text>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <Text>
                        {formatDate(new Date(user.createdAt), { year: 'numeric', month: 'short', day: 'numeric' })}
                      </Text>
                    </Table.Cell>
                    <Table.Cell align="right">
                      {editedUser?.id === user.id ? (
                        <Flex gap="2" justify="end">
                          <Button 
                            variant="soft" 
                            color="green"
                            loading={isSavingUser}
                            onClick={() => handleSaveUser(user.id)}
                            disabled={isLoading}
                          >
                            <CheckIcon />
                            Save
                          </Button>
                          <Button 
                            variant="soft" 
                            color="gray" 
                            onClick={handleCancelEdit}
                            disabled={isLoading}
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
                            <Flex direction="column" gap="2">
                              <Button variant="ghost" color="gray" onClick={() => handleEditUser(user)}>  
                                Edit user
                              </Button>
                              <Dialog.Root>
                                <Dialog.Trigger>
                                  <Button variant="ghost" color="red">Delete user</Button>
                                </Dialog.Trigger>
                                <Dialog.Content>
                                  <Dialog.Title>Delete user</Dialog.Title>
                                  <Flex direction="column" gap="4">
                                    <Dialog.Description>
                                      Are you sure? The user <Text weight="bold">{user.first} {user.last}</Text> will be deleted permanently.
                                    </Dialog.Description>
                                    <Flex gap="4" justify="end">
                                      <Dialog.Close>
                                        <Button variant="surface" color="gray">
                                          Cancel
                                        </Button>
                                      </Dialog.Close>
                                      <Button variant="surface" color="red" onClick={() => handleDeleteUser(user.id)}>
                                        Delete
                                      </Button>
                                    </Flex>
                                  </Flex>
                                </Dialog.Content>
                              </Dialog.Root>
                            </Flex>
                          </Popover.Content>
                        </Popover.Root>
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
              {usersData?.pages && usersData?.pages > 1 && (
                <Table.Row>
                  <Table.Cell colSpan={4}>
                    <Pagination 
                      currentPage={typeof usersData?.next === 'number' ? usersData.next - 1 : usersData?.pages} 
                      totalPages={usersData?.pages || 1} 
                      onPageChange={handlePageChange} 
                    />
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
        </ScrollArea>
      </Flex>
    </>
  );
} 

export default UserTable;