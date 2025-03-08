import { useUserRestaurants } from "@/hooks/use-user-restaurants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRoundCog } from "lucide-react";
import { generateAvatarInitial } from "@/utils/generateAvatarInitial";
import { Link } from "react-router";
import { formatDate } from "@/utils/format-date";

const roleMap = {
  owner: "Chủ nhà hàng",
  manager: "Quản lý",
  staff: "Nhân viên",
};

const RestaurantList = ({ searchTerm, sortOption }) => {
  const { restaurants, isLoading, error } = useUserRestaurants();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Failed to load restaurants. Please try again later.</p>;
  }

  if (!restaurants || restaurants.length === 0) {
    return <p>You do not own any restaurants.</p>;
  }

  const filteredRestaurants = restaurants
    .filter((restaurant) => {
      const nameMatch =
        restaurant.restaurantName && restaurant.restaurantName.toLowerCase().includes((searchTerm || "").toLowerCase());

      const addressMatch = ((restaurant.addressLine1 || "") + " " + (restaurant.addressLine2 || ""))
        .toLowerCase()
        .includes((searchTerm || "").toLowerCase());

      return nameMatch || addressMatch;
    })
    .sort((a, b) => {
      if (sortOption === "name") {
        // Sắp xếp theo tên (A-Z)
        const nameA = a.restaurantName.toLowerCase();
        const nameB = b.restaurantName.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      }

      if (sortOption === "date") {
        // Sắp xếp theo ngày tạo (mới nhất trước)
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      return 0;
    });

  return (
    <div>
      {filteredRestaurants.length === 0 ? (
        <p>Không tìm thấy nhà hàng nào cả</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRestaurants.map((restaurant) => (
            <Link to={`${restaurant.restaurantId}`} key={restaurant.restaurantId}>
              <Card className="h-full flex flex-col hover:border-primary border border-transparent ">
                <CardHeader>
                  <div className="flex gap-2">
                    <Avatar>
                      <AvatarImage src={restaurant.logoUrl} />
                      <AvatarFallback>{generateAvatarInitial(restaurant.restaurantName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <CardTitle>{restaurant.restaurantName}</CardTitle>
                      <CardDescription>{`${restaurant.addressLine1}, ${restaurant.addressLine2}`}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="mt-auto">
                  <div className="flex gap-2 items-center justify-between">
                    <div className="flex gap-2 items-center">
                      <UserRoundCog />
                      <p>{roleMap[restaurant.role]}</p>
                    </div>
                    <div className="text-muted-foreground flex gap-2 items-center">
                      <span className=" text-sm">Ngày tạo</span>
                      <p className="text-sm">{formatDate(restaurant.createdAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantList;
