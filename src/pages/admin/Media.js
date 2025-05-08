import { Box, Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, FormControl, FormErrorMessage, FormLabel, Heading, HStack, Icon, Image, Input, InputGroup, InputLeftElement, InputRightAddon, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, SimpleGrid, Stack, Text, Textarea, useBreakpointValue, useDisclosure, useStatStyles, useToast, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { fetchWrapper } from "../../../helpers";
import { userService } from "../../../services";
import CardMedia from "@/components/CardMedia";

export default function Media() {
    const router = useRouter()
    const toast = useToast()

    const draweRef = useRef()
    const picRef = useRef(null);

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [medias, setMedias] = useState([])

    const [mediaTitle, setMediaTitle] = useState()
    const [mediaLink, setMediaLink] = useState()
    const [mediaStatus, setMediaStatus] = useState()
    const [mediaAsset, setMediaAsset] = useState(null)
    const [filePicture, setFilePicture] = useState(null);

    const editedDrawerRef = useRef(null)
    const editedPicRef = useRef(null)

    const {
        isOpen: isEditOpen,
        onOpen: editedOnOpen,
        onClose: closeEditDrawer,
    } = useDisclosure()

    const [editedMediaUuid, setEditedMediaUuid] = useState()
    const [editedMediaId, setEditedMediaId] = useState()
    const [editedMediaTitle, setEditedMediaTitle] = useState()
    const [editedMediaLink, setEditedMediaLink] = useState()
    const [editedMediaStatus, setEditedMediaStatus] = useState()
    const [editedMediaAsset, setEditedMediaAsset] = useState(null)
    const [editedFilePicture, setEditedFilePicture] = useState(null)

    const [onSubmission, setOnSubmission] = useState(false)
    const [errorTooltip, setErrorTooltip] = useState(false)

    const [editedErrorTooltip, setEditedErrorTooltip] = useState(false);
    const [editedOnSubmission, setEditedOnSubmission] = useState(false);

    useEffect(() => {
        if (router.isReady) {
            getAllMedia()
        }
    }, [router])

    const getAllMedia = async () => {
        fetchWrapper.get(`/api/media/get-data`).then((res) => {
            if (res.success) {
                setMedias(res.data)
            }
        })
    }

    const onEditClicked = (mediaUuid) => {
        setEditedMediaUuid(mediaUuid)
        getMediaByUuid(mediaUuid)
        editedOnOpen()
    }

    const onUserSubmit = () => {
        if (mediaTitle && mediaStatus && mediaAsset && filePicture) {
            setOnSubmission(true)
            const now = new Date().toISOString();
            const formData = new FormData();
            formData.append("user_id", userService.userValue.id);
            formData.append("title", mediaTitle);
            formData.append("link", mediaLink);
            formData.append("status", mediaStatus);
            formData.append("asset", filePicture);
            formData.append("created_at", now);

            fetchWrapper.postForm(`/api/media/create-data`, formData).then((res) => {
                if (res.success) {
                    toast({ title: "Media created successfully", status: "success", duration: 3000, position: "top" });
                    setTimeout(() => router.reload(), 2000);
                } else {
                    toast({ title: res.message, status: "error", duration: 3000 });
                }
            });
        } else {
            setErrorTooltip(true);
            toast({ title: "Please fill all fields!", status: "error", duration: 3000, position: "top" });
            setTimeout(() => {
                setErrorTooltip(false);
            }, 3000);

        }
    };

    const onEditSubmit = () => {
        if (
            editedMediaTitle &&
            editedMediaStatus &&
            editedMediaAsset
        ) {
            setEditedOnSubmission(true);
            const now = new Date().toISOString();
            const formData = new FormData();
            formData.append("id", editedMediaId);
            formData.append("user_id", userService.userValue.id);
            formData.append("uuid", editedMediaUuid);
            formData.append("title", editedMediaTitle);
            formData.append("link", editedMediaLink);
            formData.append("status", editedMediaStatus);
            formData.append("asset", editedMediaAsset);
            formData.append("file", editedFilePicture);
            formData.append("updated_at", now)

            fetchWrapper
                .postForm(`/api/media/update-data`, formData)
                .then((res) => {
                    const inputDataToast = "input-data-toast";
                    if (res.success) {
                        if (!toast.isActive(inputDataToast)) {
                            toast({
                                inputDataToast,
                                title: "Media edited successfully",
                                status: "success",
                                duration: 3000,
                                isClosable: true,
                                position: "top",
                            });
                        }
                        setTimeout(() => router.reload(), 2000);
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
            setEditedErrorTooltip(true);
            setTimeout(() => {
                setEditedErrorTooltip(false);
            }, 3000);
        }
    };

    const getMediaByUuid = async (uuid) => {
        fetchWrapper
            .get(`/api/media/get-data-details?uuid=${uuid}`)
            .then((res) => {
                console.log(res.data)
                if (res.success) {
                    setEditedMediaId(res.data.id);
                    setEditedMediaAsset(res.data.asset);
                    setEditedMediaTitle(res.data.title);
                    setEditedMediaLink(res.data.link);
                    setEditedMediaStatus(res.data.status);
                }
            });
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
                    Media
                </Heading>
                <HStack justifyContent={{ base: "center", lg: "flex-end" }}>
                    <Button
                        leftIcon={<FaPlus />}
                        size={{ base: "sm", lg: "md" }}
                        variant="solid"
                        bg={"#CB1517"}
                        color={'white'}
                        rounded="xl"
                        p="2"
                        onClick={onOpen}
                        _hover={{
                            bg: '#a41a1c'
                        }}
                    >
                        ADD
                    </Button>
                    <Drawer
                        isOpen={isOpen}
                        placement='right'
                        onClose={onClose}
                        size={{ base: "sm", xl: "lg", lg: "lg" }}
                    >
                        <DrawerOverlay />
                        <DrawerContent ref={draweRef}>
                            <DrawerHeader borderBottomWidth='1px' color="#CB1517">
                                Add Media
                            </DrawerHeader>

                            <DrawerBody>
                                <Stack spacing='24px'>
                                    <Box>
                                        <FormControl
                                            id="mediaAsset"
                                            isInvalid={!mediaAsset && errorTooltip}
                                            isRequired
                                        >
                                            <FormLabel fontSize={{ base: "sm", lg: "md" }}>
                                                Asset
                                            </FormLabel>
                                            <Flex
                                                cursor="pointer"
                                                flexDirection={"row"}
                                                w={"100%"}
                                                borderBottomRadius={{ sm: "5px", lg: "5px" }}
                                                justify="center"
                                                align="center"
                                            >
                                                <Flex
                                                    w={"100%"}
                                                    h="250px"
                                                    bg={"white"}
                                                    style={{ border: "1px solid #c6c5c5" }}
                                                    borderRadius={{ sm: "5px", lg: "5px" }}
                                                    justify="center"
                                                    align="center"
                                                    onClick={(media) => {
                                                        media.target.value = null;
                                                        picRef.current?.click();
                                                    }}
                                                >
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        multiple={false}
                                                        style={{ display: "none" }}
                                                        ref={picRef}
                                                        onChange={(media) => {
                                                            let fileObj = media.target.files[0];
                                                            setFilePicture(fileObj);
                                                            const objectUrl = URL.createObjectURL(fileObj);
                                                            setMediaAsset(objectUrl);
                                                        }}
                                                    />
                                                    {mediaAsset != null ? (
                                                        <Image
                                                            src={mediaAsset}
                                                            objectFit="cover"
                                                            w="100%"
                                                            h="100%"
                                                        />
                                                    ) : (
                                                        <VStack spacing={1}>
                                                            <Icon as={FiUpload} boxSize={8} color="red.600" />
                                                            <Text color="gray.400" fontWeight="medium">Upload asset</Text>
                                                            <Text color="gray.500" fontSize="sm">(320px * 100px)</Text>
                                                        </VStack>
                                                    )}
                                                </Flex>
                                            </Flex>
                                            <FormErrorMessage>Upload Picture!</FormErrorMessage>
                                        </FormControl>
                                    </Box>

                                    <Box>
                                        <FormControl
                                            id="media_title"
                                            isInvalid={!mediaTitle && errorTooltip}
                                            isRequired>
                                            <FormLabel htmlFor='title'>Title</FormLabel>
                                            <Input
                                                value={mediaTitle}
                                                id='media_title'
                                                placeholder='Please enter title'
                                                onChange={(e) => setMediaTitle(e.target.value)}
                                            />
                                        </FormControl>
                                    </Box>

                                    <Box>
                                        <FormControl
                                            id="media_link"
                                            isInvalid={!mediaLink && errorTooltip}
                                            isRequired>
                                            <FormLabel htmlFor='link'>Link</FormLabel>
                                            <Input
                                                value={mediaLink}
                                                id='media_link'
                                                placeholder='Please enter user name'
                                                onChange={(e) => setMediaLink(e.target.value)}
                                            />
                                        </FormControl>
                                    </Box>

                                    <Box>
                                        <FormControl
                                            id="media_status"
                                            isInvalid={!mediaStatus && errorTooltip}
                                            isRequired
                                        >
                                            <FormLabel htmlFor='owner'>Status</FormLabel>
                                            <Select id='media_status' placeholder='Change Status'
                                                value={mediaStatus} onChange={(e) => setMediaStatus(e.target.value)}
                                            >
                                                <option value='Active'>Active</option>
                                                <option value='Inactive'>Inactive</option>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </Stack>
                            </DrawerBody>

                            <DrawerFooter borderTopWidth='1px'>
                                <Text
                                    _hover={{
                                        fontWeight: 'bold',
                                    }}
                                    size={{ base: "sm", lg: "md" }}
                                    cursor={"pointer"}
                                    mr={6}
                                    color={"black"}
                                    onClick={onClose}>
                                    Cancel
                                </Text>
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
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>

                    {/* edit drawer */}
                    <Drawer
                        isOpen={isEditOpen}
                        placement='right'
                        onClose={closeEditDrawer}
                        size={{ base: "sm", xl: "lg", lg: "lg" }}
                    >
                        <DrawerOverlay />
                        <DrawerContent ref={editedDrawerRef}>
                            <DrawerHeader borderBottomWidth='1px' color="#CB1517">
                                Edit Media
                            </DrawerHeader>

                            <DrawerBody>
                                <Stack spacing='24px'>
                                    <Box>
                                    <FormControl
                                            id="editedMediaAsset"
                                            isInvalid={!editedMediaAsset && editedErrorTooltip}
                                            isRequired
                                        >
                                            <FormLabel fontSize={{ base: "sm", lg: "md" }}>
                                                Asset
                                            </FormLabel>
                                            <Flex
                                                cursor="pointer"
                                                flexDirection={"row"}
                                                w={"100%"}
                                                borderBottomRadius={{ sm: "5px", lg: "5px" }}
                                                justify="center"
                                                align="center"
                                            >
                                                <Flex
                                                    w={"100%"}
                                                    h="250px"
                                                    bg={"white"}
                                                    style={{ border: "1px solid #c6c5c5" }}
                                                    borderRadius={{ sm: "5px", lg: "5px" }}
                                                    justify="center"
                                                    align="center"
                                                    onClick={(media) => {
                                                        media.target.value = null;
                                                        editedPicRef.current?.click();
                                                    }}
                                                >
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        multiple={false}
                                                        style={{ display: "none" }}
                                                        ref={editedPicRef}
                                                        onChange={(media) => {
                                                            let fileObj = media.target.files[0];
                                                            setEditedFilePicture(fileObj);
                                                            const objectUrl = URL.createObjectURL(fileObj);
                                                            setEditedMediaAsset(objectUrl);
                                                        }}
                                                    />
                                                    {editedMediaAsset != null ? (
                                                        <Image
                                                            src={editedMediaAsset}
                                                            objectFit="cover"
                                                            w="100%"
                                                            h="100%"
                                                        />
                                                    ) : (
                                                        <VStack spacing={1}>
                                                            <Icon as={FiUpload} boxSize={8} color="red.600" />
                                                            <Text color="gray.400" fontWeight="medium">Upload asset</Text>
                                                            <Text color="gray.500" fontSize="sm">(320px * 100px)</Text>
                                                        </VStack>
                                                    )}
                                                </Flex>
                                            </Flex>
                                            <FormErrorMessage>Upload Picture!</FormErrorMessage>
                                        </FormControl>
                                    </Box>

                                    <Box>
                                        <FormControl
                                            id="mediaTitle"
                                            isInvalid={!editedMediaTitle && editedErrorTooltip}
                                            isRequired
                                        >
                                            <FormLabel htmlFor='title'>Title</FormLabel>
                                            <Input
                                                id='mediaTitle'
                                                placeholder='Please enter title'
                                                value={editedMediaTitle}
                                                onChange={(e) => {
                                                    setEditedMediaTitle(e.target.value);
                                                }}
                                            />
                                        </FormControl>
                                    </Box>

                                    <Box>
                                        <FormControl >
                                            <FormLabel htmlFor='link'>Link</FormLabel>
                                            <Input
                                                id='mediaLink'
                                                placeholder='Please enter user name'
                                                value={editedMediaLink}
                                                onChange={(e) => {
                                                    setEditedMediaLink(e.target.value);
                                                }}
                                            />
                                        </FormControl>
                                    </Box>

                                    <Box>
                                        <FormControl isRequired>
                                            <FormLabel htmlFor='owner'>Status</FormLabel>
                                            <Select id='mediaStatus' placeholder='Change Status' value={editedMediaStatus} onChange={(e) => {
                                                setEditedMediaStatus(e.target.value);
                                            }}>
                                                <option value='Active'>Active</option>
                                                <option value='Inactive'>Inactive</option>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </Stack>
                            </DrawerBody>

                            <DrawerFooter borderTopWidth='1px'>
                                <Text
                                    _hover={{
                                        fontWeight: 'bold',
                                    }}
                                    size={{ base: "sm", lg: "md" }}
                                    cursor={"pointer"}
                                    mr={6}
                                    color={"black"}
                                    onClick={closeEditDrawer}>
                                    Cancel
                                </Text>
                                <Button size={{ base: "sm", lg: "md" }}
                                    variant="solid"
                                    rounded="xl"
                                    boxShadow="lg"
                                    colorScheme="red"
                                    isLoading={editedOnSubmission}
                                    onClick={onEditSubmit}>Save</Button>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>

                </HStack>
            </SimpleGrid>
            {/* end top info */}

            <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={10} justifyItems="center" w="100%">
                {medias.map((data, index) => (
                    <CardMedia key={index}
                        uuid={data.uuid}
                        mediaAsset={data.asset}
                        mediaTitle={data.title}
                        createdAt={data.created_at}
                        updatedAt={data.updated_at}
                        mediaStatus={data.status}
                        onEditClicked={() => onEditClicked(data.uuid)} />
                ))}
            </SimpleGrid>
        </VStack>
    );
}
