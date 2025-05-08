import {
    Box,
    Button,
    Divider,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    HStack,
    Input,
    InputGroup,
    InputLeftElement,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    SimpleGrid,
    Text,
    useBreakpointValue,
    useDisclosure,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FaAngleLeft, FaAngleRight, FaPlus } from "react-icons/fa";
import TableUser from "@/components/TableUser";
import { fetchWrapper } from "../../../helpers";
import { userService } from "../../../services";

export default function User() {
    const router = useRouter();
    const toast = useToast();
    const modalRef = useRef(null);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isEditOpen,
        onOpen: openEditModal,
        onClose: closeEditModal,
    } = useDisclosure();

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [role, setRole] = useState();
    const [password, setPassword] = useState();

    const [currentEditedUser, setCurrentEditedUser] = useState(null);
    const [editId, setEditId] = useState(null);
    const [editedName, setEditedName] = useState("");
    const [editedEmail, setEditedEmail] = useState("");
    const [editedRole, setEditedRole] = useState("");
    const [editedPassword, setEditedPassword] = useState("");

    const [errorTooltip, setErrorTooltip] = useState(false);
    const [onSubmission, setOnSubmission] = useState(false);
    const isMobile = useBreakpointValue({ base: true, md: false });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalUser, setTotalUser] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    // const [limitData, setLimitData] = useState(10);
    const [filterText, setFilterText] = useState("");
    const [userData, setUserData] = useState([]);
    const [limitData, setLimitData] = useState(() => {
        return parseInt(localStorage.getItem('limitData') || 10);
    });

    useEffect(() => {
        localStorage.setItem('limitData', limitData);
    }, [limitData]);

    useEffect(() => {
        if (router.isReady) {
            getUser(currentPage, limitData, filterText);
        }
    }, [router]);

    const getUser = async (page, limit, keywords) => {
        fetchWrapper.get(`/api/user/get-data?page=${page}&limit=${limit}&keywords=${keywords}`).then((res) => {
            const inputDataToast = "input-data-toast";
            if (res.success) {
                setUserData(res.data);
                setTotalPages(res.totalPages);
                setTotalUser(res.total);
            } else {
                if (!toast.isActive(inputDataToast)) {
                    toast({
                        inputDataToast,
                        title: res.message,
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                        position: "top",
                    });
                }
            }
        });
    };

    const onUserSubmit = async () => {
        if (name && email && role && password) {
            setOnSubmission(true);

            fetchWrapper
                .post(`/api/user/create-data`, {
                    user_id: userService.userValue.id,
                    name: name,
                    email: email,
                    role: role,
                    password: password,
                })
                .then((res) => {
                    const inputDataToast = "input-data-toast";
                    if (res.success) {
                        if (!toast.isActive(inputDataToast)) {
                            toast({
                                inputDataToast,
                                title: "User successfully added",
                                status: "success",
                                duration: 1500,
                                isClosable: true,
                                position: "top",
                            });
                        }
                        setTimeout(() => router.reload(), 1500);
                    } else {
                        if (!toast.isActive(inputDataToast)) {
                            toast({
                                inputDataToast,
                                title: res.message,
                                status: "error",
                                duration: 3000,
                                isClosable: true,
                                position: "top",
                            });
                        }
                    }
                });
        } else {
            setErrorTooltip(true);
            setTimeout(() => setErrorTooltip(false), 3000);
        }
    };

    const onEditClicked = (user) => {
        setCurrentEditedUser(user);
        setEditId(user.uuid);
        setEditedName(user.name);
        setEditedEmail(user.email);
        setEditedRole(user.role);
        openEditModal();
    };

    const onUserEditSubmit = async () => {
        if (editedName && editedEmail) {
            setOnSubmission(true);

            const formData = new FormData();
            formData.append("user_id", userService.userValue.id)
            formData.append("uuid", editId);
            formData.append("name", editedName);
            formData.append("email", editedEmail);
            formData.append("role", editedRole);

            if (editedPassword) {
                formData.append("password", editedPassword);
            }

            fetchWrapper.postForm(`/api/user/update-data`, formData).then((res) => {
                const inputDataToast = "input-data-toast";
                if (res.success) {
                    if (!toast.isActive(inputDataToast)) {
                        toast({
                            inputDataToast,
                            title: "User Updated.",
                            status: "success",
                            duration: 1500,
                            isClosable: true,
                            position: "top",
                        });
                    }
                    setTimeout(() => router.reload(), 1500);
                } else {
                    if (!toast.isActive(inputDataToast)) {
                        toast({
                            inputDataToast,
                            title: res.message,
                            status: "error",
                            duration: 3000,
                            isClosable: true,
                            position: "top",
                        });
                    }
                }
            });
        } else {
            setErrorTooltip(true);
            setTimeout(() => setErrorTooltip(false), 3000);
        }
    };

    return (
        <VStack
            p={{ base: "4", xl: "8" }}
            align="stretch"
            minH="100vh"
            gap="5"
            spacing={4}
        >
            {/* Top Info */}
            <SimpleGrid m="2" columns={{ base: "1", lg: "2" }} gap="4" w="100%">
                <Heading
                    fontSize={{ base: "lg", lg: "2xl" }}
                    fontWeight="500"
                    textAlign={{ base: "center", lg: "left" }}
                >
                    User
                </Heading>
                <HStack justifyContent={{ base: "center", lg: "flex-end" }}>
                    <Button
                        leftIcon={<FaPlus />}
                        size={{ base: "sm", lg: "md" }}
                        variant="solid"
                        bg={"#CB1517"}
                        color={"white"}
                        rounded="xl"
                        p="2"
                        onClick={onOpen}
                        _hover={{
                            bg: "#a41a1c",
                        }}
                    >
                        ADD
                    </Button>
                    <Modal
                        scrollBehavior="inside"
                        height="100px"
                        isOpen={isOpen}
                        onClose={onClose}
                        size={{ base: "sm", xl: "xl" }}
                        isCentered
                    >
                        <ModalOverlay />
                        <ModalContent ref={modalRef}>
                            <ModalHeader bg={"#CB1517"} color="white" roundedTop="md">
                                Add Data
                            </ModalHeader>
                            <ModalBody p="8">
                                <VStack gap="4" align="left">
                                    <FormControl
                                        id="name"
                                        isInvalid={!name && errorTooltip}
                                        isRequired
                                    >
                                        <FormLabel fontSize={{ base: "sm", lg: "md" }}>
                                            Name
                                        </FormLabel>
                                        <Input
                                            placeholder="Enter name"
                                            size={{ base: "sm", xl: "md" }}
                                            value={name}
                                            onChange={(event) => {
                                                setName(event.target.value);
                                            }}
                                        />
                                        <FormErrorMessage>Enter name!</FormErrorMessage>
                                    </FormControl>
                                    <FormControl
                                        id="email"
                                        isInvalid={!email && errorTooltip}
                                        isRequired
                                    >
                                        <FormLabel fontSize={{ base: "sm", lg: "md" }}>
                                            E-Mail
                                        </FormLabel>
                                        <Input
                                            placeholder="Enter e-mail"
                                            size={{ base: "sm", xl: "md" }}
                                            value={email}
                                            onChange={(event) => {
                                                setEmail(event.target.value);
                                            }}
                                        />
                                        <FormErrorMessage>Enter e-mail!</FormErrorMessage>
                                    </FormControl>
                                    <FormControl
                                        id="role"
                                        isInvalid={!role && errorTooltip}
                                        isRequired
                                    >
                                        <FormLabel fontSize={{ base: "sm", lg: "md" }}>
                                            Role
                                        </FormLabel>
                                        <Select id='role' placeholder='Select Role'
                                            value={role} onChange={(e) => setRole(e.target.value)}
                                        >
                                            <option value='Admin'>Admin</option>
                                            <option value='Media'>Media</option>
                                        </Select>
                                        <FormErrorMessage>Enter e-mail!</FormErrorMessage>
                                    </FormControl>
                                    <FormControl
                                        id="password"
                                        isInvalid={!password && errorTooltip}
                                        isRequired
                                    >
                                        <FormLabel fontSize={{ base: "sm", lg: "md" }}>
                                            Password
                                        </FormLabel>
                                        <Input
                                            placeholder="Enter password"
                                            size={{ base: "sm", xl: "md" }}
                                            value={password}
                                            onChange={(event) => {
                                                setPassword(event.target.value);
                                            }}
                                        />
                                        <FormErrorMessage>Enter password!</FormErrorMessage>
                                    </FormControl>
                                </VStack>
                            </ModalBody>
                            <ModalFooter>
                                <HStack gap="2">
                                    <Button
                                        size={{ base: "sm", lg: "md" }}
                                        variant="ghost"
                                        colorScheme="black"
                                        rounded="xl"
                                        boxShadow="lg"
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        size={{ base: "sm", lg: "md" }}
                                        variant="solid"
                                        rounded="xl"
                                        boxShadow="lg"
                                        colorScheme="red"
                                        isLoading={onSubmission}
                                        onClick={onUserSubmit}
                                    >
                                        Save
                                    </Button>
                                </HStack>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>

                    <Modal
                        scrollBehavior="inside"
                        height="100px"
                        isOpen={isEditOpen}
                        onClose={closeEditModal}
                        size={{ base: "sm", xl: "xl" }}
                        isCentered
                    >
                        <ModalOverlay />
                        <ModalContent ref={modalRef}>
                            <ModalHeader bg={"#CB1517"} color="white" roundedTop="md">
                                Edit User
                            </ModalHeader>
                            <ModalBody p="8">
                                <VStack gap="4" align="left">
                                    <FormControl
                                        id="editedName"
                                        isInvalid={!editedName && errorTooltip}
                                        isRequired
                                    >
                                        <FormLabel fontSize={{ base: "sm", lg: "md" }}>
                                            Name
                                        </FormLabel>
                                        <Input
                                            placeholder="Enter name"
                                            size={{ base: "sm", xl: "md" }}
                                            value={editedName}
                                            onChange={(event) => {
                                                setEditedName(event.target.value);
                                            }}
                                        />
                                        <FormErrorMessage>Enter name!</FormErrorMessage>
                                    </FormControl>
                                    <FormControl
                                        id="editedEmail"
                                        isInvalid={!editedEmail && errorTooltip}
                                        isRequired
                                    >
                                        <FormLabel fontSize={{ base: "sm", lg: "md" }}>
                                            E-Mail
                                        </FormLabel>
                                        <Input
                                            placeholder="Enter e-mail"
                                            size={{ base: "sm", xl: "md" }}
                                            value={editedEmail}
                                            onChange={(event) => {
                                                setEditedEmail(event.target.value);
                                            }}
                                        />
                                        <FormErrorMessage>Enter e-mail!</FormErrorMessage>
                                    </FormControl>
                                    <FormControl
                                        id="editedRole"
                                        isInvalid={!editedRole && errorTooltip}
                                        isRequired
                                    >
                                        <FormLabel fontSize={{ base: "sm", lg: "md" }}>
                                            Role
                                        </FormLabel>
                                        <Select id="editedRole" placeholder='Select Role'
                                            value={editedRole} onChange={(e) => setEditedRole(e.target.value)}
                                        >
                                            <option value='Admin'>Admin</option>
                                            <option value='Media'>Media</option>
                                        </Select>
                                        <FormErrorMessage>Enter e-mail!</FormErrorMessage>
                                    </FormControl>
                                    <FormControl
                                        id="editedPassword"
                                        isInvalid={!editedPassword && errorTooltip}
                                    >
                                        <FormLabel fontSize={{ base: "sm", lg: "md" }}>
                                            Password
                                        </FormLabel>
                                        <Input
                                            placeholder="Enter password"
                                            size={{ base: "sm", xl: "md" }}
                                            value={editedPassword}
                                            onChange={(event) => {
                                                setEditedPassword(event.target.value);
                                            }}
                                        />
                                        <FormErrorMessage>Enter password!</FormErrorMessage>
                                    </FormControl>
                                </VStack>
                            </ModalBody>
                            <ModalFooter>
                                <HStack gap="2">
                                    <Button
                                        size={{ base: "sm", lg: "md" }}
                                        variant="ghost"
                                        color={"black"}
                                        rounded="xl"
                                        boxShadow="lg"
                                        onClick={closeEditModal}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        size={{ base: "sm", lg: "md" }}
                                        variant="solid"
                                        rounded="xl"
                                        boxShadow="lg"
                                        colorScheme="red"
                                        isLoading={onSubmission}
                                        onClick={onUserEditSubmit}
                                    >
                                        Save
                                    </Button>
                                </HStack>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </HStack>
            </SimpleGrid>
            {/* end top info */}

            <Box
                rounded={"lg"}
                bg={"white"}
                boxShadow={"lg"}
                p={{ base: 4, xl: 6 }}
                w="100%"
            >
                <Box maxW={{ base: "100vw", xl: "100vw" }}>
                    <SimpleGrid
                        columns={{ base: "1", md: "2" }}
                        justify="space-between"
                        gap="4"
                    >
                        <HStack gap={2} maxW={{ base: "100%", md: "200px" }}>
                            <Text fontSize={{ base: "sm", xl: "md" }}>Show</Text>
                            <Select
                                borderRadius="md"
                                onChange={(e) => {
                                    setLimitData(e.target.value);
                                    getUser(currentPage, e.target.value, filterText);
                                }}
                            >
                                <option value="10">10</option>
                                <option value="20">20</option>
                            </Select>
                            <Text fontSize={{ base: "sm", xl: "md" }}>entries</Text>
                        </HStack>

                        <HStack gap="4" justifyContent="flex-end">
                            <InputGroup maxW={{ base: "100%", md: "50%" }}>
                                <InputLeftElement pointerEvents="none">
                                    <SearchIcon color="gray.800" />
                                </InputLeftElement>
                                <Input
                                    id="search"
                                    type="text"
                                    placeholder="Find user"
                                    aria-label="Search Input"
                                    size={{ base: "sm", xl: "md" }}
                                    value={filterText}
                                    onChange={(e) => {
                                        getUser(currentPage, limitData, e.target.value);
                                        setFilterText(e.target.value);
                                    }}
                                />
                            </InputGroup>
                        </HStack>
                    </SimpleGrid>
                    <Divider mt="5" mb="5" />
                    <TableUser handleEditUser={onEditClicked} data={userData} />
                    <Box mt="5">
                        <HStack spacing="3" justify="space-between">
                            {!isMobile && (
                                <Text fontSize={{ base: "xs", xl: "sm" }}>
                                    Showing 1 to {limitData} from {totalUser} entries
                                </Text>
                            )}
                            <HStack gap="2">
                                <Button
                                    size={{ base: "xs", lg: "sm" }}
                                    variant="ghost"
                                    color="gray"
                                    isDisabled={currentPage === 1 || totalPages === 0}
                                    onClick={() => {
                                        if (currentPage > 1) {
                                            setCurrentPage(currentPage - 1);
                                        }
                                    }}
                                // onClick={() => {
                                //     setCurrentPage(currentPage - 1);
                                //     getUser(currentPage - 1, limitData, filterText);
                                // }}
                                >
                                    <FaAngleLeft />
                                </Button>
                                <Button
                                    size={{ base: "xs", lg: "sm" }}
                                    variant="solid"
                                    bg={"#CB1517"}
                                    color={"white"}
                                    _hover={{
                                        bg: "#a41a1c",
                                    }}
                                >
                                    {currentPage}
                                </Button>
                                <Button
                                    size={{ base: "xs", lg: "sm" }}
                                    variant="ghost"
                                    color="gray"
                                    onClick={() => {
                                        if (currentPage < totalPages) {
                                            setCurrentPage(currentPage + 1);
                                        }
                                    }}
                                    isDisabled={currentPage === totalPages || totalPages === 0} // Use a boolean directly
                                // onClick={() => {
                                //     setCurrentPage(currentPage + 1);
                                //     getUser(currentPage + 1, limitData, filterText);
                                // }}
                                >
                                    <FaAngleRight />
                                </Button>
                            </HStack>
                        </HStack>
                    </Box>
                </Box>
            </Box>
        </VStack>
    );
}
