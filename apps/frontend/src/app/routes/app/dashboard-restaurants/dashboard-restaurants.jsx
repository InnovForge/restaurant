import Loading from "@/components/ui/loading";
import { useUserRestaurants } from "@/hooks/use-user-restaurants";
import RestaurantList from "@/features/restaurants/components/restaurants-list";
import SearchRestaurants from "@/features/restaurants/components/search-restaurants";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useState } from "react";
import { Plus } from "lucide-react";

const DashboardRestaurants = () => {
  const { isLoading, error } = useUserRestaurants();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name");

  return isLoading ? (
    <Loading />
  ) : (
    <div className="flex flex-col gap-5 min-h-screen">
      <div className="flex flex-row justify-between md:items-center items-start gap-10 w-full">
        <SearchRestaurants
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />
        <Link to="create">
          <Button className="hidden md:block">Đăng kí nhà hàng</Button>
          <Button className="md:hidden flex items-center" size="icon">
            <Plus />
          </Button>
        </Link>
      </div>
      <RestaurantList searchTerm={searchTerm} sortOption={sortOption} />
    </div>
  );
};

export default DashboardRestaurants;
