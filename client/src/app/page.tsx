import { Container, Tabs, Flex } from '@radix-ui/themes';

import { RoleTable, UserTable } from './components';
import { RolesProvider } from './context/RolesProvider';

export default function Home() {
  return (
    <Container size="3">
      <Tabs.Root defaultValue="users">
        <Flex direction="column" gap="5">
          <Tabs.List>
            <Tabs.Trigger value="users">Users</Tabs.Trigger>
            <Tabs.Trigger value="roles">Roles</Tabs.Trigger>
        </Tabs.List>
        <RolesProvider>
          <Tabs.Content value="users">
            <UserTable />
          </Tabs.Content>

          <Tabs.Content value="roles">
            <RoleTable />
          </Tabs.Content>
        </RolesProvider>
      </Flex>
      </Tabs.Root>
    </Container>
  );
}