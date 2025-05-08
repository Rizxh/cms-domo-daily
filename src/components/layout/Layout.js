import Sidebar from "../Sidebar/Index";
import Head from "next/head";
import { useRouter } from "next/router"

export default function Layout({ children, authorized }) {
    const router = useRouter()

    return (
        <>
            <Head>
                <title>DOMO Daily Management</title>
                <link rel="icon" href="/domo-icon.svg" type="image/x-icon" />
            </Head>
            {(() => {
                if (authorized) {
                    if (router.pathname.startsWith("/admin/")) {
                        return (
                            <Sidebar>
                                <main>{children}</main>
                            </Sidebar>
                        );
                    } else {
                        return (
                            <>
                                <main>{children}</main>
                            </>
                        );
                    }
                } else {
                    return <main>{children}</main>;
                }
            })()}
        </>
    );
}
