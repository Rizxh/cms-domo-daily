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
  color,
  Grid,
  HStack
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { UserProfile } from "./UserProfile";
import Logo from "./Logo";
import { NavLink } from "./NavLink";
import { fetchWrapper } from "../../../helpers";
import { userService } from "../../../services";

// Import end

export default function Sidebar({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    if (router.isReady) {
      setIsLoading(false);
      findUser()
    }
  }, [router]);

  const findUser = async () => {
    fetchWrapper
      .post(`/api/user/get-current-user`, {
        uuid: userService.userValue?.id,
      })
      .then((res) => {
        const inputDataToast = "input-data-toast";
        if (res.success) {
          setCurrentUser(res.data);
        }
      });
  };

  const LinkComponent = () => {
    // if (userService?.userValue?.role === "Admin") {
    //   return (
    //     <>
    //       <Link href="/admin/membership-request"
    //         _hover={{
    //           textDecoration: 'none',
    //         }}
    //       >
    //         <NavLink
    //           label={isCollapsed ? "" : "Membership Request"}
    //           icon="/icons/membership-request.png"
    //           isImage={true}
    //           aria-current={router.pathname == "/admin/membership-request" ? "page" : undefined}
    //           showLabel={!isCollapsed}
    //           _hover={{
    //             color: '#CB1517',
    //             textDecoration: 'none',
    //             transition: 'none',
    //             '& img': {
    //               filter: 'invert(27%) sepia(94%) saturate(7457%) hue-rotate(357deg) brightness(80%) contrast(106%)',
    //             }
    //           }}
    //         />
    //       </Link>
    //       <Link href="/admin/member" _hover={{
    //         textDecoration: 'none',
    //       }}>
    //         <NavLink
    //           label={isCollapsed ? "" : "Member"}
    //           icon="/icons/member.png"
    //           isImage={true}
    //           aria-current={router.pathname == "/admin/member" ? "page" : undefined}
    //           showLabel={!isCollapsed}
    //           _hover={{
    //             color: '#CB1517',
    //             textDecoration: 'none',
    //             transition: 'none',
    //             '& img': {
    //               filter: 'invert(27%) sepia(94%) saturate(7457%) hue-rotate(357deg) brightness(80%) contrast(106%)',
    //             }
    //           }}
    //         />
    //       </Link>
    //       <Link href="/admin/message" _hover={{
    //         textDecoration: 'none',
    //       }}>
    //         <NavLink
    //           label={isCollapsed ? "" : "Message"}
    //           icon="/icons/message.png"
    //           isImage={true}
    //           aria-current={router.pathname == "/admin/message" ? "page" : undefined}
    //           showLabel={!isCollapsed}
    //           _hover={{
    //             color: '#CB1517',
    //             textDecoration: 'none',
    //             transition: 'none',
    //             '& img': {
    //               filter: 'invert(27%) sepia(94%) saturate(7457%) hue-rotate(357deg) brightness(80%) contrast(106%)',
    //             }
    //           }}
    //         />
    //       </Link>
    //       <Link href="/admin/user" _hover={{
    //         textDecoration: 'none',
    //       }}
    //       >
    //         <NavLink
    //           label={isCollapsed ? "" : "User"}
    //           icon="/icons/user.png"
    //           isImage={true}
    //           aria-current={router.pathname == "/admin/user" ? "page" : undefined}
    //           showLabel={!isCollapsed}
    //           _hover={{
    //             color: '#CB1517',
    //             textDecoration: 'none',
    //             transition: 'none',
    //             '& img': {
    //               filter: 'invert(27%) sepia(94%) saturate(7457%) hue-rotate(357deg) brightness(80%) contrast(106%)',
    //             }
    //           }}
    //         />
    //       </Link>
    //       <Link href="/admin/log" _hover={{
    //         textDecoration: 'none',
    //       }}
    //       >
    //         <NavLink
    //           label={isCollapsed ? "" : "Log"}
    //           icon="/icons/log.png"
    //           isImage={true}
    //           aria-current={router.pathname == "/admin/log" ? "page" : undefined}
    //           showLabel={!isCollapsed}
    //           _hover={{
    //             color: '#CB1517',
    //             textDecoration: 'none',
    //             transition: 'none',
    //             '& img': {
    //               filter: 'invert(27%) sepia(94%) saturate(7457%) hue-rotate(357deg) brightness(80%) contrast(106%)',
    //             }
    //           }}
    //         />
    //       </Link>
    //     </>
    //   );
    // } else if (userService?.userValue?.role === "Media") {
    //   return (
    //     <>
    //       <Link href="/admin/message" _hover={{
    //         textDecoration: 'none',
    //       }}>
    //         <NavLink
    //           label={isCollapsed ? "" : "Message"}
    //           icon="/icons/message.png"
    //           isImage={true}
    //           aria-current={router.pathname == "/admin/message" ? "page" : undefined}
    //           showLabel={!isCollapsed}
    //           _hover={{
    //             color: '#CB1517',
    //             textDecoration: 'none',
    //             transition: 'none',
    //             '& img': {
    //               filter: 'invert(27%) sepia(94%) saturate(7457%) hue-rotate(357deg) brightness(80%) contrast(106%)',
    //             }
    //           }}
    //         />
    //       </Link>
    //       <Link href="/admin/banner" _hover={{
    //         textDecoration: 'none',
    //       }}>
    //         <NavLink
    //           label={isCollapsed ? "" : "Banner"}
    //           icon="/icons/banner.png"
    //           isImage={true}
    //           aria-current={router.pathname == "/admin/banner" ? "page" : undefined}
    //           showLabel={!isCollapsed}
    //           _hover={{
    //             color: '#CB1517',
    //             textDecoration: 'none',
    //             transition: 'none',
    //             '& img': {
    //               filter: 'invert(27%) sepia(94%) saturate(7457%) hue-rotate(357deg) brightness(80%) contrast(106%)',
    //             }
    //           }}
    //         />
    //       </Link>
    //       <Link href="/admin/sponsor" _hover={{
    //         textDecoration: 'none',
    //       }}>
    //         <NavLink
    //           label={isCollapsed ? "" : "Sponsor"}
    //           icon="/icons/sponsor.png"
    //           isImage={true}
    //           aria-current={router.pathname == "/admin/sponsor" ? "page" : undefined}
    //           showLabel={!isCollapsed}
    //           _hover={{
    //             color: '#CB1517',
    //             textDecoration: 'none',
    //             transition: 'none',
    //             '& img': {
    //               filter: 'invert(27%) sepia(94%) saturate(7457%) hue-rotate(357deg) brightness(80%) contrast(106%)',
    //             }
    //           }}
    //         />
    //       </Link>
    //       <Link href="/admin/news" _hover={{
    //         textDecoration: 'none',
    //       }}>
    //         <NavLink
    //           label={isCollapsed ? "" : "News"}
    //           icon="/icons/news.png"
    //           isImage={true}
    //           aria-current={router.pathname == "/admin/news" ? "page" : undefined}
    //           showLabel={!isCollapsed}
    //           _hover={{
    //             color: '#CB1517',
    //             textDecoration: 'none',
    //             transition: 'none',
    //             '& img': {
    //               filter: 'invert(27%) sepia(94%) saturate(7457%) hue-rotate(357deg) brightness(80%) contrast(106%)',
    //             }
    //           }}
    //         />
    //       </Link>
    //       <Link href="/admin/post" _hover={{
    //         textDecoration: 'none',
    //       }}>
    //         <NavLink
    //           label={isCollapsed ? "" : "Post"}
    //           icon="/icons/post.png"
    //           isImage={true}
    //           aria-current={router.pathname == "/admin/post" ? "page" : undefined}
    //           showLabel={!isCollapsed}
    //           _hover={{
    //             color: '#CB1517',
    //             textDecoration: 'none',
    //             transition: 'none',
    //             '& img': {
    //               filter: 'invert(27%) sepia(94%) saturate(7457%) hue-rotate(357deg) brightness(80%) contrast(106%)',
    //             }
    //           }}
    //         />
    //       </Link>
    //     </>
    //   );
    // } else {
    //   return (
    //     <>
    //       <Link href="/admin/membership-request"
    //         _hover={{
    //           textDecoration: 'none',
    //         }}
    //       >
    //         <NavLink
    //           label={isCollapsed ? "" : "Membership Request"}
    //           icon="/icons/membership-request.png"
    //           isImage={true}
    //           aria-current={router.pathname == "/admin/membership-request" ? "page" : undefined}
    //           showLabel={!isCollapsed}
    //           _hover={{
    //             color: '#CB1517',
    //             textDecoration: 'none',
    //             transition: 'none',
    //             '& img': {
    //               filter: 'invert(27%) sepia(94%) saturate(7457%) hue-rotate(357deg) brightness(80%) contrast(106%)',
    //             }
    //           }}
    //         />
    //       </Link>
    //       <Link href="/admin/member" _hover={{
    //         textDecoration: 'none',
    //       }}>
    //         <NavLink
    //           label={isCollapsed ? "" : "Member"}
    //           icon="/icons/member.png"
    //           isImage={true}
    //           aria-current={router.pathname == "/admin/member" ? "page" : undefined}
    //           showLabel={!isCollapsed}
    //           _hover={{
    //             color: '#CB1517',
    //             textDecoration: 'none',
    //             transition: 'none',
    //             '& img': {
    //               filter: 'invert(27%) sepia(94%) saturate(7457%) hue-rotate(357deg) brightness(80%) contrast(106%)',
    //             }
    //           }}
    //         />
    //       </Link>
    //       <Link href="/admin/message" _hover={{
    //         textDecoration: 'none',
    //       }}>
    //         <NavLink
    //           label={isCollapsed ? "" : "Message"}
    //           icon="/icons/message.png"
    //           isImage={true}
    //           aria-current={router.pathname == "/admin/message" ? "page" : undefined}
    //           showLabel={!isCollapsed}
    //           _hover={{
    //             color: '#CB1517',
    //             textDecoration: 'none',
    //             transition: 'none',
    //             '& img': {
    //               filter: 'invert(27%) sepia(94%) saturate(7457%) hue-rotate(357deg) brightness(80%) contrast(106%)',
    //             }
    //           }}
    //         />
    //       </Link>
    //       <Link href="/admin/banner" _hover={{
    //         textDecoration: 'none',
    //       }}>
    //         <NavLink
    //           label={isCollapsed ? "" : "Banner"}
    //           icon="/icons/banner.png"
    //           isImage={true}
    //           aria-current={router.pathname == "/admin/banner" ? "page" : undefined}
    //           showLabel={!isCollapsed}
    //           _hover={{
    //             color: '#CB1517',
    //             textDecoration: 'none',
    //             transition: 'none',
    //             '& img': {
    //               filter: 'invert(27%) sepia(94%) saturate(7457%) hue-rotate(357deg) brightness(80%) contrast(106%)',
    //             }
    //           }}
    //         />
    //       </Link>
    //       <Link href="/admin/sponsor" _hover={{
    //         textDecoration: 'none',
    //       }}>
    //         <NavLink
    //           label={isCollapsed ? "" : "Sponsor"}
    //           icon="/icons/sponsor.png"
    //           isImage={true}
    //           aria-current={router.pathname == "/admin/sponsor" ? "page" : undefined}
    //           showLabel={!isCollapsed}
    //           _hover={{
    //             color: '#CB1517',
    //             textDecoration: 'none',
    //             transition: 'none',
    //             '& img': {
    //               filter: 'invert(27%) sepia(94%) saturate(7457%) hue-rotate(357deg) brightness(80%) contrast(106%)',
    //             }
    //           }}
    //         />
    //       </Link>
    //       <Link href="/admin/news" _hover={{
    //         textDecoration: 'none',
    //       }}>
    //         <NavLink
    //           label={isCollapsed ? "" : "News"}
    //           icon="/icons/news.png"
    //           isImage={true}
    //           aria-current={router.pathname == "/admin/news" ? "page" : undefined}
    //           showLabel={!isCollapsed}
    //           _hover={{
    //             color: '#CB1517',
    //             textDecoration: 'none',
    //             transition: 'none',
    //             '& img': {
    //               filter: 'invert(27%) sepia(94%) saturate(7457%) hue-rotate(357deg) brightness(80%) contrast(106%)',
    //             }
    //           }}
    //         />
    //       </Link>
    //       <Link href="/admin/post" _hover={{
    //         textDecoration: 'none',
    //       }}>
    //         <NavLink
    //           label={isCollapsed ? "" : "Post"}
    //           icon="/icons/post.png"
    //           isImage={true}
    //           aria-current={router.pathname == "/admin/post" ? "page" : undefined}
    //           showLabel={!isCollapsed}
    //           _hover={{
    //             color: '#CB1517',
    //             textDecoration: 'none',
    //             transition: 'none',
    //             '& img': {
    //               filter: 'invert(27%) sepia(94%) saturate(7457%) hue-rotate(357deg) brightness(80%) contrast(106%)',
    //             }
    //           }}
    //         />
    //       </Link>
    //       <Link href="/admin/user" _hover={{
    //         textDecoration: 'none',
    //       }}
    //       >
    //         <NavLink
    //           label={isCollapsed ? "" : "User"}
    //           icon="/icons/user.png"
    //           isImage={true}
    //           aria-current={router.pathname == "/admin/user" ? "page" : undefined}
    //           showLabel={!isCollapsed}
    //           _hover={{
    //             color: '#CB1517',
    //             textDecoration: 'none',
    //             transition: 'none',
    //             '& img': {
    //               filter: 'invert(27%) sepia(94%) saturate(7457%) hue-rotate(357deg) brightness(80%) contrast(106%)',
    //             }
    //           }}
    //         />
    //       </Link>
    //       <Link href="/admin/log" _hover={{
    //         textDecoration: 'none',
    //       }}
    //       >
    //         <NavLink
    //           label={isCollapsed ? "" : "Log"}
    //           icon="/icons/log.png"
    //           isImage={true}
    //           aria-current={router.pathname == "/admin/log" ? "page" : undefined}
    //           showLabel={!isCollapsed}
    //           _hover={{
    //             color: '#CB1517',
    //             textDecoration: 'none',
    //             transition: 'none',
    //             '& img': {
    //               filter: 'invert(27%) sepia(94%) saturate(7457%) hue-rotate(357deg) brightness(80%) contrast(106%)',
    //             }
    //           }}
    //         />
    //       </Link>
    //     </>
    //   );
    // }

    return (
      <>
        {(() => {
          const navLinks = {
            "Super Admin": [
              { href: "/admin/article", label: "Article", icon: "/icons/article.png" },
              { href: "/admin/category", label: "Category", icon: "/icons/category.png" },
              { href: "/admin/media", label: "Media", icon: "/icons/media.png" },
              { href: "/admin/user", label: "User", icon: "/icons/user.png" },
              { href: "/admin/history", label: "History", icon: "/icons/history.png" },
            ],
            "Admin": [
              {href: "/admin/article", label: "Article", icon: "/icons/article.png" },
              { href: "/admin/media", label: "Media", icon: "/icons/media.png" },
              { href: "/admin/history", label: "History", icon: "/icons/history.png" },
            ],
            "Copywriter": [
              {href: "/admin/article", label: "Article", icon: "/icons/article.png" },
              { href: "/admin/media", label: "Media", icon: "/icons/media.png" },
            ],
          };

          const userRole = currentUser?.role;
          if (!userRole || !navLinks[userRole]) return null;

          return (
            <>
              {navLinks[userRole].map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  _hover={{
                    textDecoration: 'none',
                  }}
                >
                  <NavLink
                    label={isCollapsed ? "" : link.label}
                    icon={link.icon}
                    isImage={true}
                    aria-current={router.pathname === link.href ? "page" : undefined}
                    showLabel={!isCollapsed}
                    _hover={{
                      color: '#CB1517',
                      textDecoration: 'none',
                      transition: 'none',
                      '& img': {
                        filter: 'invert(27%) sepia(94%) saturate(7457%) hue-rotate(357deg) brightness(80%) contrast(106%)',
                      },
                    }}
                  />
                </Link>
              ))}

            </>
          );
        })()}


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
              {isCollapsed ?
                <>
                  <Flex justify="end" align="center" justifyContent="center">
                    <IconButton
                      icon={isCollapsed ? <HamburgerIcon /> : <HamburgerIcon />}
                      transition={"ease-in"}
                      aria-label={"Toggle Sidebar"}
                      onClick={toggleSidebar}
                    />
                  </Flex>
                  <Box display={isCollapsed ? "" : "block"} mb={'20px'}>
                    <Logo alignSelf="center" />
                  </Box></> :
                <>
                  <HStack justify="space-between" align="center">
                    <Box w={"100%"} pl="40px">
                      <Logo />
                    </Box>
                    <Box h={"100%"}>
                      <IconButton
                        icon={isCollapsed ? <HamburgerIcon /> : <HamburgerIcon />}
                        transition={"ease-in"}
                        aria-label={"Toggle Sidebar"}
                        alignContent={"start"}
                        onClick={toggleSidebar}
                      />

                    </Box>
                  </HStack>
                </>}

            </Stack>

            <Stack spacing={6}>
              <Box h="60vh" overflowY="auto">
                <Stack>
                  <LinkComponent />
                </Stack>
              </Box>
            </Stack>
            <UserProfile user={currentUser} isCollapsed={isCollapsed} />
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
                  user={currentUser}
                />
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
