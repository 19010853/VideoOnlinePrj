import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import apiServer from "../../api/apiServer";
import Layout from "../../components/Layout";

interface IChangePasswordEmailResponse {
    success: boolean;
    message: string;
}

const ChangePasswordEmail: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await apiServer.post<IChangePasswordEmailResponse>("/api/v1/auth/send-email-for-change-password", { email });

            if (data.success) {
                toast.success(data.message);
                setEmail("");
                navigate("/sign-in");
            }
        } catch (error: any) {
            toast.error("Please try again later");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Layout>
            <div className="p-4">
                <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Change Password</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                required
                                placeholder="Enter your email"
                                value={email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <svg
                                        className="animate-spin mr-2 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                                        ></path>
                                    </svg>
                                    Sending...
                                </>
                            ) : (
                                "Reset Password"
                            )}
                        </button>
                        <div className="text-center mt-4">
                            <span className="text-sm text-gray-600">Not a member yet?</span>{" "}
                            <Link
                                to="/sign-up"
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Sign up for free
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default ChangePasswordEmail;