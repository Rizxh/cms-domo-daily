import Head from "next/head";
import Sidebar from "../Sidebar/Index";

export default function Layout({ children }) {
    return (
        <>
            <Head>
                <title>Dashboard Domo Daily</title>
                <link rel="icon" href="/next.svg" type="image/x-icon" />
            </Head>
            <Sidebar>
                <main>{children}</main>
            </Sidebar>
        </>
    )
}