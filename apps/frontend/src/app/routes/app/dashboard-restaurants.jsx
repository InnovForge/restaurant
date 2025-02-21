import { api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

const DashboardRestaurants = () => {
  const {
    data: restaurants,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["restaurants-mine"],
    queryFn: async () => {
      const response = await api.get("/v1/restaurant/mine");
      if (response) {
        return response.data;
      }
    },
  });
  // console.log(data?.data);

  return isLoading ? (
    <p>Loading...</p>
  ) : (
    <div className="flex flex-col gap-3">
      {restaurants?.data.length > 0 ? (
        restaurants?.data.map((restaurant) => (
          <Link to={restaurant.restaurantId} key={restaurant.restaurantId}>
            <h1>{restaurant.restaurantName}</h1>
            <p>{restaurant.description}</p>
          </Link>
        ))
      ) : (
        <p>You do not own any restaurants.</p>
      )}
    </div>
  );
};

export default DashboardRestaurants;
