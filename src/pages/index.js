import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { alertService, userService } from '../../services'

export default function Login() {
  const router = useRouter()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorTooltip, setErrorTooltip] = useState(false);

  useEffect(() => {
    if(router.isReady) {
      if(userService?.userValue) {
        if(userService?.userValue?.role === "Copywriter") {
          router.push('/admin/article')
        } else {
          router.push('/admin/media')
        }
      }
    }
  }, [router, userService?.userValue])

  const signInClicked = async () => {
    if(email && password) {
      return userService.login(email, password).then((res) => {
        const inputDataToast = "input-data-toast"
        if(res.success) {
          if(res.role === "Copywriter") {
            router.push('/admin/article')
          } else {
            router.push('/admin/media')
          }
        } else {
          if(!toast.isActive(inputDataToast)) {
            toast({
              id: inputDataToast,
              title: res.message,
              status: "error",
              duration: 3000,
              isClosable: true,
              position: "top"
            })
          }
        }
      })
      .catch(alertService.error)
    } else {
      setErrorTooltip(true)
      setTimeout(() => setErrorTooltip(false), 3000)
    }
  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          Login to Your Account
        </Heading>
        <FormControl id="email" isInvalid={!email && errorTooltip} isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
            placeholder="email"
            _placeholder={{ color: 'gray.500' }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl id="password" isInvalid={!password && errorTooltip} isRequired>
          <FormLabel>Password</FormLabel>
          <Input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Stack spacing={6}>
          <Button
            bg={'red.600'}
            color={'white'}
            _hover={{
              bg: 'red.700',
            }}
            onClick={signInClicked}
            >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  )
}