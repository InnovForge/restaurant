import { useUserRestaurants } from "@/hooks/use-user-restaurants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRoundCog } from "lucide-react";
import { generateAvatarInitial } from "@/utils/generateAvatarInitial";
import { Link } from "react-router";

const RestaurantList = () => {
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

  return (
    <div className="grid grid-cols-1 gap-4 max-w-md">
      {restaurants.map((restaurant) => (
        <Link to={`${restaurant.restaurantId}`} key={restaurant.restaurantId}>
          <Card>
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
            <CardContent>
              <div className="flex gap-2 items-center">
                <UserRoundCog />
                <p>{restaurant.role}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default RestaurantList;
