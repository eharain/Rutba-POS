import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import RootLayout from "../src/app/RootLayout";

export default function App({ Component, pageProps }) {
    return (
        <RootLayout>
            <AuthProvider>
                <CartProvider>
                    <Component {...pageProps} />
                </CartProvider>
            </AuthProvider>
        </RootLayout>
    );
}
