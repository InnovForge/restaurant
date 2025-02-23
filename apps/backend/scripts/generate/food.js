import { faker } from "@faker-js/faker";

const customDishes = [
  "Phở Bò",
  "Bún Chả",
  "Cơm Tấm",
  "Gỏi Cuốn",
  "Bánh Mì",
  "Cháo Lòng",
  "Bún Bò Huế",
  "Hủ Tiếu Nam Vang",
  "Bánh Xèo",
  "Nem Rán",
];

const adjectives = [
  "Đặc Biệt",
  "Thập Cẩm",
  "Nóng Hổi",
  "Truyền Thống",
  "Hiện Đại",
  "Cay Nồng",
  "Hấp Dẫn",
  "Thơm Lừng",
  "Đậm Đà",
  "Siêu Ngon",
];

const ingredients = ["Bò", "Gà", "Heo", "Tôm", "Cua", "Cá", "Đậu Hũ", "Nấm", "Rau Củ", "Thập Cẩm"];

const methods = ["Chiên", "Hấp", "Nướng", "Xào", "Luộc", "Om", "Kho", "Hầm", "Rang", "Trộn"];

const flavors = ["Cay", "Ngọt", "Chua", "Mặn", "Đậm Đà", "Thơm Phức", "Béo Ngậy", "Giòn Tan", "Mềm Mại", "Đậm Vị"];

const sizes = [
  "Đặc Biệt",
  "Siêu To",
  "Mini",
  "Cỡ Lớn",
  "Cỡ Nhỏ",
  "Gia Đình",
  "Phần Ăn Nhanh",
  "Phần Ăn Chay",
  "Set Combo",
  "Bữa Tiệc",
];

export const generateUniqueFoods = (quantity = 2000) => {
  const dishesSet = new Set();

  while (dishesSet.size < quantity) {
    const dishName = `${faker.helpers.arrayElement(adjectives).slice(0, 15)} ${faker.helpers.arrayElement(customDishes).slice(0, 15)} ${faker.helpers.arrayElement(ingredients).slice(0, 15)} ${faker.helpers.arrayElement(methods).slice(0, 15)} ${faker.helpers.arrayElement(flavors).slice(0, 15)} ${faker.helpers.arrayElement(sizes).slice(0, 15)}`;

    const limitedDishName = dishName.length > 100 ? dishName.substring(0, 100).trim() : dishName;

    if (limitedDishName.length <= 100) {
      dishesSet.add(limitedDishName);
    } else {
      console.log("Quá dài:", limitedDishName, "Độ dài:", limitedDishName.length);
    }
  }

  return Array.from(dishesSet);
};
