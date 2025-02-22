import { Navigate } from "react-router";
import useAuthUserStore from "@/stores/useAuthUserStore";
import { api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import Loading from "./ui/loading";

const checkUser = async () => {
  try {
    const response = await api.get("/v1/user");
    return response.data;
  } catch (error) {
    return null;
  }
};

export const ProtectedAdmin = ({ children }) => {
  const { authUser, setAuthUser } = useAuthUserStore();
  const { isFetching, isPending } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const user = await checkUser();
      if (user?.data) {
        setAuthUser(user.data);
        return user.data;
      }
      return null;
    },
    staleTime: Infinity,
    enabled: !authUser,
  });

  if (isPending || isFetching) {
    return <Loading />;
  }

  if (!authUser) {
    return <Navigate to={"/login"} replace />;
  }

  return children;
};
