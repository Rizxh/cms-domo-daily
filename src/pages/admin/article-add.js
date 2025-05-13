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
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { useRouter } from "next/router";
import { userService } from "../../../services";

// PrimeReact Editor
import { Editor } from "primereact/editor";

export default function ArticleAdd() {
    const router = useRouter();
    const toast = useToast();
    const picRef = useRef();

    const [filePicture, setFilePicture] = useState(null);
    const [bannerAsset, setBannerAsset] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        link: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDescriptionChange = (value) => {
        setFormData((prev) => ({ ...prev, description: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFilePicture(file);
            const objectUrl = URL.createObjectURL(file);
            setBannerAsset(objectUrl);
        }
    };

    const handleSubmit = () => {
        toast({
            title: "Submitted!",
            description: "Your article has been saved (not really, this is just frontend).",
            status: "success",
            duration: 3000,
            isClosable: true,
        });

        console.log({
            ...formData,
            asset: filePicture,
        });
    };

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
                                onClick={handleSubmit}
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
                            onChange={handleImageUpload}
                        />
                        {bannerAsset ? (
                            <Image src={bannerAsset} alt="Preview" w="100%" h="100%" objectFit="cover" borderRadius="md" />
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
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter article title"
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Label</FormLabel>
                        <Input
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="Enter a tag or label"
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Link</FormLabel>
                        <Input
                            name="link"
                            value={formData.link}
                            onChange={handleChange}
                            placeholder="https://domodaily.com/post=7_Kesalahan_Pengguna_Baru_Mobil"
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Description</FormLabel>
                        <Box bg="white" border="1px solid #ccc" borderRadius="md" p={2}>
                            <Editor
                                value={formData.description}
                                onTextChange={(e) => handleDescriptionChange(e.htmlValue)}
                                style={{ height: '320px' }}
                            />
                        </Box>
                    </FormControl>
                </CardBody>
            </Card>
        </VStack>
    );
}