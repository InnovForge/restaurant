import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function UserInfoForm() {
  // State to store the image URL
  const [image, setImage] = useState(null);
  // Function to handle file input change
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
          <CardTitle>Thông tin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Thông tin cá nhân</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Tên người dùng :</Label>
                  <Input id="username" defaultValue="ABC" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Giới tính :</Label>
                  <Input id="gender" defaultValue="XYZ" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Ngày sinh :</Label>
                  <Input id="dob" defaultValue="11/11/1111" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email :</Label>
                  <Input id="email" type="email" defaultValue="ABC@gmail.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Điện thoại :</Label>
                  <Input id="phone" defaultValue="0935******" />
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
                <Label htmlFor="street">Địa chỉ/Tổ/Thôn :</Label>
                <Input id="street" defaultValue="abc" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ward">Phường/Xã :</Label>
                <Input id="ward" defaultValue="xyz" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">Quận/Huyện :</Label>
                <Input id="district" defaultValue="abc" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Tỉnh/Thành phố :</Label>
                <Input id="city" defaultValue="xyz" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Quốc gia :</Label>
                <Input id="country" defaultValue="Việt Nam" />
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button className="w-32">Sửa thông tin</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
