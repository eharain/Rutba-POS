import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </AuthProvider>
  );
}
