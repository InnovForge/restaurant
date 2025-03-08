import { useMemo } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { default as AppRoot, ErrorBoundary as AppRootErrorBoundary } from "./routes/app/root";

import Overview from "./routes/admin/overview/page";
import MenuPage from "./routes/admin/menu/page";
import AddFood from "./routes/admin/menu/addfood";
import OrdersPage from "./routes/admin/orders/page";
import OrderDetail from "./routes/admin/orders/detail";
import TableManagement from "./routes/admin/table/table";
import RestaurantInfoForm from "./routes/admin/infor/res/infor";
import RestaurantUpdateInfoForm from "./routes/admin/infor/res/infor_update";
import HomeAdmin from "./routes/admin/dashboard-restaurants";
import { ProtectedApp } from "@/components/protected-app";
import { RestaurantProvider } from "@/context/restaurant";
import { ProtectedAdmin } from "@/components/protected-admin";
import ReservationManagement from "./routes/admin/table/page";
import AddTable from "./routes/admin/table/add_table";

const convert = (queryClient) => (m) => {
  const { clientLoader, clientAction, default: Component, ...rest } = m;
  return {
    ...rest,
    loader: clientLoader?.(queryClient),
    action: clientAction?.(queryClient),
    Component,
  };
};

export const createAppRouter = (queryClient) =>
  createBrowserRouter([
    {
      path: "/",
      lazy: () => import("./routes/landing").then(convert(queryClient)),
    },
    {
      path: "/login",
      lazy: () => import("./routes/auth/login").then(convert(queryClient)),
    },
    {
      path: "/register",
      lazy: () => import("./routes/auth/register").then(convert(queryClient)),
    },
    {
      path: "/",
      element: (
        <ProtectedApp>
          <AppRoot />
        </ProtectedApp>
      ),
      // ErrorBoundary: AppRootErrorBoundary,
      children: [
        {
          path: "result",
          lazy: () => import("./routes/app/search").then(convert(queryClient)),
        },
        {
          path: "home",
          lazy: () => import("./routes/app/home").then(convert(queryClient)),
        },
        {
          path: "history",
          lazy: () => import("./routes/app/order-history").then(convert(queryClient)),
        },
        {
          path: "checkout",
          lazy: () => import("./routes/app/checkout").then(convert(queryClient)),
        },
        {
          path: "me",
          lazy: () => import("./routes/app/me").then(convert(queryClient)),
        },
        {
          path: "/restaurants/:restaurantId",
          lazy: () => import("./routes/app/restaurant").then(convert(queryClient)),
        },
        {
          path: "/d/restaurants",
          lazy: () => import("./routes/app/dashboard-restaurants/dashboard-restaurants").then(convert(queryClient)),
        },
        {
          path: "/d/restaurants/create",
          lazy: () => import("./routes/app/dashboard-restaurants/create-restaurant").then(convert(queryClient)),
        },
      ],
    },
    {
      path: "/d/restaurants/:restaurantId",
      element: (
        <ProtectedAdmin>
          <RestaurantProvider>
            <HomeAdmin />
          </RestaurantProvider>
        </ProtectedAdmin>
      ),
      ErrorBoundary: AppRootErrorBoundary,
      children: [
        {
          index: true,
          element: <RestaurantInfoForm />,
        },
        {
          path: "suathongtin",
          element: <RestaurantUpdateInfoForm />,
        },
        {
          path: "thongke",
          element: <Overview />,
        },
        {
          path: "menu",
          element: <MenuPage />,
        },
        {
          path: "menu/themmon",
          element: <AddFood />,
        },
        {
          path: "hoadon",
          element: <OrdersPage />,
        },
        {
          path: "hoadon/chitiet",
          element: <OrderDetail />,
        },
        {
          path: "datban",
          element: <ReservationManagement />,
        },
        {
          path: "ban",
          element: <TableManagement />,
        },
        {
          path: "ban/themban",
          element: <AddTable />,
        },
      ],
    },
    {
      path: "*",
      lazy: () => import("./routes/not-found").then(convert(queryClient)),
    },
  ]);

export const AppRouter = () => {
  const queryClient = useQueryClient();
  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);
  return <RouterProvider router={router} />;
};
