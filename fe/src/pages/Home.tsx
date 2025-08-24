import React from "react";
import Layout from "../components/Layout";
import { useAppSelector } from "../store";

const Home: React.FC = () => {
    const { loggedIn } = useAppSelector((state) => state.auth);

    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-6">
                        Welcome to Video Hub
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Your ultimate destination for video content
                    </p>

                    {loggedIn ? (
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                Welcome back, {loggedIn.email}!
                            </h2>
                            <p className="text-gray-600 mb-6">
                                You are now logged in and can access all features.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-blue-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Browse Videos</h3>
                                    <p className="text-blue-600">Explore our collection of videos</p>
                                </div>
                                <div className="bg-green-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-green-800 mb-2">Upload Content</h3>
                                    <p className="text-green-600">Share your videos with the community</p>
                                </div>
                                <div className="bg-purple-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-purple-800 mb-2">Create Playlists</h3>
                                    <p className="text-purple-600">Organize your favorite videos</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                Get Started Today
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Join our community to access exclusive video content and features.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="/sign-up"
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Sign Up
                                </a>
                                <a
                                    href="/sign-in"
                                    className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                                >
                                    Sign In
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Home;
