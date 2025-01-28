import React, { useMemo } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./routes/auth/Login";
import {
	default as AppRoot,
	ErrorBoundary as AppRootErrorBoundary,
} from "./routes/app/root";
import Home from "./routes/app/home";
import Food from "./routes/app/food";
import MenuPage from "@/features/admin/menu/page";
import OrdersPage from "@/features/admin/orders/page";
import HomeAdmin from "@/features/admin/page";
import Overview from "@/features/admin/overview/page";
import UserInfoForm from "@/features/admin/infor/page";
import TableManagement from "@/features/admin/table/table";
import AddFood from "@/features/admin/menu/addfood";
const NOT_FOUND = React.lazy(() => import("./routes/not-found"));

export const createAppRouter = () =>
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
					path: "/food",
					element: <Food />,
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
					path: "thongke",
					element: <Overview />,
				},
				{
					path: "menu",
					element: <MenuPage />,
					// children: [
					// 	{
					// 		path: "themmon",
					// 		element: <AddFood/>
					// 	},]
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
					path: "table",
					element: <TableManagement />,
				},
			],
		},
		{
			path: "*",
			element: <NOT_FOUND />,
		},
	]);

export const AppRouter = () => {
	const router = useMemo(() => createAppRouter(), []);

	return <RouterProvider router={router} />;
};
