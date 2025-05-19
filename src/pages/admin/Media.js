import {
  Box,
  Divider,
  Heading,
  HStack,
  useDisclosure,
  Grid,
  Image,
  Button,
  VStack,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Icon,
  Text,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";

export default function Media() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const picRef = useRef(null);
  const [picture, setPicture] = useState(null);
  const [filePicture, setFilePicture] = useState(null);

  return (
    <VStack p={{ base: "4", xl: "8" }} align="stretch" minH="100vh" gap="5" spacing={4}>
      <SimpleGrid m="2" columns={{ base: "1", lg: "2" }} gap="4" w="100%">
        <Heading
          fontSize={{ base: "lg", lg: "2xl" }}
          fontWeight="500"
          textAlign={{ base: "center", lg: "left" }}
        >
          Media Storage
        </Heading>
        <HStack justifyContent={{ base: "center", lg: "flex-end" }}>
          <Button
            leftIcon={<FaPlus />}
            size={{ base: "sm", lg: "md" }}
            variant="solid"
            bg={"#CB1517"}
            color={"white"}
            rounded="xl"
            p="2"
            onClick={onOpen}
            _hover={{ bg: "#a41a1c" }}
          >
            ADD IMAGE
          </Button>

          <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add The Assets</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <HStack>
                  <Box
                    w="100%"
                    h="400px"
                    border="2px dashed #c6c5c5"
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                    onClick={() => picRef.current?.click()}
                    cursor="pointer"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      ref={picRef}
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const fileObj = e.target.files[0];
                        setFilePicture(fileObj);
                        const objectUrl = URL.createObjectURL(fileObj);
                        setPicture(objectUrl);
                      }}
                    />
                    {picture ? (
                      <Image
                        src={picture}
                        alt="Preview"
                        w="100%"
                        h="100%"
                        objectFit="cover"
                        borderRadius="md"
                      />
                    ) : (
                      <VStack spacing="2" color="gray.500">
                        <Icon as={FiUpload} boxSize={8} color="red.500" />
                        <Text fontWeight="semibold">Click to upload asset</Text>
                        <Text fontSize="sm">(Recommended: 973px x 360px)</Text>
                      </VStack>
                    )}
                  </Box>
                </HStack>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3}>
                  Upload
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </HStack>
      </SimpleGrid>

      <Grid templateColumns="repeat(4, 1fr)" gap={5}>
        {Array(7)
          .fill("https://bit.ly/dan-abramov")
          .map((src, idx) => (
            <Box
              key={idx}
              rounded="lg"
              bg={"white"}
              boxShadow="lg"
              p={{ base: 2, xl: 4 }}
              w="100%"
            >
              <Image w={"auto"} h={"auto"} src={src} alt={`Preview ${idx}`} />
            </Box>
          ))}
      </Grid>
      <Divider mt="5" mb="5" />
    </VStack>
  );
}
