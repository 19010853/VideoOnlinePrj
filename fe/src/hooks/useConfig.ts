export const useConfig = () => {
    const token = localStorage.getItem("token");
    const configUsingToken = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    }
    return { configUsingToken };
}