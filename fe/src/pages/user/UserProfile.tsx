import type React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectLoggedIn, updateUserDetails } from "../../store/slices/authSlice";
import { useEffect, useState } from "react";
import SideBar from "../../components/Sidebar";
import { useConfig } from "../../hooks/useConfig";
import toast from "react-hot-toast";
import apiServer from "../../api/apiServer";
import type { IAuthResponse } from "../../store/slices/authSlice";

const UserProfile: React.FC = () => {
    const loggedIn = useSelector(selectLoggedIn);
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [edit, setEdit] = useState<boolean>(false);
    const dispatch = useDispatch();
    const { configUsingToken } = useConfig();


    useEffect(() => {
        if (loggedIn?.name) {
            setName(loggedIn.name);
        }
        if (loggedIn?.email) {
            setEmail(loggedIn.email);
        }
    }, [loggedIn]);

    const handleEdit = () => {
        setEdit((edit) => !edit);
    }

    const handleSave = async () => {
        try {
            const { data } = await apiServer.post<IAuthResponse>(
                "/api/v1/user/update", { name, email }, configUsingToken
            );

            if (data.success) {
                toast.success(data.message);
                dispatch(updateUserDetails({ name, email }));
                setEdit(false);
            } else {
                toast.error(data.message);
            }
        } catch (error: any) {
            toast.error("Internal server error");
        }
    }

    return (
        <div className="flex w-full pr-2 h-screen">
            <SideBar />
            <main className="flex-1 ml-4 lg:ml-[17rem] pr-2 z-10">
                <section className="p-4 bg-white shadow-lg rounded-lg w-full border border-gray-500 mt-7">
                    <h1 className="text-center font-semibold text-xl text-gray-700 mb-5">
                        Personal Details
                    </h1>
                    <div className="container flex flex-col gap-4">
                        <div className="flex items-center">
                            <div className="flex flex-col w-full">
                                <label htmlFor="name" className="font-medium text-gray-600">
                                    Name
                                </label>
                                <div className="relative">
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className={`w-full p-3 focus:outline-none border rounded-md ${edit ? "border-blue-500" : "border-gray-300"
                                            } focus:ring-2 focus:ring-blue-500 bg-gray-100`}
                                        disabled={!edit}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="flex flex-col w-full">
                                <label htmlFor="email" className="font-medium text-gray-600">
                                    Email
                                </label>
                                <div className="relative">
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`w-full p-3 focus:outline-none border rounded-md ${edit ? "border-blue-500" : "border-gray-300"
                                            } focus:ring-2 focus:ring-blue-500 bg-gray-100`}
                                        disabled={!edit}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="bg-blue-500 text-white py-2 px-4 rounded-md focus:outline-none hover:bg-blue-600"
                                onClick={edit ? handleSave : handleEdit}
                            >
                                {edit ? "Save" : "Edit"}
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default UserProfile;