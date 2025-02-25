import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import anhh from "@/assets/images/anh.jpg";
import anha from "@/assets/images/anh2.jpg";
import anhb from "@/assets/images/anh3.jpg";

const images = [anhh, anha, anhb];

const Landing = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const items = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="relative w-full h-[400px] overflow-hidden">
        <img
          src={images[currentImage]}
          alt="Restaurant Interior"
          className="w-full h-full object-cover border-4 border-purple-500 transition-opacity duration-1000"
        />
      </div>
      <div className="text-center my-4">
        <Button>
          <Link to="/home">Đi tới trang chính</Link>
        </Button>
      </div>
      <div className="max-w-4xl mx-auto text-center py-10 px-4">
        <h2 className="text-3xl font-bold">Nâng Tầm Trải Nghiệm Ẩm Thực</h2>
        <h3 className="text-xl font-semibold text-gray-700 my-2">Phong Cách, Chất Lượng, Cảm Xúc</h3>
        <p className="text-gray-600 mt-4">
          Chúng tôi không chỉ mang đến món ăn ngon mà còn tạo nên một hành trình ẩm thực đẳng cấp, nơi mỗi chi tiết – từ
          không gian, dịch vụ đến hương vị – đều được chăm chút để bạn cảm nhận trọn vẹn sự khác biệt.
        </p>
      </div>

      {/* Features Section */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 pb-10">
        <div className="text-center">
          <div className="text-4xl">🏠</div>
          <h4 className="font-bold mt-4">Dịch Vụ Đẳng Cấp - Trải Nghiệm Trọn Vẹn</h4>
          <p className="text-gray-600 mt-2">
            Không gian sang trọng, dịch vụ chuyên nghiệp giúp bạn tận hưởng những giây phút tuyệt vời.
          </p>
        </div>
        <div className="text-center">
          <div className="text-4xl">🍽️</div>
          <h4 className="font-bold mt-4">Hương Vị Tinh Tế, Nghệ Thuật Ẩm Thực</h4>
          <p className="text-gray-600 mt-2">
            Thực đơn đa dạng với nguyên liệu tươi ngon, kết hợp cùng nghệ thuật chế biến tinh tế.
          </p>
        </div>
        <div className="text-center">
          <div className="text-4xl">🎟️</div>
          <h4 className="font-bold mt-4">Ưu Đãi Hấp Dẫn - Khoảnh Khắc Đáng Nhớ</h4>
          <p className="text-gray-600 mt-2">
            Nhiều chương trình ưu đãi và sự kiện hấp dẫn đang chờ đón bạn tại nhà hàng.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
