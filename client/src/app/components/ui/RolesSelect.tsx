import { Flex, Select, Text } from "@radix-ui/themes";

import { useRoles } from "@/app/context/RolesProvider";
import { useState } from "react";
import { Role } from "@/app/api/roles/route";

type RolesSelectProps = {
  name?: string;
  onChange?: (value: Role['id']) => void;
  value?: string;
}

const RolesSelect = ({ name = "roleId", value, onChange }: RolesSelectProps) => {
  const [internalValue, setInternalValue] = useState<Role['id'] | undefined>(value);

  const { roleIdToRoleNameMap } = useRoles();

  const handleChange = (value: string) => {
    setInternalValue(value);
    onChange?.(value);
  }

  return (
    <Flex direction="column" gap="2">
      <Text as="label" htmlFor="roleId">Role</Text>
      <Select.Root
        value={internalValue}
        onValueChange={handleChange}
        size="3"
        name={name}
        required
      >
        <Select.Trigger placeholder="Select a role" id={name} />
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
    </Flex>
  )
}

export default RolesSelect;