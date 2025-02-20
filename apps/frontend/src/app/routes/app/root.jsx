import { DashboardLayout } from "@/components/layouts";
import { api } from "@/lib/api-client";
import useAddressStore from "@/stores/useAddressStore";
import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router";
import useAuthUserStore from "@/stores/useAuthUserStore";
import Loading from "@/components/ui/loading";

export const ErrorBoundary = () => {
  return <div>Something went wrong!</div>;
};

const getCurrentLocation = () =>
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ latitude: coords.latitude, longitude: coords.longitude }),
      (error) => {
        reject(error);
      },
    );
  });

const getReverseGeocode = async () => {
  try {
    let lat = null;
    let lng = null;
    const location = await getCurrentLocation();
    if (location) {
      lat = location.latitude;
      lng = location.longitude;
      const response = await api.get(`/v1/geocode/reverse?latitude=${lat}&longitude=${lng}`);
      return response.data;
    }
  } catch (error) {
    if (error.code === 1) {
      const response = await api.get(`/v1/geocode/ip`);
      if (response) {
        return response.data;
      }
    }
    console.error("Error fetching locations:", error);
  }
};

const checkUser = async () => {
  try {
    const response = await api.get("/v1/user");
    return response.data;
  } catch (error) {
    return null;
  }
};
const AppRoot = () => {
  const { setAddress } = useAddressStore();
  const { setAuthUser, authUser } = useAuthUserStore();

  const { isFetching, isPending } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const user = await checkUser();
      if (!user || user?.data?.addresses.length === 0) {
        const geocode = await getReverseGeocode();
        setAddress(geocode.data);
      } else if (user?.data?.addresses.length > 0) {
        setAddress(user.data.addresses[0]);
      }

      if (user?.data) {
        setAuthUser(user.data);
        return user.data;
      }
      return null;
    },
    staleTime: Infinity,
    enabled: !authUser,
  });

  return isFetching ? (
    <Loading />
  ) : (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default AppRoot;
