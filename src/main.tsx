import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./app/App.tsx";
import "./styles/index.css";

// createBrowserRouter (data router) is the recommended React Router v7 API.
// It provides the DataRouterContext that useNavigate/useLocation require.
// All routes are namespaced by vertical: /:vertical/*
// Bare / redirects to /healthcare (default vertical).
import { Navigate } from "react-router";
const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/healthcare" replace /> },
  { path: "/:vertical/*", element: <App /> },
  { path: "*", element: <Navigate to="/healthcare" replace /> },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
