import 'primereact/resources/themes/saga-blue/theme.css'; // atau pilih tema lain
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import { ChakraProvider } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { userService } from "../../services";
import theme from "../components/theme";
import Layout from "@/components/layout/Layout";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      // on initial load - run auth check
      authCheck(router.asPath);

      // on route change start - hide page content by setting authorized to false
      const hideContent = () => setAuthorized(false);
      router.events.on("routeChangeStart", hideContent);

      // on route change complete - run auth check
      router.events.on("routeChangeComplete", authCheck);

      // unsubscribe from events in useEffect return function
      return () => {
        router.events.off("routeChangeStart", hideContent);
        router.events.off("routeChangeComplete", authCheck);
      };

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [router]);

  function authCheck(url) {
    // redirect to login page if accessing a private page and not logged in
    const publicPaths = ["/"];
    const path = url.split("?")[0];
    if (!userService.userValue && !publicPaths.includes(path)) {
      setAuthorized(false);
      router.push({
        pathname: "/",
      });
    } else {
      setAuthorized(true);

      if (userService?.userValue) {
        setIsUserLoggedIn(true);
      }
    }
  }

  return (
    <ChakraProvider theme={theme}>
      <Layout authorized={isUserLoggedIn}>
        {authorized && <Component {...pageProps} />}
      </Layout>
    </ChakraProvider>
  );
}
