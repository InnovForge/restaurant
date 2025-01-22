import { Link } from "react-router";
import { Home, Utensils, ShoppingBag, User, LogOut ,Table} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardLayout({ children }) {
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
        <Link
            to="/admin"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          >
            <User className="inline-block mr-2" size={18} />
            Thông tin
          </Link>
          <Link
            to="/admin/tongquan"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          >
            <Home className="inline-block mr-2" size={18} />
            Tổng quan
          </Link>
          <Link
            to="/admin/menu"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          >
            <Utensils className="inline-block mr-2" size={18} />
            Menu
          </Link>
          <Link
            to="/admin/orders"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          >
            <ShoppingBag className="inline-block mr-2" size={18} />
            Orders
          </Link>
          <Link
            to="/admin/table"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          >
            <Table className="inline-block mr-2" size={18} />
            Bàn ăn
          </Link>
          <Link
            to="/login"
            className="block px-4 py-2 text-gray-800  hover:bg-gray-500 hover:text-gray-800 mt-4 "
          >
            <LogOut className="inline-block mr-2" size={18} />
            Logout
          </Link>
        </nav>
        
      </aside>
    
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
