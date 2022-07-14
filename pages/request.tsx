import { Box, Button, Center, Heading, Link, useToast } from "@chakra-ui/react";
import { Form, Formik, FormikProps } from "formik";
import { useRouter } from "next/router";
import { NextPage } from "next/types";
import * as React from "react";
import TextInput from "../components/TextInput";
import { withSessionSsr } from "../middleware/session";
import NextLink from "next/link";
import SelectInput from "../components/SelectInput";
import TextAreaInput from "../components/TextAreaInput";
import { submitRequest } from "../services/request";

export interface RequestValues {
  requestedBy: string;
  requestedAt: Date;
  requestType: "Access Request";
  entranceAt: Date;
  accessTo: "Basement" | "Second Floor" | "Main Floor";
  requestReason: string;
}

interface IRequestProps {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    floor: string;
  };
}

const Request: NextPage<IRequestProps> = ({ user }) => {
  const toast = useToast();
  const router = useRouter();
  return (
    <Center
      h="100vh"
      w="100%"
      bg="linear-gradient(to top right, #bdebaa 0%, #7dd956 100%)"
    >
      <Box w="50%" h="90vh" bg="white" borderRadius="10px" p="2rem">
        <Heading
          as="h2"
          p="1rem"
          py="2rem"
          fontWeight="normal"
          textAlign="center"
        >
          NEW REQUEST
        </Heading>
        <Formik
          initialValues={{
            requestedBy: user.firstName + " " + user.lastName,
            requestedAt: new Date(),
            entranceAt: new Date(),
            requestType: "Access Request",
            accessTo: "Basement",
            requestReason: "",
          }}
          onSubmit={async (values, actions) => {
            try {
              await submitRequest(values);
              actions.setSubmitting(false);
              toast({
                title: "Request submitted",
                description: `Your request has been successfully submitted. Now redirecting you to home page.`,
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
          {(props: FormikProps<RequestValues>) => {
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
                  name="requestedBy"
                  id="requestedBy"
                  type="text"
                  label="Requestor"
                  disabled
                  w="100%"
                  p="1rem"
                />
                <SelectInput
                  name="requestType"
                  id="requestType"
                  label="Request Type"
                  options={["Access Request"]}
                  w="100%"
                  p="1rem"
                />
                <SelectInput
                  name="accessTo"
                  id="accessTo"
                  label="Access To"
                  options={["Basement", "Main Floor", "Second Floor"]}
                  w="100%"
                  p="1rem"
                />
                <TextAreaInput
                  name="requestReason"
                  id="requestReason"
                  label="Reason"
                  w="100%"
                  p="1rem"
                />
                <Box
                  w="100%"
                  display="flex"
                  justifyContent={{ base: "space-between" }}
                  alignItems={{ base: "center" }}
                  p="1rem"
                >
                  <Button
                    type="submit"
                    isLoading={props.isSubmitting}
                    my="4rem"
                    bgColor="#173f5e"
                    color="white"
                    px="2rem"
                    py="1.5rem"
                  >
                    SUBMIT
                  </Button>
                  <Button
                    as="a"
                    isLoading={props.isSubmitting}
                    my="4rem"
                    colorScheme="red"
                    px="2rem"
                    py="1.5rem"
                  >
                    CANCEL
                  </Button>
                </Box>
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

    if (!user) {
      return {
        redirect: {
          permanent: false,
          destination: "/login",
        },
      };
    }
    return {
      props: { user },
    };
  }
);

export default Request;
