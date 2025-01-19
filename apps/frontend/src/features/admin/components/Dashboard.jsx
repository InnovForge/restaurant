import { Link } from "react-router";
import { Home, Utensils, ShoppingBag } from "lucide-react";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">Restaurant Admin</h1>
        </div>
        <nav className="mt-6">
          <Link
            to="/admin"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          >
            <Home className="inline-block mr-2" size={18} />
            Overview
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
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
