import { ChangeEventHandler, useCallback, useState } from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { TextField } from "@radix-ui/themes";

type SearchFieldProps = {
  onChange?: (searchTerm: string) => void;
  placeholder?: string;
  searchTerm: string;
}

const SearchField = ({ onChange, placeholder = "Search", searchTerm }: SearchFieldProps) => {
  const [internalSearchTerm, setInternalSearchTerm] = useState(searchTerm);

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>((event) => {
    const value = event.target.value;
    setInternalSearchTerm(value);
    onChange?.(value);
  }, [onChange]);

  return (
    <TextField.Root 
      size="3"
      placeholder={placeholder}
      value={internalSearchTerm}
      onChange={handleChange}
    >
      <TextField.Slot>
        <MagnifyingGlassIcon height="16" width="16" />
      </TextField.Slot>
    </TextField.Root>
  )
}

export default SearchField;