import { useState } from "react";
import logo from "../../../assets/react.svg";
import useAuthUserStore from "@/stores/useAuthUserStore";
import { api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

const Me = () => {
  const { authUser } = useAuthUserStore();

  const { data, isFetching } = useQuery({
    queryKey: "get-bill",
    queryFn: async () => {
      const f = await api.get(`/v1/user/${authUser.userId}/bill`);
      // sF(f.data)
      return f.data.data;
    },
    // staleTime: 1000 * 60 * 1, // 5 minutes
  });

  console.log(data);

  console.log(authUser.name);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(authUser.name);
  const [phone, setPhone] = useState("0123456789");
  const [gender, setGender] = useState("Nam");
  const [birthDate, setBirthDate] = useState(null);
  const [email, setEmail] = useState(authUser.email);
  const [addresses, setAddresses] = useState([
    { ward: "Phường A", district: "Quận B", city: "Thành phố C", country: "Việt Nam" },
  ]);
  const [avatar, setAvatar] = useState(authUser.avatarUrl);

  const handleSave = () => {
    setIsEditing(false);
    // Thêm logic cập nhật dữ liệu lên server nếu cần
  };

  const addAddress = () => {
    setAddresses([...addresses, { ward: "", district: "", city: "", country: "" }]);
  };

  const removeAddress = (index) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  const updateAddress = (index, field, value) => {
    const newAddresses = addresses.map((addr, i) => (i === index ? { ...addr, [field]: value } : addr));
    setAddresses(newAddresses);
  };

  const parseAddress = (addressString) => {
    const parts = addressString.split(",").map((part) => part.trim());
    return {
      placeName: parts[0] || "",
      houseNumber: parts[1] || "",
      street: parts[2] || "",
      city: parts[3] || "",
      postalCode: parts[4] || "",
      country: parts[5] || "",
    };
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">Thông Tin Người Dùng</h2>
      <div className="space-y-4">
        <div className="flex flex-col items-center">
          <img src={avatar || logo} alt="Avatar" className="w-24 h-24 rounded-full mb-2 border" />
          {isEditing && (
            <input
              type="file"
              onChange={(e) => setAvatar(URL.createObjectURL(e.target.files[0]))}
              className="text-sm"
            />
          )}
        </div>
        <div>
          <label className="block text-gray-600">Tên:</label>
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <h1 className="text-xl font-semibold">{name}</h1>
          )}
        </div>
        <div>
          <label className="block text-gray-600">Số điện thoại:</label>
          {isEditing ? (
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <h1 className="text-xl font-semibold">{phone}</h1>
          )}
        </div>
        <div>
          <label className="block text-gray-600">Ngày sinh:</label>
          {isEditing ? (
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          ) : (
            <h1 className="text-xl font-semibold">{birthDate || "Chưa có email"}</h1>
          )}
        </div>
        <div>
          <label className="block text-gray-600">Email:</label>
          {isEditing ? (
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <h1 className="text-xl font-semibold">{email || "Chưa có email"}</h1>
          )}
        </div>
        <div>
          <label className="block text-gray-600">Địa chỉ:</label>
          {addresses.map((addr, index) => (
            <div key={index} className="border p-2 mb-2 rounded-lg">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={addr.ward}
                    onChange={(e) => updateAddress(index, "ward", e.target.value)}
                    className="w-full p-2 border rounded-lg mb-1"
                    placeholder="Phường/Xã"
                  />
                  <input
                    type="text"
                    value={addr.district}
                    onChange={(e) => updateAddress(index, "district", e.target.value)}
                    className="w-full p-2 border rounded-lg mb-1"
                    placeholder="Quận/Huyện"
                  />
                  <input
                    type="text"
                    value={addr.city}
                    onChange={(e) => updateAddress(index, "city", e.target.value)}
                    className="w-full p-2 border rounded-lg mb-1"
                    placeholder="Tỉnh/Thành phố"
                  />
                  <input
                    type="text"
                    value={addr.country}
                    onChange={(e) => updateAddress(index, "country", e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Quốc gia"
                  />
                  {/* <button onClick={() => removeAddress(index)} className="text-red-500 mt-2">Xóa</button> */}
                </>
              ) : (
                <h1 className="text-xl font-semibold">{`${addr.ward}, ${addr.district}, ${addr.city}, ${addr.country}`}</h1>
              )}
            </div>
          ))}
          {/* {isEditing && <button onClick={addAddress} className="text-blue-500 mt-2">Thêm địa chỉ</button>} */}
        </div>
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          {isEditing ? "Lưu" : "Sửa"}
        </button>
      </div>
    </div>
  );
};

export default Me;
