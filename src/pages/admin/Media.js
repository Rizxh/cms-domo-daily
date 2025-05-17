import CardMedia from "@/components/CardMedia";
import { SearchIcon } from "@chakra-ui/icons";
import {
    Box,
    Divider,
    Heading,
    HStack,
    Input,
    InputGroup,
    InputLeftElement,
    SimpleGrid,
    VStack,
    useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState, useMemo, useCallback } from "react";
import { fetchWrapper } from "../../../helpers";

export default function Media() {
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

    const getCategoryNameByUuid = useCallback((uuid) => {
    const category = categoriesData.find((cat) => cat.uuid === uuid);
    return category ? category.category : "Unknown";
    }, [categoriesData]);


    // Filter berdasarkan title (case-insensitive)
    const filteredMedia = useMemo(() => {
        return medias.filter((media) =>
            media.title.toLowerCase().includes(filterText.toLowerCase())
        );
    }, [filterText, medias]);

    return (
        <VStack p={{ base: "4", xl: "8" }} align="stretch" minH="100vh" gap="5" spacing={4}>
            <SimpleGrid m="2" columns={{ base: "1", lg: "2" }} gap="4" w="100%">
                <Heading fontSize={{ base: "lg", lg: "2xl" }} fontWeight="500" textAlign={{ base: "center", lg: "left" }}>
                    Media Preview (Search Article From Title)
                </Heading>
            </SimpleGrid>

            <Box rounded="lg" bg={"white"} boxShadow="lg" p={{ base: 4, xl: 6 }} w="100%">
                <SimpleGrid columns={{ base: "1", md: "1" }} justify="space-between" gap="4">
                    <HStack gap={2} maxW={{ base: "100%", md: "100%" }} p="2" borderRadius="md">
                        <InputGroup maxW={{ base: "100%", md: "100%" }}>
                            <InputLeftElement pointerEvents="none">
                                <SearchIcon color={"gray.800"} />
                            </InputLeftElement>
                            <Input
                                id="search"
                                type="text"
                                placeholder="Search title"
                                bg="whiteAlpha.200"
                                aria-label="Search Input"
                                size={{ base: "sm", xl: "md" }}
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                            />
                        </InputGroup>
                    </HStack>
                </SimpleGrid>

                <Divider mt="5" mb="5" />

                {filterText.trim() === "" ? (
                    <Box textAlign="center" py="6" color="gray.500">
                        Please enter a title to search for articles.
                    </Box>
                ) : filteredMedia.length > 0 ? (
                    filteredMedia.map((data, index) => (
                        <CardMedia
                            key={index}
                            uuid={data.uuid}
                            mediaAsset={data.assets}
                            mediaTitle={data.title}
                            mediaDescription={data.description}
                            mediaCategory={getCategoryNameByUuid(data.uuid_category)}
                            createdAt={data.created_at}
                            updatedAt={data.updated_at}
                            mediaStatus={data.status}
                            onEditClicked={() => router.push(`/admin/article-data?page=${data.uuid}`)}
                        />
                    ))
                ) : (
                    <Box textAlign="center" py="6" color="gray.400">
                        No article found with that title.
                    </Box>
                )}

            </Box>
        </VStack>
    );
}
