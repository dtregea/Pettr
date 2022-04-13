import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("http://localhost:5000/api/refresh", {
      withCredentials: true, // sends cookie with token
    });
    setAuth((prev) => {
      return {
        ...prev,
        accessToken: response.data.accessToken,
        userId: response.data.userId,
      };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
