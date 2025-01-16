import { Link } from "@/components/ui/link";
import reactLogo from "../../assets/react.svg";
export const DashboardLayout = ({ children }) => {
	return (
		<div className="flex max-w-[1128px] flex-col h-screen m-auto">
			<div className="flex gap-2 sticky w-full justify-between items-center">
				<div className="flex items-center gap-1">
					<img
						src={reactLogo}
						className="logo react w-[40x] h-[40px]"
						alt="React logo"
					/>
					<h1 className="text-xl font-semibold">CIDO</h1>
				</div>
				<div className="flex gap-5">
					<Link to="/">HOME</Link>
					<Link to="/restaurant">RESTAURANT</Link>
					<Link to="/food"> </Link>
				</div>
				<Link to="/login">Login</Link>
			</div>
			<main className="flex-1">{children}</main>
		</div>
	);
};
