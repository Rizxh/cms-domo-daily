import {
    Box,
    Button,
    Divider,
    Heading,
    HStack,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    SimpleGrid,
    Text,
    useBreakpointValue,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { FaAngleLeft, FaAngleRight, FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import TableArticle from "@/components/TableArticle";
import { userService } from "../../../services";
import { useRouter } from "next/router";
import { fetchWrapper } from "../../../helpers";

export default function ArticleRequest() {
    const router = useRouter()
    const toast = useToast()
    const isMobile = useBreakpointValue({ base: true, md: false });

    const [limitData, setLimitData] = useState(() => {
        return parseInt(localStorage.getItem("limitData") || 10);
    });
    const [filterText, setFilterText] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalArticle, setTotalArticle] = useState(0);
    const [articleData, setArticleData] = useState([]);

    const [categories, setCategoriesData] = useState([])

    useEffect(() => {
        localStorage.setItem("limitData", limitData);
    }, [limitData]);

    useEffect(() => {
        getArticle(currentPage, limitData, filterText, filterStatus)
    }, [currentPage, limitData, filterText, filterStatus]);

    useEffect(() => {
        getCategory(limitData, filterText);
    }, []);

    const onEditClicked = (articleUuid) => {
        setEditedArticleUuid(articleUuid)
        getArticleByUuid(articleUuid)
    }

    const getArticleByUuid = async (uuid) => {
        fetchWrapper
            .get(`/api/article/get-data-details?uuid=${uuid}`)
            .then((res) => {
                if (res.success) {
                    setEditedPicture(res.data.assets);
                    setEditedTitle(res.data.title);
                    setEditedDescription(res.data.content);
                    setEditedCategory(res.data.uuid_category);
                }
            });
    };

    const getArticle = async (page, limit, keywords, status) => {
        fetchWrapper.get(`/api/article/get-data?page=${page}&limit=${limit}&keywords=${keywords}&status=${status}`).then((res) => {
            const inputDataToast = "input-data-toast"
            if (res.data) {
                setArticleData(res.data)
                setTotalPages(res.totalPages)
                setTotalArticle(res.total)
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

    const getCategory = async () => {
        fetchWrapper.get(`/api/category/get-data`).then((res) => {
            if (res.success) {
                setCategoriesData(res.success)
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
            {/* Top Info */}
            <SimpleGrid m="2" columns={{ base: "1", lg: "2" }} gap="4" w="100%">
                <Heading fontSize={{ base: "lg", lg: "2xl" }} fontWeight="500" textAlign={{ base: "center", lg: "left" }}>
                    Article
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
                                onClick={() => {
                                    router.push(
                                        `/admin/article-add`
                                    );
                                }}
                                _hover={{
                                    bg: '#a41a1c'
                                }}
                            >
                                ADD
                            </Button>
                        )}
                </HStack>
            </SimpleGrid>

            <Box rounded="lg" bg="white" boxShadow="lg" p={{ base: 4, xl: 6 }} w="100%">
                <SimpleGrid columns={{ base: "1", md: "2" }} justify="space-between" gap="4">
                    <HStack gap={2} maxW={{ base: "100%", md: "200px" }}>
                        <Text fontSize={{ base: "sm", xl: "md" }}>Show</Text>
                        <Select
                            borderRadius="md"
                            value={limitData}
                            onChange={(e) => setLimitData(parseInt(e.target.value))}
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </Select>
                        <Text fontSize={{ base: "sm", xl: "md" }}>entries</Text>
                    </HStack>

                    <HStack gap="4" justifyContent="flex-end">
                        <HStack w="100%" gap="2">
                            <Text fontSize={{ base: "sm", xl: "md" }}>Status</Text>
                            <Select
                                fontSize={{ base: "xs", xl: "sm" }}
                                borderRadius="md"
                                onChange={(e) => {
                                    setFilterStatus(e.target.value);
                                    getArticle(
                                        currentPage,
                                        limitData,
                                        filterStatus,
                                        e.target.value
                                    );
                                }}
                            >
                                <option value="All">All</option>
                                <option value="Published">Published</option>
                                <option value="Draft">Draft</option>
                            </Select>
                        </HStack>

                        <InputGroup maxW={{ base: "100%", md: "50%" }}>
                            <InputLeftElement pointerEvents="none">
                                <SearchIcon color="gray.800" />
                            </InputLeftElement>
                            <Input
                                id="search"
                                type="text"
                                placeholder="Find Article"
                                aria-label="Search Input"
                                size={{ base: "sm", xl: "md" }}
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                            />
                        </InputGroup>
                    </HStack>
                </SimpleGrid>

                <Divider mt="5" mb="5" />
                <TableArticle
                    handleEditArticle={onEditClicked}
                    data={articleData} />
                <Box mt="5">
                    <HStack spacing="3" justify="space-between">
                        {!isMobile && (
                            <Text fontSize={{ base: "xs", xl: "sm" }}>
                                Showing 1 to {limitData} from {totalArticle} entries
                            </Text>
                        )}
                        <HStack gap="2">
                            <Button
                                size={{ base: "xs", lg: "sm" }}
                                variant="ghost"
                                color="gray"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                isDisabled={currentPage <= 1}
                            >
                                <FaAngleLeft />
                            </Button>
                            <Button
                                size={{ base: "xs", lg: "sm" }}
                                variant="solid"
                                bg="#CB1517"
                                color="white"
                                _hover={{ bg: "#a41a1c" }}
                            >
                                {currentPage}
                            </Button>
                            <Button
                                size={{ base: "xs", lg: "sm" }}
                                variant="ghost"
                                color="gray"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                isDisabled={currentPage >= totalPages}
                            >
                                <FaAngleRight />
                            </Button>
                        </HStack>
                    </HStack>
                </Box>
            </Box>
        </VStack>
    );
}
