import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import { ProtectedRoute, ProtectedRouteHome } from "./components/ProtectedRoute";
import UserProfile from "./pages/user/UserProfile";

export const router = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: "/sign-up", element: <ProtectedRoute element={<Register />} /> },
    { path: "/sign-in", element: <ProtectedRoute element={<Login />} /> },
    {
        path: "/user/profile",
        element: <ProtectedRouteHome element={<UserProfile />} />,
    },
    { path: '/all-videos', element: <div className="p-8 text-center"><h1 className="text-2xl">All Videos - Coming Soon</h1></div> }
]);