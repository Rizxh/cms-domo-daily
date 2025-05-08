import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Flex,
  IconButton,
  Link,
  Stack,
  VStack,
  useDisclosure,
  Image,
  color
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { UserProfile } from "./UserProfile";
import Logo from "./Logo";
import { NavLink } from "./NavLink";

// Import end

export default function Sidebar({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    if (router.isReady) {
      setIsLoading(false);
    }
  }, [router]);

  const LinkComponent = () => {
    return (
      <>
        <Link href="/admin/article" _hover={{
          textDecoration: 'none',
        }}>
          <NavLink
            label={isCollapsed ? "" : "Article"}
            icon="/icons/article.png"
            isImage={true}
            aria-current={router.pathname == "/admin/article" ? "page" : undefined}
            showLabel={!isCollapsed}
            _hover={{
              color: '#CB1517',
              textDecoration: 'none',
              transition: 'none',
              '& img': {
                filter: 'invert(27%) sepia(94%) saturate(7457%) hue-rotate(357deg) brightness(80%) contrast(106%)',
              }
            }}
          />
        </Link>

        <Link href="/admin/media" _hover={{
          textDecoration: 'none',
        }}>
          <NavLink
            label={isCollapsed ? "" : "Media"}
            icon="/icons/media.png"
            isImage={true}
            aria-current={router.pathname == "/admin/media" ? "page" : undefined}
            showLabel={!isCollapsed}
            _hover={{
              color: '#CB1517',
              textDecoration: 'none',
              transition: 'none',
              '& img': {
                filter: 'invert(27%) sepia(94%) saturate(7457%) hue-rotate(357deg) brightness(80%) contrast(106%)',
              }
            }}
          />
        </Link>

        <Link href="/admin/user" _hover={{
          textDecoration: 'none',
        }}
        >
          <NavLink
            label={isCollapsed ? "" : "User"}
            icon="/icons/user.png"
            isImage={true}
            aria-current={router.pathname == "/admin/user" ? "page" : undefined}
            showLabel={!isCollapsed}
            _hover={{
              color: '#CB1517',
              textDecoration: 'none',
              transition: 'none',
              '& img': {
                filter: 'invert(27%) sepia(94%) saturate(7457%) hue-rotate(357deg) brightness(80%) contrast(106%)',
              }
            }}
          />
        </Link>

        <Link href="/admin/history" _hover={{
          textDecoration: 'none',
        }}
        >
          <NavLink
            label={isCollapsed ? "" : "History"}
            icon="/icons/history.png"
            isImage={true}
            aria-current={router.pathname == "/admin/history" ? "page" : undefined}
            showLabel={!isCollapsed}
            _hover={{
              color: '#CB1517',
              textDecoration: 'none',
              transition: 'none',
              '& img': {
                filter: 'invert(27%) sepia(94%) saturate(7457%) hue-rotate(357deg) brightness(80%) contrast(106%)',
              }
            }}
          />
        </Link>
      </>
    );
  };

  if (!isLoading) {
    return (
      <>
        {/* Sidebar Desktop */}
        <Flex display={{ base: "none", xl: "flex" }}>
          <Flex
            width={{ base: "full", sm: isCollapsed ? "6vw" : "25vw" }}
            py={{ base: "6", sm: "8" }}
            px={{ base: "4", sm: "6" }}
            flex="1"
            bg="bg.surface"
            borderRightWidth="1px"
            justifyContent="space-between"
            height="100vh"
            direction="column"
            position="fixed"
            transition={'0.5s ease-in-out'}
          >
            <Stack spacing="6">
              <Flex justify="end" align="center">
                <IconButton
                  icon={isCollapsed ? <HamburgerIcon /> : <HamburgerIcon />}
                  transition={"ease-in"}
                  aria-label={"Toggle Sidebar"}
                  onClick={toggleSidebar}
                />
              </Flex>
              <Box display={isCollapsed ? "" : "block"} mb={'20px'}>
                <Logo alignSelf="center" />
              </Box>
            </Stack>

            <Stack spacing={6}>
              <Box h="60vh">
                <Stack>
                  <LinkComponent />
                </Stack>
              </Box>
            </Stack>
            <UserProfile 
              name="Domo Daily"
              role="Admin" 
              isCollapsed={isCollapsed} />
          </Flex>
        </Flex>
        {/* End Sidebar Desktop */}

        {/* Mobile Display */}
        <Flex display={{ base: "flex", xl: "none" }}>
          <VStack w="100%" gap="0">
            <Box bg="white" px="4" w="100%" boxShadow={"lg"} zIndex="2">
              <Flex
                h="16"
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <IconButton
                  size={"md"}
                  icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                  aria-label={"Open Menu"}
                  display={{ xl: "none" }}
                  onClick={isOpen ? onClose : onOpen}
                />
                <Center>
                  <Logo iconColor="blue.600" />
                </Center>
                <UserProfile 
                  name="Ducati Owner Club Indonesia"
                  role="Admin"/>
              </Flex>
              <Box
                pb={4}
                display={isOpen ? "block" : "none"}
                opacity={isOpen ? 1 : 0}
                transform={isOpen ? "scale(1)" : "scale(0.95)"}
                transition="all 0.3s ease-in-out"
              >
                <Stack as={"nav"} spacing="1">
                  <LinkComponent />
                </Stack>
              </Box>
            </Box>
          </VStack>
        </Flex>
        {/* End Mobile Display */}

        <Box
          flex="1"
          bg="gray.100"
          mt="0 !important"
          ml={{ base: "0", xl: isCollapsed ? "6vw" : "25vw" }} // Sidebar smaller when collapsed, wider when expanded
          maxW={{ base: "100vw", xl: isCollapsed ? "100vw" : "90vw" }} // More room when collapsed
          transition={'0.5s ease-in-out'}
        >
          {children}
        </Box>

      </>
    );
  }
}