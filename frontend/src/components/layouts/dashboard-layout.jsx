import { Link } from "../ui/link";

export const DashboardLayout = ({ children }) => {
	return (
		<div className="flex flex-col h-screen">
			{/* <Header /> */}
			<div className="flex flex-1 gap-2">
				<Link to="/login">Login</Link>
				<Link to="/">Home</Link>
				<Link to="/food">food</Link>
				{/* <Sidebar /> */}
				<main className="flex-1 p-6">{children}</main>
			</div>
		</div>
	);
};
