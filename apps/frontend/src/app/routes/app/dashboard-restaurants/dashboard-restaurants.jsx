import Loading from "@/components/ui/loading";
import { useUserRestaurants } from "@/hooks/use-user-restaurants";
import RestaurantList from "@/features/restaurants/components/restaurants-list";
import SearchRestaurants from "@/features/restaurants/components/search-restaurants";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const DashboardRestaurants = () => {
  const { isLoading, error } = useUserRestaurants();

  return isLoading ? (
    <Loading />
  ) : (
    <div className="flex flex-col gap-5 min-h-screen">
      <div className="flex flex-row justify-between items-center gap-10 w-full">
        <SearchRestaurants />
        <Link to="create">
          <Button>Đăng kí nhà hàng</Button>
        </Link>
      </div>
      <RestaurantList />
    </div>
  );
};

export default DashboardRestaurants;
