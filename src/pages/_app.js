import Layout from "@/components/layout/Layout";
import theme from "@/components/theme";
import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "./AuthContext";

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
}
