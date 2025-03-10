import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import useAddressStore from "@/stores/useAddressStore";
import { useState } from "react";
import useCartStore from "@/stores/useCartStore";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Star, Plus, Clock2, Flame } from "lucide-react";
import LazyImage from "@/components/ui/lazy-image";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

const Show = () => {
  const fetchFoods = async ({ pageParam = 1 }) => {
    const response = await api.get("/v1/foods", {
      params: {
        latitude: addresses[0].latitude,
        longitude: addresses[0].longitude,
        radius: 20000,
        page: pageParam,
        filter: "nearby",
      },
    });
    return response.data.data;
  };

  const {
    data: dataa,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["get-foods"],
    queryFn: fetchFoods,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined; // Tăng page nếu có dữ liệu
    },
    staleTime: 1000 * 60 * 1, // 1 phút
  });

  const { Cart, addCart } = useCartStore();

  const { addresses } = useAddressStore();
  // const { f, sF } = useState();
  const { data, isFetching } = useQuery({
    queryKey: ["get-food"],
    queryFn: async () => {
      const f = await api.get("/v1/foods", {
        params: {
          latitude: addresses[0].latitude,
          longitude: addresses[0].longitude,
          radius: 20000,
          // page: 1,
          // filter: nearby
        },
      });
      // sF(f.data)
      return f.data.data;
    },
    staleTime: 1000 * 60 * 1, // 5 minutes
  });

  const { data: dataRestaurant, isFetching: isFetchingRestaurant } = useQuery({
    queryKey: ["get-restaurant"],
    queryFn: async () => {
      const f = await api.get("v1/restaurants", {
        params: {
          latitude: addresses[0].latitude,
          longitude: addresses[0].longitude,
          radius: 20000,
          // page: 1,
          // filter: nearby
        },
      });
      // sF(f.data)
      return f.data.data;
    },
    staleTime: 1000 * 60 * 1, // 5 minutes
  });

  // if (isFetching && !data) return <Loading />
  // console.log("data", f && f);

  const add = (item) => {
    addCart(item);
    console.log(Cart);
  };

  // const { addToCart } = useCart();
  const foods = dataa?.pages.flat() || [];

  const [visibleProducts, setVisibleProducts] = useState(6);

  // NOTE: state này gây lỗi cuộn
  //
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 10) {
        if (visibleProducts < foods.length) {
          setVisibleProducts((prev) => Math.min(prev + 3, foods.length));
        }
        // Nếu đã hiển thị hết dữ liệu và còn trang mới, gọi API lấy dữ liệu tiếp theo
        else if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleProducts, foods.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // const foods = dataa?.pages.flat() || [];

  // if (isFetching && !data) return <Loading />

  return (
    <>
      {data && (
        <div>
          <div className="flex items-center gap-1 p-4 pl-0">
            <Flame className="text-red-500" />
            <h2 className="text-xl font-bold">Món ăn gần đây</h2>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
            {data.map((item) => (
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
                      <p className="text-xs">{item.distanceInfo.distance.toFixed()} km</p>
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
        </div>
      )}

      {data && (
        <div>
          <div className="flex items-center gap-1 p-4 pl-0">
            <Flame className="text-red-500" />
            <h2 className="text-xl font-bold">Nhà hàng gần đây</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6">
            {dataRestaurant.map((restaurant) => (
              <Link to={`/restaurants/${restaurant.restaurantId}`} key={restaurant.restaurantId}>
                <Card key={restaurant.restaurantId} className="overflow-hidden shadow-lg">
                  <img
                    src={restaurant.restaurantCover}
                    alt={restaurant.restaurantName}
                    className="w-full h-40 object-cover"
                  />
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <img src={restaurant.restaurantLogo} alt="Logo" className="w-10 h-10 rounded-full" />
                      <h3 className="font-semibold text-lg">{restaurant.restaurantName}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{restaurant.restaurantDescription}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="ml-1">{restaurant.averageRating}</span>
                      </div>
                      <div className="flex items-center">
                        {/* <MapPin className="w-4 h-4 text-red-500" /> */}
                        <span className="ml-1">{restaurant.distance}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {data && (
        <div>
          <div className="flex items-center gap-1 p-4 pl-0">
            <Flame className="text-red-500" />
            <h2 className="text-xl font-bold">Món ăn phổ biến gần đây</h2>
          </div>
          {/* <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
        <div className="w-full max-w-5xl"> */}
          {foods.slice(0, visibleProducts).map((item) => (
            <div
              key={item.foodId}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 w-full mb-6 flex"
            >
              <div className="w-1/3 h-[300px]">
                <img src={item.foodImage} alt={item.foodName} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 w-2/3">
                <Link to={`/restaurants/${item.restaurantId}`} key={item.foodId}>
                  <div className="flex items-center mb-4">
                    <img src={item.restaurantLogo} alt={item.restaurantName} className="w-10 h-10 rounded-full mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold">{item.restaurantName}</h3>
                      <p className="text-sm text-gray-500">
                        {item.addressLine1 && item.addressLine2
                          ? `${item.addressLine1}, ${item.addressLine2}`
                          : item.addressLine1 || item.addressLine2}
                      </p>
                      <div className="flex items-center w-full gap-2 text-muted-foreground">
                        <p className="text-xs">{item.distanceInfo.distance.toFixed()} km</p>
                        <div className="flex items-center gap-1">
                          <Clock2 className="w-4 h-4" />
                          <p className="text-xs">{item.distanceInfo.duration.toFixed()} phút</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
                <h2 className="text-xl font-bold truncate w-full">{item.foodName}</h2>
                <div className="flex items-center text-sm text-gray-600 mt-2">
                  <Star className="text-yellow-500" size={24} />
                  <p className="ml-2 text-lg">5 ({item.totalReviews}+ reviews)</p>
                </div>
                {/* <p className="text-red-500 font-semibold mt-4 text-2xl">{item.price} VND</p> */}
                <p className="text-red-500 font-semibold mt-4 text-2xl">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(item.price)}
                </p>
                <button
                  onClick={() => addCart(item)}
                  className="mt-4 px-6 py-2 w-full bg-green-500 text-white rounded-lg hover:bg-black-600 transition text-lg"
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* </div>
      </div> */}
    </>
  );

  // return (
  //   <>
  //     <div>
  //       <div className="flex p-4">
  //         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  //           <path
  //             d="M8.5 14.5C9.16304 14.5 9.79893 14.2366 10.2678 13.7678C10.7366 13.2989 11 12.663 11 12C11 10.62 10.5 10 10 9C8.928 6.857 9.776 4.946 12 3C12.5 5.5 14 7.9 16 9.5C18 11.1 19 13 19 15C19 15.9193 18.8189 16.8295 18.4672 17.6788C18.1154 18.5281 17.5998 19.2997 16.9497 19.9498C16.2997 20.5998 15.5281 21.1154 14.6788 21.4672C13.8295 21.8189 12.9193 22 12 22C11.0807 22 10.1705 21.8189 9.32122 21.4672C8.47194 21.1154 7.70026 20.5998 7.05025 19.9498C6.40024 19.2997 5.88463 18.5281 5.53284 17.6788C5.18106 16.8295 5 15.9193 5 15C5 13.847 5.433 12.706 6 12C6 12.663 6.26339 13.2989 6.73223 13.7678C7.20107 14.2366 7.83696 14.5 8.5 14.5Z"
  //             stroke="#FC0C10"
  //             strokeWidth="2"
  //             strokeLinecap="round"
  //             strokeLinejoin="round"
  //           />
  //         </svg>
  //         <h1>Món ăn phổ biến</h1>
  //         <a href="#" className="ml-auto underline">
  //           Xem thêm
  //         </a>
  //       </div>
  //
  //       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  //         {data &&
  //           (() => {
  //             // Chọn ngẫu nhiên 4 nhà hàng từ data[]
  //             const randomRestaurants = [...data].sort(() => 0.5 - Math.random()).slice(0, 4);
  //
  //             // Lấy danh sách top 2 món ăn từ mỗi nhà hàng
  //             const topFoods = randomRestaurants.flatMap((restaurant) =>
  //               [...restaurant.foods].sort((a, b) => b.rating - a.rating).slice(0, 2),
  //             );
  //
  //             return topFoods.map((item) => (
  //               <div
  //                 className="bg-blue-200 p-4 rounded-[13px] flex flex-col justify-between h-full"
  //                 key={item.foodId + Math.random()}
  //               >
  //                 <div className="flex justify-center">
  //                   <img src={item.imageUrl} className="h-[191px]" alt="img" />
  //                 </div>
  //                 <div>
  //                   <div className="flex justify-between">
  //                     <h1 className="w-[150px] truncate font-bold">{item.name}</h1>
  //                     <div className="flex items-center justify-end">
  //                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  //                         <path
  //                           d="M11.5251 2.29502C11.5689 2.20648 11.6366 2.13195 11.7205 2.07984C11.8045 2.02773 11.9013 2.00012 12.0001 2.00012C12.0989 2.00012 12.1957 2.02773 12.2796 2.07984C12.3636 2.13195 12.4313 2.20648 12.4751 2.29502L14.7851 6.97402C14.9373 7.28198 15.1619 7.54842 15.4397 7.75047C15.7175 7.95251 16.0402 8.08413 16.3801 8.13402L21.5461 8.89002C21.644 8.9042 21.7359 8.94549 21.8116 9.00921C21.8872 9.07294 21.9435 9.15656 21.9741 9.25062C22.0047 9.34468 22.0084 9.44542 21.9847 9.54145C21.961 9.63748 21.9109 9.72497 21.8401 9.79402L18.1041 13.432C17.8577 13.6721 17.6734 13.9685 17.5669 14.2956C17.4605 14.6228 17.4352 14.9709 17.4931 15.31L18.3751 20.45C18.3924 20.5479 18.3818 20.6486 18.3446 20.7407C18.3074 20.8328 18.245 20.9126 18.1646 20.971C18.0842 21.0294 17.9891 21.064 17.89 21.0709C17.7908 21.0778 17.6918 21.0567 17.6041 21.01L12.9861 18.582C12.6818 18.4222 12.3433 18.3388 11.9996 18.3388C11.6559 18.3388 11.3174 18.4222 11.0131 18.582L6.39609 21.01C6.30842 21.0564 6.20949 21.0773 6.11054 21.0703C6.0116 21.0632 5.91661 21.0286 5.83639 20.9702C5.75616 20.9119 5.69392 20.8322 5.65675 20.7402C5.61957 20.6483 5.60895 20.5477 5.62609 20.45L6.50709 15.311C6.56529 14.9717 6.54007 14.6234 6.43363 14.2961C6.32718 13.9687 6.1427 13.6722 5.89609 13.432L2.16009 9.79502C2.08868 9.72605 2.03808 9.63841 2.01405 9.54209C1.99002 9.44577 1.99353 9.34463 2.02417 9.25021C2.05481 9.15578 2.11136 9.07186 2.18737 9.008C2.26338 8.94414 2.35579 8.90291 2.45409 8.88902L7.61909 8.13402C7.95935 8.08451 8.28248 7.95307 8.56067 7.751C8.83887 7.54893 9.06379 7.28229 9.21609 6.97402L11.5251 2.29502Z"
  //                           stroke="#FC0C10"
  //                           strokeWidth="2"
  //                           strokeLinecap="round"
  //                           strokeLinejoin="round"
  //                         />
  //                       </svg>
  //                       <p>{item.totalReviews}+</p>
  //                     </div>
  //                   </div>
  //                   <p>{item.description}</p>
  //                 </div>
  //                 {/* <div className=" bottom-4 right-4"> */}
  //                 <button className="bg-red-500 text-white px-4 py-2 rounded-md mt-2" onClick={() => add(item)}>
  //                   Thêm vào giỏ hàng
  //                 </button>
  //                 {/* </div> */}
  //               </div>
  //             ));
  //           })()}
  //       </div>
  //     </div>
  //
  //     <div>
  //       <div className="flex p-4">
  //         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  //           <path
  //             d="M8.5 14.5C9.16304 14.5 9.79893 14.2366 10.2678 13.7678C10.7366 13.2989 11 12.663 11 12C11 10.62 10.5 10 10 9C8.928 6.857 9.776 4.946 12 3C12.5 5.5 14 7.9 16 9.5C18 11.1 19 13 19 15C19 15.9193 18.8189 16.8295 18.4672 17.6788C18.1154 18.5281 17.5998 19.2997 16.9497 19.9498C16.2997 20.5998 15.5281 21.1154 14.6788 21.4672C13.8295 21.8189 12.9193 22 12 22C11.0807 22 10.1705 21.8189 9.32122 21.4672C8.47194 21.1154 7.70026 20.5998 7.05025 19.9498C6.40024 19.2997 5.88463 18.5281 5.53284 17.6788C5.18106 16.8295 5 15.9193 5 15C5 13.847 5.433 12.706 6 12C6 12.663 6.26339 13.2989 6.73223 13.7678C7.20107 14.2366 7.83696 14.5 8.5 14.5Z"
  //             stroke="#FC0C10"
  //             strokeWidth="2"
  //             strokeLinecap="round"
  //             strokeLinejoin="round"
  //           />
  //         </svg>
  //         <h1>Nhà hàng phổ biến</h1>
  //         <a href="#" className="ml-auto underline">
  //           Xem thêm
  //         </a>
  //       </div>
  //
  //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
  //         {data &&
  //           (() => {
  //             const randomRestaurants = [...data].sort(() => 0.5 - Math.random()).slice(0, 6);
  //
  //             return randomRestaurants.map((item) => (
  //               <div className="gird bg-blue-200 p-4 rounded-[13px]" key={item.restaurantId + Math.random()}>
  //                 <div className="flex justify-center">
  //                   <img src={item.restaurantLogo} className="h-[191px]" alt="logo" />
  //                 </div>
  //                 <div className="">
  //                   <div className="flex justify-between">
  //                     <h1 className="w-[220px] truncate font-bold">{item.restaurantName}</h1>
  //                     <div className="flex items-center justify-end">
  //                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  //                         <path
  //                           d="M11.5251 2.29502C11.5689 2.20648 11.6366 2.13195 11.7205 2.07984C11.8045 2.02773 11.9013 2.00012 12.0001 2.00012C12.0989 2.00012 12.1957 2.02773 12.2796 2.07984C12.3636 2.13195 12.4313 2.20648 12.4751 2.29502L14.7851 6.97402C14.9373 7.28198 15.1619 7.54842 15.4397 7.75047C15.7175 7.95251 16.0402 8.08413 16.3801 8.13402L21.5461 8.89002C21.644 8.9042 21.7359 8.94549 21.8116 9.00921C21.8872 9.07294 21.9435 9.15656 21.9741 9.25062C22.0047 9.34468 22.0084 9.44542 21.9847 9.54145C21.961 9.63748 21.9109 9.72497 21.8401 9.79402L18.1041 13.432C17.8577 13.6721 17.6734 13.9685 17.5669 14.2956C17.4605 14.6228 17.4352 14.9709 17.4931 15.31L18.3751 20.45C18.3924 20.5479 18.3818 20.6486 18.3446 20.7407C18.3074 20.8328 18.245 20.9126 18.1646 20.971C18.0842 21.0294 17.9891 21.064 17.89 21.0709C17.7908 21.0778 17.6918 21.0567 17.6041 21.01L12.9861 18.582C12.6818 18.4222 12.3433 18.3388 11.9996 18.3388C11.6559 18.3388 11.3174 18.4222 11.0131 18.582L6.39609 21.01C6.30842 21.0564 6.20949 21.0773 6.11054 21.0703C6.0116 21.0632 5.91661 21.0286 5.83639 20.9702C5.75616 20.9119 5.69392 20.8322 5.65675 20.7402C5.61957 20.6483 5.60895 20.5477 5.62609 20.45L6.50709 15.311C6.56529 14.9717 6.54007 14.6234 6.43363 14.2961C6.32718 13.9687 6.1427 13.6722 5.89609 13.432L2.16009 9.79502C2.08868 9.72605 2.03808 9.63841 2.01405 9.54209C1.99002 9.44577 1.99353 9.34463 2.02417 9.25021C2.05481 9.15578 2.11136 9.07186 2.18737 9.008C2.26338 8.94414 2.35579 8.90291 2.45409 8.88902L7.61909 8.13402C7.95935 8.08451 8.28248 7.95307 8.56067 7.751C8.83887 7.54893 9.06379 7.28229 9.21609 6.97402L11.5251 2.29502Z"
  //                           stroke="#FC0C10"
  //                           strokeWidth="2"
  //                           strokeLinecap="round"
  //                           strokeLinejoin="round"
  //                         />
  //                       </svg>
  //                       <p>5 {item.addressLine1}+</p>
  //                     </div>
  //                   </div>
  //                 </div>
  //               </div>
  //             ));
  //           })()}
  //       </div>
  //     </div>
  //     {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"> */}
  //
  //     {data &&
  //       (() => {
  //         const allFoods = data.flatMap((restaurant) => restaurant.foods);
  //
  //         // slice(0, visibleProducts).
  //         return allFoods.map((item) => (
  //           <div className="bg-blue-200 p-4 mt-4" key={item.foodId + Math.random()}>
  //             <div className="flex ">
  //               <div className="flex justify-center w-[266px] h-[191px]">
  //                 <img src={item.imageUrl} className="h-[191px]" alt="logo" />
  //               </div>
  //               <div>
  //                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
  //                   <div>
  //                     <h1 className="w-[300px] truncate font-bold">{item.name}</h1>
  //                   </div>
  //
  //                   <div className="flex items-center ">
  //                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  //                       <path
  //                         d="M11.5251 2.29502C11.5689 2.20648 11.6366 2.13195 11.7205 2.07984C11.8045 2.02773 11.9013 2.00012 12.0001 2.00012C12.0989 2.00012 12.1957 2.02773 12.2796 2.07984C12.3636 2.13195 12.4313 2.20648 12.4751 2.29502L14.7851 6.97402C14.9373 7.28198 15.1619 7.54842 15.4397 7.75047C15.7175 7.95251 16.0402 8.08413 16.3801 8.13402L21.5461 8.89002C21.644 8.9042 21.7359 8.94549 21.8116 9.00921C21.8872 9.07294 21.9435 9.15656 21.9741 9.25062C22.0047 9.34468 22.0084 9.44542 21.9847 9.54145C21.961 9.63748 21.9109 9.72497 21.8401 9.79402L18.1041 13.432C17.8577 13.6721 17.6734 13.9685 17.5669 14.2956C17.4605 14.6228 17.4352 14.9709 17.4931 15.31L18.3751 20.45C18.3924 20.5479 18.3818 20.6486 18.3446 20.7407C18.3074 20.8328 18.245 20.9126 18.1646 20.971C18.0842 21.0294 17.9891 21.064 17.89 21.0709C17.7908 21.0778 17.6918 21.0567 17.6041 21.01L12.9861 18.582C12.6818 18.4222 12.3433 18.3388 11.9996 18.3388C11.6559 18.3388 11.3174 18.4222 11.0131 18.582L6.39609 21.01C6.30842 21.0564 6.20949 21.0773 6.11054 21.0703C6.0116 21.0632 5.91661 21.0286 5.83639 20.9702C5.75616 20.9119 5.69392 20.8322 5.65675 20.7402C5.61957 20.6483 5.60895 20.5477 5.62609 20.45L6.50709 15.311C6.56529 14.9717 6.54007 14.6234 6.43363 14.2961C6.32718 13.9687 6.1427 13.6722 5.89609 13.432L2.16009 9.79502C2.08868 9.72605 2.03808 9.63841 2.01405 9.54209C1.99002 9.44577 1.99353 9.34463 2.02417 9.25021C2.05481 9.15578 2.11136 9.07186 2.18737 9.008C2.26338 8.94414 2.35579 8.90291 2.45409 8.88902L7.61909 8.13402C7.95935 8.08451 8.28248 7.95307 8.56067 7.751C8.83887 7.54893 9.06379 7.28229 9.21609 6.97402L11.5251 2.29502Z"
  //                         stroke="#FC0C10"
  //                         strokeWidth="2"
  //                         strokeLinecap="round"
  //                         strokeLinejoin="round"
  //                       />
  //                     </svg>
  //                     <p>5 {item.price}+</p>
  //                   </div>
  //                 </div>
  //                 <h1 className="mt-[120px]">{item.description}</h1>
  //               </div>
  //             </div>
  //           </div>
  //         ));
  //       })()}
  //     {/* </div> */}
  //     {/* {data[1]?.foods?.slice(0, visibleProducts).map((item) => (
  //       <div key={item.foodId} className="p-4 border rounded-lg shadow-md">
  //         {item.name}
  //       </div>
  //     ))} */}
  //
  //     {/* <div className="p-4">
  //       <h2 className="text-xl font-bold mb-4">Danh sách sản phẩm</h2>
  //       <div className="grid grid-cols-3 gap-4">
  //         {data &&
  //           (() => {
  //             const allFoods = data.flatMap((restaurant) => restaurant.foods);
  //
  //             return allFoods.slice(0, visibleProducts).map((item) => (
  //               <div key={item.foodId} className="p-4 border rounded-lg shadow-md">
  //                 {item.name}
  //               </div>
  //             ))
  //           }
  //           )()
  //         }
  //       </div>
  //     </div> */}
  //
  //     {/* <div className="p-4">
  //       <h2 className="text-xl font-bold mb-4">Danh sách sản phẩm</h2>
  //       <div className="grid grid-cols-3 gap-4">
  //         {products.slice(0, visibleProducts).map((product) => (
  //           <div key={product.id} className="p-4 border rounded-lg shadow-md">
  //             {product.name}
  //           </div>
  //         ))}
  //       </div>
  //     </div> */}
  //   </>
  // );
};

export default Show;
