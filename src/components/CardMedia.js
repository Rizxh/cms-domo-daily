import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useToast,
} from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import SweetAlert from "./SweetAlert";
import { fetchWrapper } from "../../helpers";
import { userService } from "../../services";
import { ChevronDownIcon } from "@chakra-ui/icons";

export default function CardMedia({
  uuid,
  mediaAsset,
  mediaUuid,
  mediaTitle,
  mediaDescription,
  mediaCategory,
  mediaStatus,
  createdAt,
  updatedAt,
  onEditClicked,
}) {
  const router = useRouter();
  const toast = useToast();
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [alert, setAlert] = useState({});

  const onDeleteClicked = useCallback(() => {
    setIsOpenAlert(true);
    setAlert({
      type: "warning",
      message: "Are you sure you want to delete this media?",
    });
  }, []);

  const handleDelete = useCallback(() => {
    fetchWrapper.post(`/api/article/delete-data`, {
      user_id: userService.userValue.id,
      uuid: uuid,
    }).then(() => {
      toast({
        title: "Media deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setTimeout(() => {
        router.reload();
      }, 1500);
    });
  }, [uuid, toast, router]);

  const statusBadge = useMemo(() => {
    return (
      <Badge
        variant="outline"
        colorScheme={mediaStatus === "Published" ? "green" : "gray"}
        w="95px"
        p="2"
        textAlign={"center"}
        borderRadius="3xl"
      >
        {mediaStatus}
      </Badge>
    );
  }, [mediaStatus]);

  // const timeAgo = useMemo(() => {
  //   const referenceTime = updatedAt || createdAt;
  //   return formatDistanceToNow(new Date(referenceTime), { addSuffix: true });
  // }, [createdAt, updatedAt]);  

  // const lengthTitle = useMemo(() => {
  //   return mediaTitle.length > 27 ? `${mediaTitle.slice(0 , 27)}...` : mediaTitle
  // }, [mediaTitle])

  return (
    <Card w="100%" bg="#FFFFFF" margin="auto" p="4" shadow="xl" mb="20" pt="4">
      <CardBody p="0" mb="4">
        <Flex justify={"space-between"} align="center" mb="4">
          <Menu isLazy>
            <MenuButton>
              <Button bg="#EB1C23" textColor="white">
                Action <ChevronDownIcon />
              </Button>
            </MenuButton>
            <MenuList p="0">
              <MenuItem p="4" rounded="md" onClick={() => onEditClicked(mediaUuid)}>
                <Text fontWeight="500">Edit</Text>
              </MenuItem>
              <MenuItem p="4" rounded="md" onClick={onDeleteClicked}>
                <Text fontWeight="500">Delete</Text>
              </MenuItem>
            </MenuList>
          </Menu>
          <Text fontSize="md" color="gray.800">
            {mediaCategory} | {statusBadge} 
          </Text>
        </Flex>
      </CardBody>
      <Box align={"center"}>
        <Text fontWeight={600} fontSize="30px" pb="5" >
          {/* {lengthTitle} */}{mediaTitle}
        </Text>
      </Box>
      <Box position="relative" width="100%" paddingTop="28%" mb="4">
        <Image
          position="absolute"
          top="0"
          left="0"
          w="100%"
          h="100%"
          src={mediaAsset}
          alt={mediaTitle}
          borderRadius="lg"
          objectFit="contain"
          filter={mediaStatus === "Published" ? "none" : "grayscale(100%)"}
        />
      </Box>
      <Text fontWeight={400} fontSize="20px" pb="8">
        {/* {lengthTitle} */}{mediaDescription}
      </Text>
      <CardFooter p="0">
      </CardFooter>
      {isOpenAlert && <SweetAlert alert={alert} handleDelete={handleDelete} />}
    </Card>
  );
}
