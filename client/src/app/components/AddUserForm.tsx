import { Button, Flex, TextField, Text } from "@radix-ui/themes"
import { useCallback } from "react";

import { User } from "../api/users/route";
import RolesSelect from "./ui/RolesSelect";

type AddUserFormProps = {
  isLoading?: boolean;
  onSubmit: (user: Partial<User>) => void;
}

const AddUserForm = ({ isLoading = false, onSubmit }: AddUserFormProps) => {  
  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    console.log({ formData })
    const user = {
      first: formData.get("first") as string,
      last: formData.get("last") as string,
      roleId: formData.get("roleId") as string,
    };

    // Fake validation
    if (!user.first || !user.last || !user.roleId) {
      return;
    }
    

    onSubmit(user);
  }, [onSubmit]);

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <Flex direction="column" gap="4" width="100%">
        <Flex direction="column" gap="2">
          <Text as="label" htmlFor="first">First name</Text>
          <TextField.Root size="3" id="first" style={{ width: '100%' }} name="first" placeholder="First name" required />
        </Flex>
        <Flex direction="column" gap="2">
          <Text as="label" htmlFor="last">Last name</Text>
          <TextField.Root size="3" id="last" style={{ width: '100%' }} name="last" placeholder="Last name" required/>
        </Flex>
        <RolesSelect />
        <Button loading={isLoading} type="submit" size="3">Add user</Button>
      </Flex>
    </form>
  )
} 

export default AddUserForm;