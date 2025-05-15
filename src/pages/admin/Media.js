import CardPreview from "@/components/CardPreview";
import { SearchIcon } from "@chakra-ui/icons";
import { Box, Button, Divider, Heading, HStack, Input, InputGroup, InputLeftElement, Select, SimpleGrid, Text, useBreakpointValue, useToast, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

export default function Media() {
    const router = useRouter()
    const toast = useToast()
    const isMobile = useBreakpointValue({ base: true, md: false });

    const [limitData, setLimitData] = useState(() => {
        return parseInt(localStorage.getItem("limitData") || 10);
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    return (
        <VStack p={{ base: "4", xl: "8" }} align="stretch" minH="100vh" gap="5" spacing={4}>
            <SimpleGrid m="2" columns={{ base: "1", lg: "2" }} gap="4" w="100%">
                <Heading fontSize={{ base: "lg", lg: "2xl" }} fontWeight="500" textAlign={{ base: "center", lg: "left" }}>
                    Media Preview
                </Heading>
            </SimpleGrid>

            <Box rounded="lg" bg="white" boxShadow="lg" p={{ base: 4, xl: 6 }} w="100%">
                <SimpleGrid columns={{ base: "1", md: "2" }} justify="space-between" gap="4">
                    <HStack gap={2} maxW={{ base: "100%", md: "200px" }}>
                        <Text fontSize={{ base: "sm", xl: "md" }}>Show</Text>
                        <Select
                            borderRadius="md"
                        // value={limitData}
                        // onChange={(e) => setLimitData(parseInt(e.target.value))}
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
                            // onChange={(e) => {
                            //     setFilterStatus(e.target.value);
                            //     getArticle(
                            //         currentPage,
                            //         limitData,
                            //         filterStatus,
                            //         e.target.value
                            //     );
                            // }}
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
                            // value={filterText}
                            // onChange={(e) => setFilterText(e.target.value)}
                            />
                        </InputGroup>
                    </HStack>
                </SimpleGrid>

                <Divider mt="5" mb="5" />
                <CardPreview />
                <Box mt="5">
                    <HStack spacing="3" justify="space-between">
                        {!isMobile && (
                            <Text fontSize={{ base: "xs", xl: "sm" }}>
                                Showing 1 to {limitData} from {} entries
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
    )
}