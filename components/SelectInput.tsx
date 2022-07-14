import {
  ChakraProps,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import { useField } from "formik";
import * as React from "react";

interface ISelectInputProps extends ChakraProps {
  options: string[];
  id: string;
  name: string;
  label: string;
  disabled?: boolean;
}

const SelectInput: React.FunctionComponent<ISelectInputProps> = ({
  options,
  id,
  name,
  label,
  disabled,
  ...chakraProps
}) => {
  const [field, meta, _helpers] = useField(name);
  return (
    <FormControl isInvalid={!!(meta.error && meta.touched)} {...chakraProps}>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <Select
        id={id}
        name={name}
        disabled={disabled}
        onChange={field.onChange}
        value={field.value}
        placeholder=""
      >
        <option value="">-- Please Select an Option --</option>
        {options.map((o) => {
          return (
            <option key={o} value={o}>
              {o}
            </option>
          );
        })}
      </Select>
      {!!meta.error && <FormErrorMessage>{meta.error}</FormErrorMessage>}
    </FormControl>
  );
};

export default SelectInput;
