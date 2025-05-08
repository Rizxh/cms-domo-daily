import User from "@/pages/admin/user";
import {
    Avatar,
    Box,
    Button,
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Stack,
    StackDivider,
    Text,
    useBreakpointValue,
} from "@chakra-ui/react";
import { FiMoreVertical } from "react-icons/fi";
import { userService } from "../../../services";

export const UserProfile = (props) => {
    const { user, isCollapsed } = props;

    const isMobile = useBreakpointValue({ base: true, xl: false });

    const onLogoutClicked = async () => {
        userService.logout();
    };

    if (!isMobile) {
        return (
            <Stack spacing="4" divider={<StackDivider />}>
                <Box />
                <HStack justify="space-between">
                    <HStack>
                        {!isCollapsed ? (
                            <>
                                <Avatar boxSize="10" src="https://i.pravatar.cc/300" />
                                <Box>
                                    <Text
                                        textStyle="sm"
                                        fontWeight="medium"
                                        fontSize={{ base: "xs", lg: "sm" }}
                                        maxW="15vw"
                                    >
                                        {user?.name || "Guest"}
                                    </Text>
                                    <Text
                                        textStyle="sm"
                                        color="fg.muted"
                                        fontSize={{ base: "xs", lg: "sm" }}
                                    >
                                        {user?.role || "Anonymous"}
                                    </Text>
                                </Box>
                            </>
                        ) : null}
                    </HStack>

                    {!isCollapsed ? (
                        <Menu>
                            <MenuButton
                                as={Button}
                                rounded={"full"}
                                variant={"link"}
                                cursor={"pointer"}
                                minW={0}
                            >
                                <IconButton
                                    variant="tertiary"
                                    icon={<FiMoreVertical />}
                                    aria-label="Open Menu"
                                />
                            </MenuButton>
                            <MenuList
                                style={{ position: "absolute", right: "0px", bottom: "50px" }}
                            >
                                <MenuItem onClick={onLogoutClicked}>Logout</MenuItem>
                            </MenuList>
                        </Menu>
                    ) : (
                        <Menu>
                            <MenuButton
                                as={Avatar}
                                boxSize="10"
                                src="https://i.pravatar.cc/300"
                                cursor={"pointer"}
                            />
                            <MenuList
                                style={{ position: "absolute", left: "10px", bottom: "50px" }}
                            >
                                <MenuItem onClick={onLogoutClicked}>Logout</MenuItem>
                            </MenuList>
                        </Menu>
                    )}
                </HStack>
            </Stack>
        );
    } else {
        return (
            <Stack spacing="4">
                <HStack spacing="3" justify="space-between">
                    <Menu>
                        <MenuButton
                            as={Button}
                            rounded={"full"}
                            variant={"link"}
                            cursor={"pointer"}
                            minW={0}
                        >
                            <Avatar boxSize="8" src="https://i.pravatar.cc/300" />
                        </MenuButton>
                        <MenuList>
                            <MenuItem onClick={onLogoutClicked}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </HStack>
            </Stack>
        );
    }
};
