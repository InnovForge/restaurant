import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router";
import useCartStore from "@/stores/useCartStore";
import useAddressStore from "@/stores/useAddressStore";
import { fetchRestaurants } from "../api/search-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Star, Plus, Clock2 } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import LazyImage from "@/components/ui/lazy-image";

const InfiniteListRestaurantSearch = () => {
  const [searchParams] = useSearchParams();
  const { addresses } = useAddressStore();
  const { addCart } = useCartStore();
  const searchQuery = searchParams.get("q");
  const distance = searchParams.get("distance") || 10;

  const queryKey = [searchQuery, distance, addresses[0]?.latitude, addresses[0]?.longitude];

  const {
    data: dataPage,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["restaurants-fetch-next", ...queryKey],
    queryFn: ({ pageParam = 1 }) =>
      fetchRestaurants({
        query: searchQuery,
        latitude: addresses[0]?.latitude,
        longitude: addresses[0]?.longitude,
        radius: distance * 1000,
        page: pageParam,
        type: "foods",
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage?.data?.foods?.length > 0) {
        return pages.length + 1;
      } else {
        return undefined;
      }
    },
  });

  const [data, setData] = useState([]);

  const resetScroll = useCallback(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (dataPage?.pages) {
      const newFoods = dataPage.pages.flatMap((page) => page.data.foods);
      setData((prevData) => [...prevData, ...newFoods]);
    }
  }, [dataPage]);

  useEffect(() => {
    setData([]);
    refetch();
    resetScroll();
  }, [searchQuery, distance, refetch, resetScroll]);

  return (
    <div className="w-full pt-4">
      <InfiniteScroll
        dataLength={data.length}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={<div>Loading...</div>}
        endMessage={<div>No more restaurants to load</div>}
        scrollThreshold={0.8} // Triggers when the user is 90% of the way down
      >
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
          {data?.map((item) => (
            <Card className="overflow-hidden" key={item.foodId}>
              <Link to={`/restaurants/${item.restaurantId}`}>
                <CardHeader className="p-0">
                  <AspectRatio ratio={4 / 3} className="w-full">
                    <LazyImage src={item.foodImage} alt={item.foodName} className="object-cover w-full h-full" />
                  </AspectRatio>
                </CardHeader>
                <CardContent className="p-2 pb-0">
                  <p className="text-sm">{item.foodName}</p>
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
      </InfiniteScroll>

      {error && <div>Lỗi: {error.message}</div>}
    </div>
  );
};

export default InfiniteListRestaurantSearch;
