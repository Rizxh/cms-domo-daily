import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { HStack, IconButton, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { MdOutlineModeEdit } from "react-icons/md";
import { useRouter } from "next/router";
import SweetAlert from "./SweetAlert";
import { BiSolidTrashAlt } from "react-icons/bi";
import { userService } from "../../services";
import { fetchWrapper } from "../../helpers";

export default function TableUser(props) {
    const router = useRouter();
    const toast = useToast();

    const [currentDeletedData, setCurrentDeletedData] = useState();
    const [alert, setAlert] = useState({});
    const [isOpenAlert, setIsOpenAlert] = useState(false);
    const [onSubmission, setOnSubmission] = useState(false);

    const { data, handleEditUser } = props;

    const handleEdit = (data) => {
        handleEditUser(data);
    };

    const handleClick = () => {
        setIsOpenAlert(true);
        setAlert({ type: "success", message: "Hello Next.js!" });
    };

    const deleteData = (uuid) => {
        setOnSubmission(true);

        fetchWrapper.post('/api/user/delete-data', { 
            user_id: userService.userValue.id,
            uuid })
            .then((res) => {
                const toastId = "input-data-toast";
                if (res.success) {
                    if (!toast.isActive(toastId)) {
                        toast({
                            toastId,
                            title: "User successfully deleted",
                            status: "success",
                            duration: 1500,
                            isClosable: true,
                            position: "top",
                        });
                    }
                    setTimeout(() => router.reload(), 2000);
                } else {
                    if (!toast.isActive(toastId)) {
                        toast({
                            id: toastId,
                            title: res.message,
                            status: "error",
                            duration: 3000,
                            isClosable: true,
                            position: "top",
                        });
                    }
                }
            })
            .finally(() => setOnSubmission(false));
    };

    return (
        <TableContainer>
            <Table variant="simple" rounded="lg">
                <Thead bg="#EBEBEB" roundedTop="xl">
                    <Tr>
                        {/* Header Table */}
                        <Th textAlign="center" p="5">No.</Th>
                        <Th textAlign="center" p="5" minW="150px">Name</Th>
                        <Th textAlign="center" p="5" minW="150px">E-mail</Th>
                        <Th textAlign="center" p="5" minW="150px">Role</Th>
                        <Th textAlign="center" p="5" minW="150px" position="sticky" right="0" bg="#EBEBEB">Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data?.map((item, index) => {
                        return (
                            <Tr key={item.id}>
                                <Td textAlign="center"><Text fontSize={{ base: "xs", xl: "sm" }}>{index + 1}</Text></Td>
                                <Td textAlign="center"><Text fontSize={{ base: "xs", xl: "sm" }} minW="150px">{item.name}</Text></Td>
                                <Td textAlign="center"><Text fontSize={{ base: "xs", xl: "sm" }} minW="150px">{item.email}</Text></Td>
                                <Td textAlign="center"><Text fontSize={{ base: "xs", xl: "sm" }} minW="150px">{item.role}</Text></Td>
                                <Td textAlign="center">
                                    <HStack gap="2" justifyContent="center">
                                        <IconButton
                                            color="white"
                                            bg='#CB1517'
                                            fontSize='25px'
                                            icon={<MdOutlineModeEdit />}
                                            _hover={{
                                                bg: "#A81314"
                                            }}
                                            isDisabled={onSubmission}
                                            onClick={() => handleEdit(item)}
                                        />
                                        <IconButton
                                            color="white"
                                            bg='#CB1517'
                                            fontSize='20px'
                                            icon={<BiSolidTrashAlt />}
                                            _hover={{
                                                bg: "#A81314"
                                            }}
                                            isDisabled={onSubmission}
                                            onClick={() => {
                                                setCurrentDeletedData(item);
                                                handleClick();
                                            }}
                                        />
                                        {isOpenAlert && (
                                            <SweetAlert
                                                alert={alert}
                                                handleDelete={() => deleteData(currentDeletedData.uuid)}
                                            />
                                        )}
                                    </HStack>
                                </Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        </TableContainer>
    );
}
