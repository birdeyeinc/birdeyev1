import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { DESIGN_VERSION, type DesignVersion } from "./config/designVersion";
import App from "./app/App.tsx";

function resolveThemeVersion(): DesignVersion {
  try {
    const s = localStorage.getItem("design_version");
    if (s === "v1" || s === "v2" || s === "v3" || s === "v4") return s;
  } catch {
    /* ignore */
  }
  return DESIGN_VERSION;
}

void import(`./themes/${resolveThemeVersion()}/tokens.css`);
import "./styles/index.css";

// createBrowserRouter (data router) is the recommended React Router v7 API.
// It provides the DataRouterContext that useNavigate/useLocation require.
const router = createBrowserRouter([{ path: "*", element: <App /> }]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
