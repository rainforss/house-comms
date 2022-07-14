import { Box, Button, Center, Heading, Link, useToast } from "@chakra-ui/react";
import { Form, Formik, FormikProps } from "formik";
import { useRouter } from "next/router";
import { NextPage } from "next/types";
import * as React from "react";
import TextInput from "../components/TextInput";
import { login } from "../services/user";
import { withSessionSsr } from "../middleware/session";
import NextLink from "next/link";

export interface LoginValues {
  phoneNumber: string;
  password: string;
}

interface ILoginProps {}

const Login: NextPage<ILoginProps> = () => {
  const toast = useToast();
  const router = useRouter();
  return (
    <Center
      h="100vh"
      w="100%"
      bg="linear-gradient(to top right, #bdebaa 0%, #7dd956 100%)"
    >
      <Box w="30%" h="80vh" bg="white" borderRadius="10px" p="2rem">
        <Heading as="h2" p="1rem" py="2rem" fontWeight="normal">
          Tenant Login
        </Heading>
        <Formik
          initialValues={{
            phoneNumber: "",
            password: "",
          }}
          onSubmit={async (values, actions) => {
            try {
              const result = await login(values);
              actions.setSubmitting(false);
              toast({
                title: "Successfully Logged In.",
                description: `Welcome back ${result.data.firstName}. Now redirecting you to home page.`,
                status: "success",
                duration: 3000,
                isClosable: true,
                onCloseComplete: () => router.push("/"),
              });
            } catch (error: any) {
              return toast({
                title: error.error.name,
                description: error.error.message,
                status: "error",
                duration: 9000,
                isClosable: true,
              });
            }
          }}
        >
          {(props: FormikProps<LoginValues>) => {
            return (
              <Form
                style={{
                  padding: "0",
                  display: "flex",
                  width: "100%",
                  flexWrap: "wrap",
                }}
              >
                <TextInput
                  name="phoneNumber"
                  id="phoneNumber"
                  type="text"
                  label="Phone Number"
                  w="100%"
                  p="1rem"
                />
                <TextInput
                  name="password"
                  id="password"
                  type="password"
                  label="Password"
                  autoComplete="current-password"
                  w="100%"
                  p="1rem"
                />
                <Button
                  type="submit"
                  isLoading={props.isSubmitting}
                  mx="auto"
                  my="4rem"
                  bgColor="#173f5e"
                  color="white"
                  px="2rem"
                  py="1.5rem"
                >
                  LOGIN
                </Button>
              </Form>
            );
          }}
        </Formik>
        <Center>
          <NextLink href="/register" passHref>
            <Link mx="auto">No account? Click here to register.</Link>
          </NextLink>
        </Center>
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

export default Login;
