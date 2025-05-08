import {
  Badge,
  Box,
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

export default function CardMedia({
  uuid,
  mediaAsset,
  mediaTitle,
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
    fetchWrapper.post(`/api/media/delete-data`, { 
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
        colorScheme={mediaStatus === "Active" ? "green" : "gray"}
        w="20"
        p="2"
        pl={mediaStatus === "Active" ? "4" : "3"}
        borderRadius="3xl"
      >
        {mediaStatus}
      </Badge>
    );
  }, [mediaStatus]);

  const timeAgo = useMemo(() => {
    const referenceTime = updatedAt || createdAt;
    return formatDistanceToNow(new Date(referenceTime), { addSuffix: true });
  }, [createdAt, updatedAt]);  

  const lengthTitle = useMemo(() => {
    return mediaTitle.length > 27 ? `${mediaTitle.slice(0 , 27)}...` : mediaTitle
  }, [mediaTitle])

  return (
    <Card w="100%" bg="#FFFFFF" margin="auto" p="4">
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
          filter={mediaStatus === "Active" ? "none" : "grayscale(100%)"}
        />
      </Box>
      <CardBody p="0" mb="4">
        <Flex justify={"space-between"}>
          <Text fontWeight={600} fontSize="20px">
            {lengthTitle}
          </Text>
          <Menu isLazy>
            <MenuButton color="#495180">
              <Icon as={FaEllipsisV} />
            </MenuButton>
            <MenuList p="0">
              <MenuItem p="4" rounded="md" onClick={() => onEditClicked(uuid)}>
                <Text fontWeight="500">Edit</Text>
              </MenuItem>
              <MenuItem p="4" rounded="md" onClick={onDeleteClicked}>
                <Text fontWeight="500">Delete</Text>
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </CardBody>
      <CardFooter p="0">
        <Box
          w={"100%"}
          justifyContent={"space-between"}
          display={"flex"}
          alignItems={"center"}
        >
          {mediaStatus === "Active" ? (
            <Text bg={"#F2FFED"} borderColor={"#41B500"} color={"#41B500"} borderRadius={"100px"}>
              {statusBadge}
            </Text>
          ) : (
            <Text bg={"#F8F8F8"} borderColor={"#606060"} color={"gray"} borderRadius={"100px"}>
              {statusBadge}
            </Text>
          )}
          <Text fontWeight="300">{timeAgo}</Text>
        </Box>
      </CardFooter>
      {isOpenAlert && <SweetAlert alert={alert} handleDelete={handleDelete} />}
    </Card>
  );
}
