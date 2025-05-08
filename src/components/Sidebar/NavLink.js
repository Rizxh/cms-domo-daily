import { HStack, Link, Icon, Text, Image, useColorModeValue as mode, } from "@chakra-ui/react";

export const NavLink = ({ icon, isActive, label, isImage, ...rest }) => {
    return (
        <Link
            display="block"
            py={2}
            px={3}
            borderRadius="md"
            transition="all 0.3s"
            fontWeight="medium"
            lineHeight="2rem"
            aria-current={isActive ? "page" : undefined}
            _hover={{
                color: 'white',
            }}
            _activeLink={{
                bg: "#EB1C23",
                color: mode("white", "white"),
                '& img': {
                    filter: 'brightness(100)'
                }
            }}
            {...rest}
        >
            <HStack spacing={4}>
                {isImage ? (
                    <Image src={icon} boxSize="20px" />
                ) : (
                    <Icon as={icon} boxSize="30px" />
                )}
                <Text as="span" fontSize={{ base: "xs", lg: "md" }}>
                    {label}
                </Text>
            </HStack>
        </Link>
    );
};