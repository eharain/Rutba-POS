import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { UtilProvider } from "../context/UtilContext";

import RootLayout from "../src/app/RootLayout";

export default function App({ Component, pageProps }) {
    return (

        <AuthProvider>
            <UtilProvider>
                <Component {...pageProps} />
            </UtilProvider>
        </AuthProvider>

    );
}
