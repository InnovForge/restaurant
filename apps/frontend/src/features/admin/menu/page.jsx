import { useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight, PlusCircle, Search } from "lucide-react";

const Button = ({ children, onClick, variant = "default", size = "md", className = "", ...props }) => {
  const baseStyle = "inline-flex items-center justify-center rounded-md border px-4 py-2";
  const variantStyle = variant === "default" ? "bg-blue-500 text-white" : "border-gray-300 text-gray-700";
  const sizeStyle = size === "sm" ? "text-sm py-1 px-2" : size === "icon" ? "w-8 h-8" : "";
  return (
    <button className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

const Input = ({ className = "", ...props }) => (
  <input
    className={`block w-full border border-gray-300 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
    {...props}
  />
);

const Badge = ({ children, variant = "default" }) => {
  const style = variant === "Tạm hết" ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700";
  return <span className={`inline-block px-2 py-1 text-xs rounded ${style}`}>{children}</span>;
};

const Table = ({ children }) => <table className="w-full border-collapse">{children}</table>;

const TableHeader = ({ children }) => <thead className="bg-gray-100">{children}</thead>;

const TableRow = ({ children }) => <tr className="border-b">{children}</tr>;

const TableCell = ({ children, className = "" }) => <td className={`p-3 ${className}`}>{children}</td>;

const TableHead = ({ children, className = "" }) => (
  <th className={`p-3 text-left font-semibold ${className}`}>{children}</th>
);

const data = [
  {
    id: "1",
    name: "Tôm hùm nướng phô mai",
    image: "https://th.bing.com/th/id/R.55dc200d2ae8b273a1bcbca98649326c?rik=AhNTTXII5H%2bfuA&pid=ImgRaw&r=0",
    quanlity: 10,
    status: "Còn",
    price: "100000",
  },
  {
    id: "2",
    name: "Cua biển hấp",
    image: "https://th.bing.com/th/id/R.0f6e3e1a3be694277bb55f97413184cb?rik=FWiarVBsSUPCsw&pid=ImgRaw&r=0",
    quanlity: 8,
    status: "Còn",
    price: "100000",
  },
  {
    id: "3",
    name: "Cá hồi sống japan",
    image: "https://th.bing.com/th/id/R.0115459b088f47c0db067984869da484?rik=Qp%2bSSrrufjFq9Q&pid=ImgRaw&r=0",
    quanlity: 5,
    status: "Còn",
    price: "100000",
  },
  {
    id: "4",
    name: "Mực hấp bia",
    image: "https://daubepgiadinh.vn/wp-content/uploads/2019/01/muc-hap-bia-600x400.jpg",
    quanlity: 12,
    status: "Còn",
    price: "100000",
  },
];

const MenuPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container mx-auto p-6">
      <div className="border rounded-md shadow-md bg-white">
        <div className="border-b p-4 flex justify-between">
          <h2 className="text-xl font-bold">Quản Lý Món Ăn</h2>
          <Link to="/admin/menu/themmon">
            <Button>
              <PlusCircle className="h-5 w-5 mr-2" />
              Thêm món ăn
            </Button>
          </Link>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {/* bảng */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Hình ảnh</TableHead>
                  <TableHead>Tên Món Ăn</TableHead>
                  <TableHead>Tình trạng</TableHead>
                  <TableHead>Số Lượng</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead className="text-right">Sửa / Xóa</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {paginatedData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "Còn" ? "Tạm hết" : "Hết"}>{item.status}</Badge>
                    </TableCell>
                    <TableCell>{item.quanlity}</TableCell>
                    <TableCell>{item.price + " VNĐ"}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline">
                        Sửa
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-500 ml-2">
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </div>
          {/* trang hiển thị */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm">
              Hiển thị {startIndex + 1} đến {Math.min(startIndex + itemsPerPage, filteredData.length)} trong số{" "}
              {filteredData.length} mục
            </span>
            <div className="flex items-center">
              <Button
                size="icon"
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  size="icon"
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                size="icon"
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
