import { SearchIcon } from "@chakra-ui/icons";
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
    useColorModeValue,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { fetchWrapper } from "../../../helpers";
import TableHistory from "@/components/TableHistory";

export default function History() {
    const router = useRouter();
    const toast = useToast();

    const [data, setData] = useState([]);

    const [filterText, setFilterText] = useState("");
    // const [limitData, setLimitData] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const isMobile = useBreakpointValue({ base: true, md: false });
    const [limitData, setLimitData] = useState(() => {
        return parseInt(localStorage.getItem('limitData') || 10);
    });

    useEffect(() => {
        localStorage.setItem('limitData', limitData);
    }, [limitData]);

    useEffect(() => {
        if (router.isReady) {
            getHistory(currentPage, limitData, filterText);
        }
    }, [router]);

    const getHistory = async (currentPage, limitData, keywords) => {
        let appliedKeywords = "";
        if (keywords && keywords != "") {
            appliedKeywords = `&keywords=${keywords}`;
        }

        fetchWrapper
            .get(
                `/api/history/get-history?page=${currentPage}&limit=${limitData + appliedKeywords
                }`
            )
            .then((res) => {
                const inputDataToast = "input-data-toast";
                if (res.success) {
                    setData(res.data);
                    setTotalPages(res.totalPages);
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

    return (
        <>
            <VStack
                backgroundColor="#FAFAFA"
                p={{ base: "4", xl: "8" }}
                align={"center"}
                minH="100vh"
                gap="5"
            >
                <SimpleGrid m="2" columns={{ base: "1", lg: "2" }} gap="4" w="100%">
                    <Heading
                        fontSize={{ base: "lg", lg: "xl" }}
                        fontWeight="500"
                        textAlign={{ base: "center", lg: "left" }}
                    >
                        History
                    </Heading>
                </SimpleGrid>
                <Box
                    rounded={"lg"}
                    bg={useColorModeValue("white", "gray.700")}
                    boxShadow={"lg"}
                    p={{ base: 4, xl: 6 }}
                    w="100%"
                >
                    <Box>
                        <SimpleGrid
                            columns={{
                                base: "1",
                                md: "2",
                            }}
                            justify="space-between"
                            gap="4"
                        >
                            <HStack gap={2} maxW={{ base: "100%", md: "200px" }}>
                                <Text fontSize={{ base: "sm", xl: "md" }}>Show</Text>
                                <Select
                                    borderRadius="md"
                                    onChange={(e) => {
                                        setLimitData(e.target.value);
                                        getHistory(currentPage, e.target.value, filterText);
                                    }}
                                >
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                </Select>
                                <Text fontSize={{ base: "sm", xl: "md" }}>entry</Text>
                            </HStack>
                            <HStack gap="4" justifyContent="flex-end">
                                <InputGroup maxW={{ base: "100%", md: "50%" }}>
                                    <InputLeftElement pointerEvents="none">
                                        <SearchIcon color="gray.300" />
                                    </InputLeftElement>
                                    <Input
                                        id="search"
                                        type="text"
                                        placeholder="Find History"
                                        aria-label="Search Input"
                                        size={{ base: "sm", xl: "md" }}
                                        value={filterText}
                                        onChange={(e) => {
                                            getHistory(currentPage, limitData, e.target.value);
                                            setFilterText(e.target.value);
                                        }}
                                    />
                                </InputGroup>
                            </HStack>
                        </SimpleGrid>
                        <Divider mt="5" mb="5" />
                        <TableHistory data={data} />
                        <Box mt="5">
                            <HStack spacing="3" justify="space-between">
                                {!isMobile && (
                                    <Text fontSize={{ base: "xs", xl: "sm" }}>
                                        {/* Showing 1 to {totalData} from {totalData} entries */}
                                        showing {currentPage} of {totalPages}
                                    </Text>
                                )}
                                <HStack gap="2">
                                    <Button
                                        size={{ base: "xs", lg: "sm" }}
                                        variant="ghost"
                                        color="gray"
                                        isDisabled={currentPage === 1 || totalPages === 0} // Use a boolean directly
                                        onClick={() => {
                                            setCurrentPage(currentPage - 1);
                                            getHistory(currentPage - 1, limitData, filterText);
                                        }}
                                    >
                                        <FaAngleLeft />
                                    </Button>
                                    <Button
                                        size={{ base: "xs", lg: "sm" }}
                                        variant="solid"
                                        bg={'#CB1517'}
                                        color={'white'}
                                        _hover={{
                                            bg: '#a41a1c'
                                        }}
                                    >
                                        {currentPage}
                                    </Button>
                                    <Button
                                        size={{ base: "xs", lg: "sm" }}
                                        variant="ghost"
                                        color="gray"
                                        isDisabled={currentPage === totalPages || totalPages === 0} // Use a boolean directly
                                        onClick={() => {
                                            setCurrentPage(currentPage + 1);
                                            getHistory(currentPage + 1, limitData, filterText);
                                        }}
                                    >
                                        <FaAngleRight />
                                    </Button>
                                </HStack>
                            </HStack>
                        </Box>
                    </Box>
                </Box>
            </VStack>
        </>
    );
}
