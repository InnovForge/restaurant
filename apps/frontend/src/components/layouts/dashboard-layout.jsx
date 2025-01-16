import reactLogo from "../../assets/react.svg";
import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router";
export const DashboardLayout = ({ children }) => {
	return (
		<div className="flex max-w-[1280px] flex-col h-screen m-auto">
			<div className="flex gap-2 sticky w-full justify-between items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-1">
				<div className="flex items-center gap-1">
					<img
						src={reactLogo}
						className="logo react w-[34x] h-[34px]"
						alt="React logo"
					/>
					<h1 className="text-xl font-semibold">CIDO</h1>
				</div>
				<div className="flex gap-5">
					<Link to="/">Home</Link>
					<Link to="/restaurant">Restaurant</Link>
					<Link to="/food">Food</Link>
				</div>
				<div className="flex gap-1 items-center">
					<Button variant="ghost" size="icon">
						<ShoppingCart />
					</Button>
					<Button variant="ghost" asChild>
						<Link to="/login">Login</Link>
					</Button>
					<Button variant="ghost" asChild>
						<Link to="/register">Sign up</Link>
					</Button>
				</div>
			</div>
			<main className="flex-1">{children}</main>
		</div>
	);
};
