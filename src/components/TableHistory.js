import {
    HStack,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";

export default function TableHistory(props) {
    const { data } = props;

    return (
        <>
            <TableContainer>
                <Table rounded="lg">
                    <Thead bg="#EBEBEB" roundedTop="xl">
                        <Tr>
                            <Th textAlign="center" minW="150px">
                                Timestamps
                            </Th>
                            <Th textAlign="center" minW="150px">
                                Username
                            </Th>
                            <Th textAlign="center" minW="150px">
                                Activity
                            </Th>
                            <Th textAlign="center" minW="150px">
                                Environment
                            </Th>
                            <Th textAlign="center" minW="150px">
                                Description
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data?.map((item) => {
                            return (
                                <Tr key={item.timestamps}>
                                    <Td textAlign="center">
                                        <HStack spacing="3" justifyContent="center">
                                            <Text fontSize={{ base: "xs", xl: "sm" }} minW="150px">
                                                {item.timestamps}
                                            </Text>
                                        </HStack>
                                    </Td>
                                    <Td textAlign="center">
                                        <HStack spacing="3" justifyContent="center">
                                            <Text fontSize={{ base: "xs", xl: "sm" }} minW="150px">
                                                {item.username}
                                            </Text>
                                        </HStack>
                                    </Td>
                                    <Td textAlign="center">
                                        <HStack spacing="3" justifyContent="center">
                                            <Text fontSize={{ base: "xs", xl: "sm" }} minW="150px">
                                                {item.activity}
                                            </Text>
                                        </HStack>
                                    </Td>
                                    <Td textAlign="center">
                                        <HStack spacing="3" justifyContent="center">
                                            <Text fontSize={{ base: "xs", xl: "sm" }} minW="150px">
                                                {item.environment}
                                            </Text>
                                        </HStack>
                                    </Td>
                                    <Td textAlign="center">
                                        <HStack spacing="3" justifyContent="center">
                                            <Text fontSize={{ base: "xs", xl: "sm" }} whiteSpace="pre-wrap">
                                                {item.description}
                                            </Text>
                                        </HStack>
                                    </Td>
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
        </>
    );
}
