import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function RestaurantUpdateInfoForm() {
  // lay anh
  const [image, setImage] = useState(null);
  // xu ly anh khi an vao nut thay doi anh
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Thông tins</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Thông tin nhà hàng</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên nhà hàng :</Label>
                  <Input id="name" defaultValue="0202020" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email :</Label>
                  <Input id="email" defaultValue="0202020" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Điện thoại :</Label>
                  <Input id="phone" defaultValue="0202020" />
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-48 h-48 bg-gray-200 relative">
                  {image ? (
                    <img src={image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-400"></div>
                  )}
                </div>
                <Button className="w-32" onClick={() => document.getElementById("picture").click()}>
                  Thay đổi ảnh
                </Button>
                <Input id="picture" type="file" style={{ display: "none" }} onChange={handleFileChange} />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Địa chỉ</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street">address_line1 :</Label>
                <Input id="street" defaultValue="0202020" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ward">address_line2 :</Label>
                <Input id="ward" defaultValue="0202020" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">longitude :</Label>
                <Input id="district" defaultValue="0202020" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">latitude :</Label>
                <Input id="city" defaultValue="0202020" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Quốc gia :</Label>
                <Input id="country" defaultValue="0202020" />
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button className="w-32">Sửa</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
