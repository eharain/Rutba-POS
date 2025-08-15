import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <Layout>
        <h1>POS Dashboard</h1>
        <p>Welcome. Use the nav to manage products, cart, sales, returns, and reports.</p>
      </Layout>
    </ProtectedRoute>
  );
}
