import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Icon,
    Image,
    Input,
    Stack,
    Text,
    VStack,
    useToast,
    Flex,
    Select,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { useRouter } from "next/router";
import { userService } from "../../../services";
import { fetchWrapper } from "../../../helpers";
import { Editor } from "primereact/editor";

export default function ArticleAdd() {
    const router = useRouter();
    const toast = useToast();
    const picRef = useRef();

    const [articleAsset, setArticleAsset] = useState(null);
    const [categories, setCategories] = useState([]);
    const [status, setStatus] = useState("");

    const [filePicture, setFilePicture] = useState(null);
    const [picture, setPicture] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("")
    const [link, setLink] = useState("");
    const [onSubmission, setOnSubmission] = useState(false);

    const [editedTitle, setEditedTitle] = useState("");
    const [editedCategory, setEditedCategory] = useState("");
    const [editedDescription, setEditedDescription] = useState("");
    const [editedFilePicture, setEditedFilePicture] = useState(null);
    const [editedLink, setEditedLink] = useState(null);
    const [editedPicture, setEditedPicture] = useState(null);
    const [editedArticleUuid, setEditedArticleUuid] = useState(null);
    const [editedOnSubmission, setEditedOnSubmission] = useState(false);
    const [errorTooltip, setErrorTooltip] = useState(false);

    const [limitData, setLimitData] = useState(() => {
        return parseInt(localStorage.getItem("limitData") || 10);
    });
    const [filterText, setFilterText] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    useEffect(() => {
        getCategories(limitData, filterText);
    }, []);

    const handleDescriptionChange = (value) => {
        setDescription(value);
    }

    const handleSubmit = (statusShare) => {
        if (title && category && filePicture) {
            const now = new Date().toISOString();
            setOnSubmission(true);
            const formData = new FormData();
            formData.append("user_id", userService.userValue.id)
            formData.append("title", title);
            formData.append("assets", filePicture);
            formData.append("status", statusShare);
            formData.append("link", link);
            formData.append("description", description);
            formData.append("uuid_category", category);
            formData.append("uploaded_by", userService?.userValue.id);
            if (statusShare === "Published") {
                formData.append("created_at", now);
            }

            fetchWrapper.postForm(`/api/article/create-data`, formData).then((res) => {
                if (res.success) {
                    toast({ title: "Article created successfully", status: "success", duration: 3000, position: "top" });
                    setTimeout(() => router.push("/admin/article"), 3000);
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

    const onEditClicked = (articleUuid) => {
        setEditedArticleUuid(articleUuid)
        getArticleByUuid(articleUuid)
    }

    const onEditSubmit = async (statusShare) => {
        if (editedTitle && editedCategory) {
            setEditedOnSubmission(true);

            const formData = new FormData();
            formData.append("user_id", userService.userValue.id);
            formData.append("uuid", editedArticleUuid);
            formData.append("assets", editedFilePicture);
            formData.append("title", editedTitle);
            formData.append("uploaded_by", userService?.userValue.id);
            formData.append("uuid_category", editedCategory);
            formData.append("status", statusShare);
            formData.append("description", editedDescription);
            formData.append("link", editedLink);
            if (statusShare === "Published") {
                formData.append("created_at", new Date().toISOString());
            }

            fetchWrapper
                .postForm(`/api/article/update-data`, formData)
                .then((res) => {
                    const toastId = "update-article-toast";
                    if (res.success) {
                        if (!toast.isActive(toastId)) {
                            toast({
                                id: toastId,
                                title: "Article updated successfully.",
                                status: "success",
                                duration: 1500,
                                isClosable: true,
                                position: "top",
                            });
                        }
                        setTimeout(() => router.reload(), 1500);
                    } else {
                        toast({
                            title: res.message,
                            status: "error",
                            duration: 3000,
                            isClosable: true,
                            position: "top",
                        });
                    }
                })
                .finally(() => setOnSubmission(false));
        } else {
            setErrorTooltip(true);
            setTimeout(() => setErrorTooltip(false), 3000);
        }
    };

    const getArticleByUuid = async (uuid) => {
        fetchWrapper
            .get(`/api/article/get-data-details?uuid=${uuid}`)
            .then((res) => {
                if (res.success) {
                    setEditedPicture(res.data.assets);
                    setEditedTitle(res.data.title);
                    setEditedDescription(res.data.description);
                    setEditedCategory(res.data.uuid_category);
                }
            });
    };

    const getCategories = async () => {
        fetchWrapper.get(`/api/category/get-data`).then((res) => {
            if (res.success) {
                setCategories(res.data);
            } else {
                toast({
                    title: res.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "top",
                })
            }
        })
    }

    return (
        <VStack p={{ base: "4", xl: "8" }} align="stretch" minH="100vh" gap="5">
            {/* Header */}
            <HStack justifyContent="space-between">
                <Heading size="lg">Add Article</Heading>
                {(userService?.userValue?.role === "Super Admin" ||
                    userService?.userValue?.role === "Admin" ||
                    userService?.userValue?.role === "Media") && (
                        <Flex gap="5">
                            <Button
                                textColor="white"
                                bg="#B6B09F"
                                onClick={() => {
                                    router.push('/admin/article')
                                }}
                            >
                                Close
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={() => handleSubmit(status)}
                            >
                                Create Article
                            </Button>

                        </Flex>
                    )}
            </HStack>

            <Card>
                <CardHeader>
                    <Heading size="md" fontWeight="600">Article Information</Heading>
                </CardHeader>
                <CardBody as={Stack} spacing="6">
                    {/* Upload Banner */}
                    <Box
                        w="100%"
                        h="400px"
                        border="2px dashed #c6c5c5"
                        borderRadius="md"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        position="relative"
                        onClick={() => picRef.current?.click()}
                        cursor="pointer"
                    >
                        <input
                            type="file"
                            accept="image/*"
                            ref={picRef}
                            style={{ display: "none" }}
                            onChange={(article) => {
                                let fileObj = article.target.files[0];
                                setFilePicture(fileObj);
                                const objectUrl = URL.createObjectURL(fileObj);
                                setPicture(objectUrl);
                            }}
                        />
                        {picture ? (
                            <Image src={picture} alt="Preview" w="100%" h="100%" objectFit="cover" borderRadius="md" />
                        ) : (
                            <VStack spacing="2" color="gray.500">
                                <Icon as={FiUpload} boxSize={8} color="red.500" />
                                <Text fontWeight="semibold">Click to upload asset</Text>
                                <Text fontSize="sm">(Recommended: 973px x 360px)</Text>
                            </VStack>
                        )}
                    </Box>

                    {/* Form Fields */}
                    <FormControl>
                        <FormLabel>Title</FormLabel>
                        <Input
                            name="title"
                            value={title}
                            placeholder="Enter article title"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Category</FormLabel>
                        <Select value={category} onChange={(e) => setCategory(e.target.value)} id="category" placeholder="Select category">
                            {categories.map((data, index) => {
                                return (
                                    <option key={index} value={data.uuid}>
                                        {data.category}
                                    </option>
                                );
                            })}
                        </Select>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Status</FormLabel>
                        <Select
                            placeholder="Choose article status"
                            size={{ base: "sm", lg: "md" }}
                            colorScheme="red"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="Draft">Draft</option>
                            <option value="Published">Published</option>
                        </Select>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Link</FormLabel>
                        <Input
                            size="md"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                         />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Description</FormLabel>
                        <Box bg="white" border="1px solid #ccc" borderRadius="md" p={2}>
                            <Editor
                                value={description}
                                onTextChange={(e) => handleDescriptionChange(e.htmlValue)}
                                style={{ height: '320px' }}
                                // onTextChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter article description"
                            />
                        </Box>
                    </FormControl>
                </CardBody>
            </Card>
        </VStack>
    );
}