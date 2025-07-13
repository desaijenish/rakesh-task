// page/ProtectedRoutes.tsx
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import BlogAddEditForm from "./admin/blog/add";
import Blog from "./admin/blog";
import CategoryAddEditForm from "./admin/category/add";
import Category from "./admin/category";
import Register from "./admin/register/page";
import Login from "./admin/login/page";
import { ProgressIndicator } from "../components/ProgressIndicator";
import { useEffect, useState } from "react";
import { parseJwt } from "../utils/parseJwt";
import { DecodedToken } from "../utils/getUserPermissions";
import Cookies from "universal-cookie";
import ProductList from "./admin/product";
import ProductForm from "./admin/product/add";
import OrderList from "./admin/orders";
import OrderForm from "./admin/orders/Form";
import ProductRateList from "./admin/productRate";
import ProductRateForm from "./admin/productRate/Form";
import Home from "./public/home";

export default function ProtectedRoutes() {
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);
  // const [permissions, setPermissions] = useState<any>({});
  const navigate = useNavigate();
  const cookies = new Cookies();
  const token = cookies.get("token");
  const location = useLocation();

  // Define public routes
  const publicRoutes = ["/login", "/register"];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        const currentTime = Date.now() / 1000;
        const decodedToken: DecodedToken = parseJwt(token);

        if (decodedToken.exp < currentTime) {
          cookies.remove("token");
          navigate("/login");
        } else {
          setIsSuperAdmin(decodedToken.type === "company" || false);

          if (decodedToken.type !== "company") {
            const userPermissions: any = {};
            if (decodedToken?.roles) {
              decodedToken?.roles.forEach((role: any) => {
                role.permissions.forEach((permission: any) => {
                  userPermissions[permission.module] = permission.permissions;
                });
              });
            }
            // setPermissions(userPermissions);
          }

          // Redirect logged-in users away from login and register pages
          if (isPublicRoute) {
            navigate("/");
          }
        }
      }
    };

    checkToken();
  }, [token, navigate, location.pathname]);

  // Only show loading for protected routes when checking token
  if (!isPublicRoute && isSuperAdmin == null && token) {
    return <ProgressIndicator open />;
  }
  return (
    <Routes>
      {/* Public routes accessible without token */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      {token && (
        <>
          <Route path="/" element={<Home />} />

          <Route path="/products" element={<ProductList />} />
          <Route path="/products/add" element={<ProductForm />} />
          <Route path="/products/edit/:id" element={<ProductForm />} />

          <Route
            path="/products/:productId/rates"
            element={<ProductRateList />}
          />
          <Route
            path="/products/:productId/rates/add"
            element={<ProductRateForm />}
          />
          <Route
            path="/products/:productId/rates/edit/:id"
            element={<ProductRateForm />}
          />

          <Route path="/orders" element={<OrderList />} />
          <Route path="/orders/add" element={<OrderForm />} />
          <Route path="/orders/edit/:id" element={<OrderForm />} />
        </>
      )}

      {/* Redirect to login for protected routes without token */}
      {!token && !isPublicRoute && (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
}
