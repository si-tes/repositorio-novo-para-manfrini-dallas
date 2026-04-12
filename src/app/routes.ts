import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/product/:id",
    Component: ProductDetail,
  },
  {
    path: "/checkout",
    Component: Checkout,
  },
]);
