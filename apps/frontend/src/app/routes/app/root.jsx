import { DashboardLayout } from "@/components/layouts";
import { api } from "@/lib/api-client";
import useAddressStore from "@/stores/useAddressStore";
import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router";

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

const AppRoot = () => {
  const { setAddress } = useAddressStore();
  const { isPending, isFetching } = useQuery({
    queryKey: ["address"],
    queryFn: async () => {
      const data = await getReverseGeocode();
      // console.log("data", data);
      setAddress(data.data);
      return data;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return isPending || isFetching ? (
    <div>Loading...</div>
  ) : (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default AppRoot;
