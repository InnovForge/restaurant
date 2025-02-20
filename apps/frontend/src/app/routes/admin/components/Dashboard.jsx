import { Link } from "react-router";
import { Home, Utensils, ShoppingBag, User, Table } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams } from "react-router";
import useAuthUserStore from "@/stores/useAuthUserStore";

export default function DashboardLayout({ children }) {
  let { restaurantId } = useParams();
  const { authUser } = useAuthUserStore();

  console.log(restaurantId, authUser);

  const menuItems = [
    { path: "infor", icon: User, label: "Thông tin" },
    { path: "thongke", icon: Home, label: "Thống kê" },
    { path: "menu", icon: Utensils, label: "Menu" },
    { path: "hoadon", icon: ShoppingBag, label: "Hóa đơn" },
    { path: "ban", icon: Table, label: "Bàn ăn" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">Quản Lý Nhà Hàng Admin</h1>
        </div>
        <div className="mb-8 flex flex-col items-center space-y-2">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>NB</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-black">Nhat blue</h2>
          </div>
        </div>
        <nav className="mt-6">
          {menuItems.map(({ path, icon: Icon, label }, index) => (
            <Link
              key={index + label}
              to={path}
              className="block px-4 py-2 hover:bg-accent hover:text-accent-foreground"
            >
              <Icon className="inline-block mr-2" size={18} />
              {label}
            </Link>
          ))}
          {/* 					<Link
						to={`/d/restaurants/${restaurantId}/infor`}
						className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
					>
						<User className="inline-block mr-2" size={18} />
						Thông tin
					</Link>
					<Link
						to={`/d/restaurants/${restaurantId}/thongke`}
						className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
					>
						<Home className="inline-block mr-2" size={18} />
						Thống kê
					</Link>
					<Link
						to="/d/restaurants/menu"
						className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
					>
						<Utensils className="inline-block mr-2" size={18} />
						Menu
					</Link>
					<Link
						to="/d/restaurants/hoadon"
						className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
					>
						<ShoppingBag className="inline-block mr-2" size={18} />
						Hóa đơn
					</Link>
					<Link
						to="/d/restaurants/ban"
						className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
					>
						<Table className="inline-block mr-2" size={18} />
						Bàn ăn
					</Link> */}
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
