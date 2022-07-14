import { CheckIcon, NotAllowedIcon } from "@chakra-ui/icons";
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Input,
  useToast,
} from "@chakra-ui/react";
import * as React from "react";
import { HomeRequest } from "../lib/types";

interface IRequestCardProps {
  request: HomeRequest;
  actionRequest: (id: string, info: any) => void;
  authorized?: boolean;
}

const RequestCard: React.FunctionComponent<IRequestCardProps> = ({
  request,
  actionRequest,
  authorized,
}) => {
  const [tempStatus, setTempStatus] = React.useState<
    "Approved" | "Rejected" | ""
  >("");
  const [notes, setNotes] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const toast = useToast();

  return (
    <Box
      w="100%"
      h={{ base: "auto", md: "125px" }}
      borderRadius="10px"
      p="1.5rem"
      bg="linear-gradient(to top right, #fc2c77 0%, #6c4079 100%)"
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      justifyContent={{ base: "flex-start" }}
      style={{ gap: "3rem" }}
      alignItems={{ base: "center" }}
    >
      <Avatar
        name={request.requestedBy}
        src="https://bit.ly/broken-link"
      ></Avatar>
      <Box h={{ base: "auto", md: "100%" }} color="white">
        <Box
          display="flex"
          flexDirection={{ base: "column", md: "row" }}
          justifyContent={{ base: "flex-start" }}
          alignItems={{ base: "center" }}
          style={{ gap: "1rem" }}
        >
          <small>{request.requestType}</small>
          <small>{request.accessTo}</small>
          <small>
            {new Date(request.entranceAt).toLocaleString("en-US", {
              timeZone: "MST",
            })}
          </small>
        </Box>
        <Box as="p" mt={{ base: "0.5rem", md: "0" }}>
          {request.requestReason}
        </Box>
      </Box>
      {request.approvalBy && (
        <Avatar name={request.approvalBy} src="https://bit.ly/broken-link">
          <AvatarBadge
            boxSize="1.25em"
            bg={request.approvalStatus === "Approved" ? "green.500" : "tomato"}
          />
        </Avatar>
      )}
      {request.approvalNote && (
        <Box h="100%" color="white">
          <Box
            display="flex"
            flexDirection={{ base: "column", md: "row" }}
            justifyContent={{ base: "flex-start" }}
            alignItems={{ base: "center" }}
            style={{ gap: "1rem" }}
          >
            <small>{request.approvalStatus}</small>
            {request.approvalAt && (
              <small>
                {new Date(request.approvalAt).toLocaleString("en-US", {
                  timeZone: "MST",
                })}
              </small>
            )}
          </Box>
          <Box as="p" mt={{ base: "0.5rem", md: "0" }}>
            {request.approvalNote}
          </Box>
        </Box>
      )}

      {!request.approvalBy && authorized && (
        <ButtonGroup variant="outline" spacing="6" borderRadius="0.5rem">
          <IconButton
            colorScheme="whatsapp"
            variant={tempStatus === "Approved" ? "solid" : "outline"}
            aria-label="Search database"
            icon={<CheckIcon />}
            onClick={() => setTempStatus("Approved")}
            isLoading={submitting}
            disabled={submitting}
          />
          <IconButton
            colorScheme="blue"
            variant={tempStatus === "Rejected" ? "solid" : "outline"}
            aria-label="Search database"
            icon={<NotAllowedIcon />}
            onClick={() => setTempStatus("Rejected")}
            isLoading={submitting}
            disabled={submitting}
          />
        </ButtonGroup>
      )}
      {!request.approvalStatus && tempStatus && (
        <Input
          maxW={{ base: "400px", md: "45%" }}
          bg="white"
          placeholder="Please enter your notes"
          value={notes}
          onChange={(e) => setNotes(() => e.target.value)}
        />
      )}
      {!request.approvalStatus && tempStatus && notes && (
        <Button
          colorScheme="whatsapp"
          onClick={async () => {
            setSubmitting(true);
            await actionRequest(request._id.toString(), {
              approvalStatus: tempStatus,
              approvalAt: new Date(),
              approvalNote: notes,
            });
            setSubmitting(false);
          }}
        >
          SUBMIT
        </Button>
      )}
    </Box>
  );
};

export default RequestCard;
