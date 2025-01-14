import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { Spinner } from "@/components/ui/spinner";

export const AppProvider = ({ children }) => {
	return (
		<React.Suspense
			fallback={
				<div className="flex h-screen w-screen items-center justify-center">
					<Spinner size="xl" />
				</div>
			}
		>
			<Toaster />

			{children}
		</React.Suspense>
	);
};
