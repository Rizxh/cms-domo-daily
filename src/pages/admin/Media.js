import CardMedia from "@/components/CardMedia";
import CardPreview from "@/components/CardPreview";
import { SearchIcon } from "@chakra-ui/icons";
import { Box, Button, Divider, Heading, HStack, Input, InputGroup, InputLeftElement, Select, SimpleGrid, Text, useBreakpointValue, useToast, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchWrapper } from "../../../helpers";

export default function Media() {
    const router = useRouter()

    const [medias, setMedias] = useState([])

    useEffect(() => {
        if (router.isReady) {
            getAllMedia();
        }
    }, [router]);

    const getAllMedia = async () => {
        fetchWrapper.get(`/api/media/get-data`).then((res) => {
            if (res.success) {
                setMedias(res.data);
            }
        });
    };

    return (
        <VStack p={{ base: "4", xl: "8" }} align="stretch" minH="100vh" gap="5" spacing={4}>
            <SimpleGrid m="2" columns={{ base: "1", lg: "2" }} gap="4" w="100%">
                <Heading fontSize={{ base: "lg", lg: "2xl" }} fontWeight="500" textAlign={{ base: "center", lg: "left" }}>
                    Media Preview
                </Heading>
            </SimpleGrid>

            <Box rounded="lg" bg="#EB1C23" boxShadow="lg" p={{ base: 4, xl: 6 }} w="100%" textColor={"white"}>
                <SimpleGrid columns={{ base: "1", md: "2" }} justify="space-between" gap="4">
                    <HStack gap={2} maxW={{ base: "100%", md: "100%" }}>
                        <Text fontSize={{ base: "sm", xl: "md" }}>Search Article Title</Text>
                        <InputGroup maxW={{ base: "100%", md: "50%" }}>
                            <InputLeftElement pointerEvents="none">
                                <SearchIcon color="white" />
                            </InputLeftElement>
                            <Input
                                textColor={"white"}
                                id="search"
                                type="text"
                                placeholder="Search"
                                bg="whiteAlpha.200"
                                aria-label="Search Input"
                                size={{ base: "sm", xl: "md" }}
                            // value={filterText}
                            // onChange={(e) => setFilterText(e.target.value)}
                            />
                        </InputGroup>
                    </HStack>
                </SimpleGrid>

                <Divider mt="5" mb="5" />
                {medias.map((data, index) => {
                    return (
                        <CardMedia
                            key={index}
                            uuid={data.uuid}
                            mediaAsset={data.asset}
                            mediaTitle={data.title}
                            createdAt={data.created_at}
                            updatedAt={data.updated_at}
                            mediaStatus={data.status}
                            onEditClicked={() => onEditClicked(data.uuid)}
                        />
                    )
                })}
            </Box>
        </VStack>
    )
}