import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRestaurant } from "@/context/restaurant";
import { api } from "@/lib/api-client";

const AddFood = () => {
  const [image, setImage] = useState(null);
  const { restaurantId } = useRestaurant();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleAdd = async () => {
    try {
      const addFood = {
        name: document.getElementById("name").value,
        price: document.getElementById("price").value,
        description: document.getElementById("description").value,
      };

      const res = await api.post(`/v1/restaurants/${restaurantId}/food`, addFood);
      alert("Thêm món thành công!");
    } catch (err) {
      console.error("Lỗi thêm:", err);
      alert("Cập nhật thất bại!");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold mb-4">Thêm món ăn</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên món ăn:</Label>
                <Input id="name" placeholder="Nhập tên món ăn" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Giá:</Label>
                <Input id="price" placeholder="Nhập giá món ăn" type="number" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả:</Label>
                <Input id="description" placeholder="Nhập mô tả" />
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-48 h-48 bg-gray-200 relative">
                {image ? (
                  <img src={image} alt="anhmon" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-400">Chưa có ảnh</div>
                )}
              </div>
              <Button className="w-32" onClick={() => document.getElementById("picture").click()}>
                Chọn ảnh món ăn
              </Button>
              <Input id="picture" type="file" style={{ display: "none" }} onChange={handleFileChange} />
            </div>
          </div>

          <div className="mt-6">
            <Button className="w-full" onClick={handleAdd}>
              Thêm món ăn
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddFood;
