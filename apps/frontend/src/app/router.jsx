import React, { useMemo } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "./routes/auth/Login";
import {
	default as AppRoot,
	ErrorBoundary as AppRootErrorBoundary,
} from "./routes/app/root";
import Home from "./routes/app/home";
import Food from "./routes/app/food";
import AdminRestaurant from "@/features/admin/components/admin-restaurant";

const NOT_FOUND = React.lazy(() => import("./routes/not-found"));

export const createAppRouter = () =>
	createBrowserRouter([
		{
			path: "/login",
			element: <Login />,
			path: "/admin",
			element:<AdminRestaurant/>
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
			path: "*",
			element: <NOT_FOUND />,
		},
	]);

export const AppRouter = () => {
	const router = useMemo(() => createAppRouter(), []);

	return <RouterProvider router={router} />;
};
