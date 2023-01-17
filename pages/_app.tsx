import '../styles/globals.css'
import type {AppProps} from 'next/app'
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {GoogleOAuthProvider} from '@react-oauth/google';
import {useEffect, useState} from "react";

export default function App({Component, pageProps}: AppProps) {
    const [isSSR, setIsSSR] = useState(true);

    useEffect(() => {
        setIsSSR(false);
    }, []);

    if (isSSR) return null;

    return (
        <>
            <GoogleOAuthProvider clientId={`${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`}>
                <div className='xl:w-[1200px] m-auto overflow-hidden height-[100vh]'>
                    <Navbar/>
                    <div className="flex gap-6 md:gap-20">
                        <aside className="h-[92vh] overflow-hidden xl:hover:overflow-auto">
                            <Sidebar/>
                        </aside>
                        <main className="mt-4 flex flex-col gap-10 overflow-auto h-[88vh] videos flex-1">
                            <Component {...pageProps} />
                        </main>
                    </div>
                </div>
            </GoogleOAuthProvider>
        </>
    )
}
