import React, { useMemo } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import Login from "./routes/auth/Login";
import { default as AppRoot, ErrorBoundary as AppRootErrorBoundary } from "./routes/app/root";
import Home from "./routes/app/home";
import Food from "./routes/app/food";
import HomeAdmin from "./routes/admin/page";
import Overview from "./routes/admin/overview/page";
import MenuPage from "./routes/admin/menu/page";
import AddFood from "./routes/admin/menu/addfood";
import OrdersPage from "./routes/admin/orders/page";
import OrderDetail from "./routes/admin/orders/detail";
import TableManagement from "./routes/admin/table/page";
import AddTable from "./routes/admin/table/addtable";
import OrderHistory from "./routes/app/order-history";
import UserInfoForm from "./routes/admin/infor/admin/infor";
import UserUpdateInfoForm from "./routes/admin/infor/admin/infor_update";
import RestaurantInfoForm from "./routes/admin/infor/res/infor";
import RestaurantUpdateInfoForm from "./routes/admin/infor/res/infor_update";

const NOT_FOUND = React.lazy(() => import("./routes/not-found"));

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
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: <AppRoot />,
      ErrorBoundary: AppRootErrorBoundary,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/home",
          element: <Food />,
        },
        {
          path: "/history",
          element: <OrderHistory />,
        },
      ],
    },
    {
      path: "/admin",
      element: <HomeAdmin />,
      ErrorBoundary: AppRootErrorBoundary,
      children: [
        {
          index: true,
          element: <UserInfoForm />,
        },
        {
          path: "suathongtin",
          element: <UserUpdateInfoForm />,
        },
        {
          path: "nhahang",
          element: <RestaurantInfoForm />,
        },
        {
          path: "nhahang/suathongtin",
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
