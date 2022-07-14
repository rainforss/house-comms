import { AddIcon } from "@chakra-ui/icons";
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  ButtonGroup,
  Center,
  Spinner,
  StackDivider,
  VStack,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import RequestCard from "../components/RequestCard";
import { useRequests } from "../hooks/useRequests";
import { withSessionSsr } from "../middleware/session";
import { updateRequest } from "../services/request";

interface HomePageProps {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    floor: string;
  };
}

const Home: NextPage<HomePageProps> = ({ user }) => {
  const router = useRouter();
  const { requests, isLoading, isError, mutateRequests } = useRequests();

  const actionRequest = async (id: string, info: any) => {
    await updateRequest(id, user.firstName + " " + user.lastName, info);
    await mutateRequests();
  };
  return (
    <Center
      h="100vh"
      w="100%"
      bg="linear-gradient(to top right, #fc2c77 0%, #6c4079 100%)"
    >
      <Box
        h={{ base: "95vh", md: "90vh" }}
        w="90%"
        bg="white"
        borderRadius="10px"
      >
        <Box
          display={{ base: "flex" }}
          height="10vh"
          justifyContent={{ base: "space-between" }}
          alignItems={{ base: "center" }}
          p={{ base: "1rem", md: "2rem" }}
          borderBottom="0.5px solid rgba(0,0,0,0.1)"
        >
          <ButtonGroup variant="outline" spacing="6">
            <Button
              colorScheme="whatsapp"
              variant="solid"
              leftIcon={<AddIcon />}
              onClick={() => router.push("/request")}
            >
              NEW REQUEST
            </Button>
          </ButtonGroup>
          <Avatar
            name={`${user.firstName} ${user.lastName}`}
            src="https://bit.ly/broken-link"
          >
            <AvatarBadge boxSize="1.25em" bg="green.500">
              {user.floor.charAt(0)}
            </AvatarBadge>
          </Avatar>
        </Box>
        {!isLoading && !isError && (
          <VStack
            p={{ base: "1rem", md: "2rem" }}
            w="100%"
            height="80vh"
            overflowY="auto"
            overflowX="hidden"
            divider={<StackDivider borderColor="gray.200" />}
            spacing={4}
            align="stretch"
            justifyContent="flex-start"
          >
            {requests.map((r) => (
              <RequestCard
                key={r._id.toString()}
                request={r}
                actionRequest={actionRequest}
                authorized={r.accessTo === user.floor}
              />
            ))}
          </VStack>
        )}
        {isLoading && (
          <Center h="50vh">
            <Spinner size="xl" />
          </Center>
        )}
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
      props: {
        user: user,
      },
    };
  }
);

export default Home;
