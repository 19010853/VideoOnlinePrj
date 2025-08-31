import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import { ProtectedRoute, ProtectedRouteHome } from "./components/ProtectedRoute";
import UserProfile from "./pages/user/UserProfile";
import ChangePassword from "./pages/auth/ChangePassword";
import ChangePasswordEmail from "./pages/auth/ChangePasswordEmail";
import UserUpload from "./pages/user/UserUpload";
import AllVideos from "./pages/AllVideos";
import SingleVideoPage from "./pages/SingleVideoPage";
import MyVideos from "./pages/user/MyVideos";
import UpdateVideo from "./pages/user/UpdateVideo";
import Dashboard from "./pages/user/Dashboard";

export const router = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: '/all-videos', element: <AllVideos /> },
    { path: "/video/:id", element: <SingleVideoPage /> },
    { path: "/sign-up", element: <ProtectedRoute element={<Register />} /> },
    { path: "/sign-in", element: <ProtectedRoute element={<Login />} /> },
    {
        path: "/user/profile",
        element: <ProtectedRouteHome element={<UserProfile />} />,
    },
    {
        path: "/change-password/:token",
        element: <ProtectedRoute element={<ChangePassword />} />
    },
    {
        path: "/send-email-for-change-password",
        element: <ProtectedRoute element={<ChangePasswordEmail />} />
    },
    {
        path: "/user/upload",
        element: <ProtectedRouteHome element={<UserUpload />} />
    },
    {
        path: "/user/edit/my-videos",
        element: <ProtectedRouteHome element={<MyVideos />} />
    },
    {
        path: "/user/edit/my-video/",
        element: <ProtectedRouteHome element={<UpdateVideo />} />
    },
    {
        path: "/user/dashboard",
        element: <ProtectedRouteHome element={<Dashboard />} />
    }
]);