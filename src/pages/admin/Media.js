import {
    Box,
    Divider,
    Heading,
    HStack,
    useToast,
    Grid,
    Image,
    Button,
    useDisclosure,
    VStack,
    SimpleGrid,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchWrapper } from "../../../helpers";
import { userService } from "../../../services";
import { FaPlus } from "react-icons/fa";

export default function Media() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const router = useRouter();
    const [medias, setMedias] = useState([]);
    const [filterText, setFilterText] = useState("");
    const [categoriesData, setCategoriesData] = useState([]);
    const toast = useToast();

    useEffect(() => {
        if (router.isReady) {
            getAllMedia();
        }
    }, [router]);

    useEffect(() => {
        getCategory(filterText);
    }, []);

    const getAllMedia = async () => {
        fetchWrapper.get(`/api/article/get-data`).then((res) => {
            if (res.success) {
                setMedias(res.data);
            }
        });
    };

    const getCategory = async () => {
        fetchWrapper.get(`/api/category/get-data`).then((res) => {
            if (res.success) {
                setCategoriesData(res.data)
            } else {
                if (!toast.isActive(inputDataToast)) {
                    toast({
                        id: inputDataToast,
                        title: res.message,
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                        position: "top",
                    })
                }
            }
        })
    }

    return (
        <VStack p={{ base: "4", xl: "8" }} align="stretch" minH="100vh" gap="5" spacing={4}>
            <SimpleGrid m="2" columns={{ base: "1", lg: "2" }} gap="4" w="100%">
                <Heading fontSize={{ base: "lg", lg: "2xl" }} fontWeight="500" textAlign={{ base: "center", lg: "left" }}>
                    Media Storage
                </Heading>
                <HStack justifyContent={{ base: "center", lg: "flex-end" }}>
                    {(userService?.userValue?.role === "Super Admin" ||
                        userService?.userValue?.role === "Admin" ||
                        userService?.userValue?.role === "Media") && (
                            <Button
                                leftIcon={<FaPlus />}
                                size={{ base: "sm", lg: "md" }}
                                variant="solid"
                                bg={"#CB1517"}
                                color={'white'}
                                rounded="xl"
                                p="2"
                                // onClick={() => {
                                //     router.push(
                                //         `/admin/media`
                                //     );
                                // }}
                                onClick={onOpen}
                                _hover={{
                                    bg: '#a41a1c'
                                }}
                            >
                                ADD IMAGE
                            </Button>
                        )}
                    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Add The Assets</ModalHeader>
                            <ModalCloseButton />

                            <ModalBody pb={6}>
                                <HStack>
                                    <Box
                                        rounded={"lg"}
                                        bg={"white"}
                                        boxShadow={"lg"}
                                        p={{ base: 4, xl: 6 }}
                                        w="100%"
                                    >
                                        <SimpleGrid columns={{ base: "1", md: "1" }} justify="space-between" gap="4">
                                            <HStack gap={2} maxW={{ base: "100%", md: "100%" }} p="2" borderRadius="md">
                                               
                                            </HStack>
                                        </SimpleGrid>
                                    </Box>
                                </HStack>
                            </ModalBody>

                            <ModalFooter>
                                <Button colorScheme='blue' mr={3}>
                                    Save
                                </Button>
                                <Button onClick={onClose}>Cancel</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </HStack>
            </SimpleGrid>

            <Grid templateColumns='repeat(4, 1fr)' gap={5}>
                <Box rounded="lg" bg={"white"} boxShadow="lg" p={{ base: 2, xl: 4 }} w="100%">
                    <Image w={"auto"} h={"auto"} src='https://bit.ly/dan-abramov' alt='Dan Abramov' />
                </Box>
                <Box rounded="lg" bg={"white"} boxShadow="lg" p={{ base: 2, xl: 4 }} w="100%">
                    <Image w={"auto"} h={"auto"} src='https://bit.ly/dan-abramov' alt='Dan Abramov' />
                </Box>
                <Box rounded="lg" bg={"white"} boxShadow="lg" p={{ base: 2, xl: 4 }} w="100%">
                    <Image w={"auto"} h={"auto"} src='https://bit.ly/dan-abramov' alt='Dan Abramov' />
                </Box>
                <Box rounded="lg" bg={"white"} boxShadow="lg" p={{ base: 2, xl: 4 }} w="100%">
                    <Image w={"auto"} h={"auto"} src='https://bit.ly/dan-abramov' alt='Dan Abramov' />
                </Box>
                <Box rounded="lg" bg={"white"} boxShadow="lg" p={{ base: 2, xl: 4 }} w="100%">
                    <Image w={"auto"} h={"auto"} src='https://bit.ly/dan-abramov' alt='Dan Abramov' />
                </Box>
                <Box rounded="lg" bg={"white"} boxShadow="lg" p={{ base: 2, xl: 4 }} w="100%">
                    <Image w={"auto"} h={"auto"} src='https://bit.ly/dan-abramov' alt='Dan Abramov' />
                </Box>
                <Box rounded="lg" bg={"white"} boxShadow="lg" p={{ base: 2, xl: 4 }} w="100%">
                    <Image w={"auto"} h={"auto"} src='https://bit.ly/dan-abramov' alt='Dan Abramov' />
                </Box>
            </Grid>
            <Divider mt="5" mb="5" />
        </VStack>
    );
}
