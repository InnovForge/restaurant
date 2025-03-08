import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Star, Plus, Clock2 } from "lucide-react";
import LazyImage from "@/components/ui/lazy-image";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

import { useSearchParams } from "react-router";
import useCartStore from "@/stores/useCartStore";
import { fetchRestaurants } from "../api/search-query";
import useAddressStore from "@/stores/useAddressStore";
import { useQuery } from "@tanstack/react-query";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateAvatarInitial } from "@/utils/generateAvatarInitial";
const ListRestaurantSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addresses } = useAddressStore();
  const { addCart } = useCartStore();
  const searchQuery = searchParams.get("q");
  const distance = searchParams.get("distance") || 10;

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["search-restaurants", searchQuery, distance],
    queryFn: () =>
      fetchRestaurants({
        query: searchQuery,
        latitude: addresses[0]?.latitude,
        longitude: addresses[0]?.longitude,
        radius: distance * 1000,
      }),
    enabled: !!searchQuery,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (data?.data?.foods.length === 0 && data?.data?.restaurants.length === 0) {
    return <div className="text-red-500">Không tìm thấy kết quả</div>;
  }
  return (
    <div className="w-full">
      <div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
          {data?.data?.foods &&
            data.data?.foods.map((item) => (
              <Card className="overflow-hidden" key={item.foodId}>
                <Link to={`/restaurants/${item.restaurantId}`} key={item.foodId}>
                  <CardHeader className="p-0">
                    <AspectRatio ratio={4 / 3} className="w-full">
                      <LazyImage src={item.foodImage} alt={item.foodName} className="object-cover w-full h-full" />
                    </AspectRatio>
                  </CardHeader>

                  <CardContent className="p-2 pb-0">
                    <div>
                      <p className="text-sm">{item.foodName}</p>
                    </div>
                    <div className="w-full relative">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center justify-center gap-1">
                          <Star color="red" className="w-4 h-4" />
                          <span className="text-sm">{parseInt(item.averageRating)}</span>
                          <p className="text-sm">{item.totalReviews ? `(${item.totalReviews})+` : ""}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Link>
                <CardFooter className="p-2 pt-0">
                  <div className="flex flex-col justify-between items-start gap-1">
                    <div className="flex items-center w-full gap-2 text-muted-foreground">
                      <p className="text-xs">{item.distanceInfo.distance.toFixed()} m</p>
                      <div className="flex items-center gap-1">
                        <Clock2 className="w-4 h-4" />
                        <p className="text-xs">{item.distanceInfo.duration.toFixed()} phút</p>
                      </div>
                      {/* <p className="text-sm font-semibold">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.price)}
                      </p> */}
                    </div>
                  </div>
                  <Button
                    onClick={() => addCart(item)}
                    size="icon"
                    className="mt-auto ml-auto bg-primary rounded-full text-white"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>

        {data?.data?.restaurants.length > 0 && (
          <div className="pt-5">
            <h3 className="text-lg font-semibold">Nhà hàng</h3>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
              {data.data?.restaurants.map((restaurant) => (
                <Link to={`/restaurants/${restaurant.restaurantId}`} key={restaurant.restaurantId}>
                  <Card className="flex flex-row items-center hover:border-primary  p-2">
                    <CardHeader className="p-0">
                      <div className="flex gap-2">
                        <Avatar className="w-24 h-24">
                          <AvatarImage src={restaurant.restaurantLogo} />
                          <AvatarFallback>{generateAvatarInitial(restaurant.restaurantName)}</AvatarFallback>
                        </Avatar>
                      </div>
                    </CardHeader>
                    <CardContent className="">
                      <div className="flex flex-col">
                        <CardTitle>{restaurant.restaurantName}</CardTitle>
                        <CardDescription>{`${restaurant.addressLine1}, ${restaurant.addressLine2}`}</CardDescription>
                      </div>
                      <div className="flex items-center justify-start gap-1 w-full">
                        <Star color="red" className="w-4 h-4" />
                        <span className="text-sm">{parseInt(restaurant.averageRating)}</span>
                        <p className="text-sm">{restaurant.totalReviews ? `(${restaurant.totalReviews})+` : ""}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListRestaurantSearch;
