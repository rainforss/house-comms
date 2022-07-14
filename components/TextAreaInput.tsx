import {
  ChakraProps,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";
import { useField } from "formik";
import * as React from "react";

interface ITextAreaInputProps extends ChakraProps {
  id: string;
  name: string;
  label: string;
}

const TextAreaInput: React.FunctionComponent<ITextAreaInputProps> = ({
  id,
  name,
  label,
  ...chakraProps
}) => {
  const [field, meta, _helpers] = useField(name);
  return (
    <FormControl isInvalid={!!(meta.error && meta.touched)} {...chakraProps}>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <Textarea
        {...field}
        id={id}
        name={name}
        resize="vertical"
        rows={5}
        autoComplete="off"
      />
      {!!meta.error && <FormErrorMessage>{meta.error}</FormErrorMessage>}
    </FormControl>
  );
};

export default TextAreaInput;
