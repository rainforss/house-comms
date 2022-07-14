import { Box, Button, Center, Heading, useToast } from "@chakra-ui/react";
import { Formik, FormikProps, Form } from "formik";
import { useRouter } from "next/router";
import { NextPage } from "next/types";
import * as React from "react";
import TextInput from "../components/TextInput";
import { submitRegistration } from "../services/user";
import { withSessionSsr } from "../middleware/session";
import { registrationSchema } from "../lib/validation";
import SelectInput from "../components/SelectInput";

export interface RegistrationValues {
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  floor: "Main Floor" | "Second Floor" | "Basement" | "";
}

interface IRegisterProps {}

const Register: NextPage<IRegisterProps> = (props) => {
  const toast = useToast();
  const router = useRouter();
  return (
    <Center
      h="100vh"
      w="100%"
      bg="linear-gradient(to top right, #fc2c77 0%, #6c4079 100%)"
    >
      <Box w="50%" h="80vh" bg="white" borderRadius="10px" p="2rem">
        <Heading as="h2" p="1rem" py="2rem" fontWeight="normal">
          Tenant Registration
        </Heading>
        <Formik
          validationSchema={registrationSchema}
          initialValues={{
            phoneNumber: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
            floor: "",
          }}
          onSubmit={async (values, actions) => {
            try {
              const result = await submitRegistration(values);
              actions.setSubmitting(false);
              toast({
                title: "User account created.",
                description: `We've created your account ${result.data.firstName} for you. Now redirecting you to home page.`,
                status: "success",
                duration: 3000,
                isClosable: true,
                onCloseComplete: () => router.push("/"),
              });
            } catch (error: any) {
              return toast({
                title: error.response.data.error.name,
                description: error.response.data.error.message,
                status: "error",
                duration: 9000,
                isClosable: true,
              });
            }
          }}
        >
          {(props: FormikProps<RegistrationValues>) => {
            return (
              <Form
                style={{
                  padding: "0",
                  display: "flex",
                  width: "100%",
                  flexWrap: "wrap",
                }}
              >
                <SelectInput
                  name="floor"
                  id="floor"
                  label="Floor Level"
                  w="50%"
                  p="1rem"
                  options={["Main Floor", "Second Floor", "Basement"]}
                />
                <TextInput
                  name="phoneNumber"
                  id="phoneNumber"
                  type="text"
                  label="Phone Number (Make sure this is correct)"
                  w="50%"
                  p="1rem"
                />
                <TextInput
                  name="firstName"
                  id="firstName"
                  type="text"
                  label="First Name"
                  w="50%"
                  p="1rem"
                />
                <TextInput
                  name="lastName"
                  id="lastName"
                  type="text"
                  label="Last Name"
                  w="50%"
                  p="1rem"
                />
                <TextInput
                  name="password"
                  id="password"
                  type="password"
                  label="Password"
                  autoComplete="new-password"
                  w="50%"
                  p="1rem"
                />
                <TextInput
                  name="confirmPassword"
                  id="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  autoComplete="off"
                  w="50%"
                  p="1rem"
                />
                <Button
                  type="submit"
                  mx="auto"
                  my="2rem"
                  bgColor="#173f5e"
                  color="white"
                  px="2rem"
                  py="1.5rem"
                  isLoading={props.isSubmitting}
                >
                  REGISTER
                </Button>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </Center>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;

    if (user) {
      return {
        redirect: {
          permanent: false,
          destination: "/",
        },
        props: {},
      };
    }
    return {
      props: {},
    };
  }
);

export default Register;
