import { useState } from "react";
import {
    Avatar,
    Badge,
    HStack,
    IconButton,
    Image,
    Link,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useDisclosure,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { RiExternalLinkLine, RiPencilLine, RiDeleteBin5Line } from "react-icons/ri";
import moment from "moment";
import { useRouter } from "next/router";
import { fetchWrapper } from "../../helpers";
import { userService } from "../../services";

export default function TableArticle(props) {
    const toast = useToast();
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedImage, setSelectedImage] = useState("");
    const [onSubmission, setOnSubmission] = useState(false);

    const { data, handleEditNews } = props;

    const handleEdit = (item) => {
        handleEditNews(item);
    };

    const deleteData = (uuid) => {
        setOnSubmission(true);
        fetchWrapper
            .post("/api/news/delete-data", {
                user_id: userService.userValue.id,
                uuid: uuid,
            })
            .then((res) => {
                const toastId = "input-data-toast";
                if (res.success) {
                    if (!toast.isActive(toastId)) {
                        toast({
                            id: toastId,
                            title: "Article successfully deleted",
                            status: "success",
                            duration: 1500,
                            isClosable: true,
                            position: "top",
                        });
                    }
                    setTimeout(() => router.reload(), 2000);
                } else {
                    if (!toast.isActive(toastId)) {
                        toast({
                            id: toastId,
                            title: res.message,
                            status: "error",
                            duration: 3000,
                            isClosable: true,
                            position: "top",
                        });
                    }
                }
            })
            .finally(() => setOnSubmission(false));
    };

    const handleImageClick = (assets) => {
        setSelectedImage(assets);
        onOpen();
    };

    return (
        <>
            <TableContainer>
                <Table variant="simple" rounded="lg">
                    <Thead bg="#EBEBEB">
                        <Tr>
                            <Th textAlign="center">No.</Th>
                            <Th textAlign="center">Asset</Th>
                            <Th textAlign="center">Title</Th>
                            <Th textAlign="center">Description</Th>
                            <Th textAlign="center">Label</Th>
                            <Th textAlign="center">Uploaded By</Th>
                            <Th textAlign="center">Created At</Th>
                            <Th textAlign="center">Updated At</Th>
                            <Th textAlign="center">Link</Th>
                            <Th textAlign="center">Action</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data?.map((item, index) => (
                            <Tr key={item.id}>
                                <Td textAlign="center">{index + 1}</Td>
                                <Td textAlign="center">
                                    <Avatar
                                        boxSize="10"
                                        src={item.assets}
                                        cursor="pointer"
                                        onClick={() => handleImageClick(item.assets)}
                                    />
                                </Td>
                                <Td textAlign="center">
                                    <Text fontSize={{ base: "xs", xl: "sm" }}>{item.title}</Text>
                                </Td>
                                <Td textAlign="center">
                                    <Text fontSize={{ base: "xs", xl: "sm" }}>{item.description}</Text>
                                </Td>
                                <Td textAlign="center">
                                    <Badge bg="#EB1C23" textColor="white" px={4} py={1} borderRadius="md">
                                        {item.category.category || "-"}
                                    </Badge>
                                </Td>
                                <Td textAlign="center">
                                    <HStack justifyContent="center">
                                        <Text fontSize="sm">{item.user.name || "-"}</Text>
                                    </HStack>
                                </Td>
                                <Td textAlign="center">
                                    <Text fontSize="sm">
                                        {moment(item.created_at).format("YYYY-MM-DD HH:mm")}
                                    </Text>
                                </Td>
                                <Td textAlign="center">
                                    <Text fontSize="sm">
                                        {item.updated_at !== item.created_at
                                            ? moment(item.updated_at).format("YYYY-MM-DD HH:mm")
                                            : "—"}
                                    </Text>
                                </Td>
                                <Td textAlign="center">
                                    <Link href={item.link} isExternal color="blue.500">
                                        <HStack justifyContent="center">
                                            <Text fontSize="sm">Visit</Text>
                                            <RiExternalLinkLine />
                                        </HStack>
                                    </Link>
                                </Td>
                                <Td textAlign="center">
                                    <HStack justifyContent="center" spacing={2}>
                                        <IconButton
                                            aria-label="Edit"
                                            size="sm"
                                            colorScheme="blue"
                                            icon={<RiPencilLine />}
                                            onClick={() => handleEdit(item)}
                                        />
                                        <IconButton
                                            aria-label="Delete"
                                            size="sm"
                                            colorScheme="red"
                                            icon={<RiDeleteBin5Line />}
                                            onClick={() => deleteData(item.uuid)}
                                            isDisabled={onSubmission}
                                        />
                                    </HStack>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>

            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Preview</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" justifyContent="center" pb="8">
                        <Image src={selectedImage} alt="Preview" maxH="500px" borderRadius="lg" />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
