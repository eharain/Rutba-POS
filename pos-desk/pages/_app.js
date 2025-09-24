// pages/_app.js
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { UtilProvider } from "../context/UtilContext";

import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../src/app/globals.css'; // your own global styles last

import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function App({ Component, pageProps }) {
    return (
        <div className={`${geistSans.variable} ${geistMono.variable}`}>
            <AuthProvider>
                <CartProvider>
                    <UtilProvider>
                        <Component {...pageProps} />
                    </UtilProvider>
                </CartProvider>
            </AuthProvider>
        </div>
    );
}
