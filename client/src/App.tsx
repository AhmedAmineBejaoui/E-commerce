import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import CartPage from "@/pages/cart-page";
import ProductDetailPage from "@/pages/product-detail-page";
import CheckoutPage from "@/pages/checkout-page";
import AdminDashboard from "@/pages/admin/admin-dashboard";
import AdminProducts from "@/pages/admin/admin-products";
import AdminOrders from "@/pages/admin/admin-orders";
import { ProtectedRoute } from "./lib/protected-route";
import MainLayout from "./components/layout/MainLayout";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./hooks/use-auth";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/cart" component={CartPage} />
      <Route path="/product/:slug" component={ProductDetailPage} />
      <ProtectedRoute path="/checkout" component={CheckoutPage} />
      <ProtectedRoute path="/admin/dashboard" component={AdminDashboard} adminOnly={true} />
      <ProtectedRoute path="/admin/products" component={AdminProducts} adminOnly={true} />
      <ProtectedRoute path="/admin/orders" component={AdminOrders} adminOnly={true} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainLayout>
          <Router />
          <Toaster />
        </MainLayout>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
