import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { nanoidNumbersOnly } from "../src/utils/nanoid.js";
import { removeDiacritics } from "../src/utils/removeDiacritics.js";
import readline from "readline";

// Config
const TOTAL_FOODS_TARGET = 100000;
const FOODS_PER_RESTAURANT = 100;
const NUMBER_OF_RESTAURANTS = Math.ceil(TOTAL_FOODS_TARGET / FOODS_PER_RESTAURANT);
const NUMBER_OF_USERS = NUMBER_OF_RESTAURANTS * 2;
const NUMBER_OF_BILLS = 200;

const USER_BATCH = 10000;

// Arrays to hold IDs
const userIds = [];
const addressIds = [];
const restaurantIds = [];
const foodIds = [];

const createCsvWriter = (fileName, headers) => {
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, fileName);
  const stream = fs.createWriteStream(filePath, { flags: "w" });
  stream.write(headers.join(",") + "\n");

  return {
    writeRow: (row) => {
      const escaped = row.map((v) => `"${v ?? ""}"`);
      stream.write(escaped.join(",") + "\n");
    },
    close: () => stream.end(),
  };
};

// Food categories
const FOOD_CATEGORIES = [
  "Cơm",
  "Mì",
  "Phở",
  "Bún",
  "Cháo",
  "Lẩu",
  "Đồ uống",
  "Tráng miệng",
  "Hải sản",
  "Chay",
  "Bánh mì",
  "Gà rán",
  "Bò bít tết",
  "Pizza",
  "Burger",
  "Sushi",
  "Dimsum",
  "Món nướng",
  "Món cuốn",
  "Bánh ngọt",
  "Sinh tố",
  "Cà phê",
  "Trà sữa",
  "Kem",
  "Đồ nhậu",
  "Hủ tiếu",
  "Mì Quảng",
  "Ốc",
  "Bánh xèo",
  "Bánh ướt",
  "Bánh cuốn",
  "Bánh bèo",
  "Gỏi",
  "Bánh chưng",
  "Bánh tét",
  "Bánh bột lọc",
  "Mì cay",
  "Món Âu",
  "Món Hàn",
  "Món Nhật",
  "Món Thái",
  "Món Ấn",
  "Món Mexico",
  "Cơm tấm",
  "Cơm niêu",
  "Bún đậu mắm tôm",
  "Bún bò Huế",
  "Bún chả",
  "Bún riêu",
  "Bún thịt nướng",
  "Cơm gà",
  "Gà xối mỡ",
  "Bánh canh",
  "Nem nướng",
  "Nem lụi",
  "Bò né",
  "Chè",
  "Nước ép",
  "Bánh tráng trộn",
  "Bánh tráng nướng",
  "Bánh tráng cuốn",
  "Bánh tráng phơi sương",
  "Bánh tráng chảo",
];

// CSV writers
const usersCsv = createCsvWriter("users.csv", [
  "user_id",
  "name",
  "gender",
  "username",
  "password",
  "email",
  "email_verify",
  "avatar_url",
  "phone_number",
]);
const addressesCsv = createCsvWriter("addresses.csv", [
  "address_id",
  "address_line1",
  "address_line2",
  "longitude",
  "latitude",
]);
const userAddressesCsv = createCsvWriter("user_addresses.csv", [
  "user_address_id",
  "address_id",
  "user_id",
  "phone_number",
  "is_default",
]);
const restaurantsCsv = createCsvWriter("restaurants.csv", [
  "restaurant_id",
  "name",
  "description",
  "email",
  "address_id",
  "is_closed",
  "phone_number",
  "logo_url",
  "cover_url",
]);
const restaurantManagersCsv = createCsvWriter("restaurant_managers.csv", ["user_id", "restaurant_id", "role"]);
const restaurantSchedulesCsv = createCsvWriter("restaurant_schedules.csv", [
  "restaurant_id",
  "day_of_week",
  "opening_time",
  "closing_time",
  "is_closed",
]);
const foodCategoriesCsv = createCsvWriter("food_categories.csv", ["food_category_id", "restaurant_id", "name"]);
const foodsCsv = createCsvWriter("foods.csv", [
  "food_id",
  "restaurant_id",
  "name",
  "description",
  "price",
  "price_type",
  "image_url",
  "available",
]);
const foodCategoryMappingCsv = createCsvWriter("food_category_mapping.csv", ["food_id", "food_category_id"]);
const tablesCsv = createCsvWriter("tables.csv", ["table_id", "table_name", "restaurant_id", "seat_count"]);
const reservationsCsv = createCsvWriter("reservations.csv", [
  "reservation_id",
  "restaurant_id",
  "user_id",
  "table_id",
  "reservation_datetime",
  "check_in_time",
  "reservation_status",
]);
const billsCsv = createCsvWriter("bills.csv", [
  "bill_id",
  "restaurant_id",
  "user_id",
  "reservation_id",
  "order_status",
  "online_provider",
  "payment_method",
  "payment_status",
  "total_amount",
]);
const billItemsCsv = createCsvWriter("bill_items.csv", [
  "bill_item_id",
  "bill_id",
  "food_id",
  "price_at_purchase",
  "name_at_purchase",
  "quantity",
]);
const searchHistoryCsv = createCsvWriter("search_history.csv", ["user_id", "search_query", "search_query_normalized"]);

// Create Users + Addresses
const createUsersAndAddresses = async () => {
  const hashPassword = await bcrypt.hash("cdio@team1", 10);

  for (let i = 0; i < NUMBER_OF_USERS; i++) {
    const user_id = nanoidNumbersOnly();
    userIds.push(user_id);
    const username = (faker.internet.username().toLowerCase() + faker.number.int({ min: 1000, max: 9999 })).slice(
      0,
      30,
    );
    usersCsv.writeRow([
      user_id,
      faker.person.fullName(),
      faker.number.int({ min: 0, max: 2 }),
      username,
      hashPassword,
      faker.internet.email(),
      0,
      faker.image.avatar(),
      faker.phone.number({ style: "international" }),
    ]);

    const numAddresses = faker.number.int({ min: 1, max: 5 });
    for (let j = 0; j < numAddresses; j++) {
      const address_id = nanoidNumbersOnly();
      addressIds.push(address_id);
      addressesCsv.writeRow([
        address_id,
        faker.location.streetAddress(),
        faker.datatype.boolean() ? faker.location.secondaryAddress() : null,
        faker.location.longitude({ min: 108.1, max: 108.3 }),
        faker.location.latitude({ min: 15.95, max: 16.15 }),
      ]);
      userAddressesCsv.writeRow([
        nanoidNumbersOnly(),
        address_id,
        user_id,
        faker.phone.number({ style: "international" }),
        j === 0 ? 1 : 0,
      ]);
    }
  }
  console.log("✅ Users and addresses CSV created");
};

// Create Restaurants
const createRestaurants = () => {
  for (let i = 0; i < NUMBER_OF_RESTAURANTS; i++) {
    const restaurant_id = nanoidNumbersOnly();
    restaurantIds.push(restaurant_id);
    const name = faker.company.name();
    const address_id = addressIds.shift();
    restaurantsCsv.writeRow([
      restaurant_id,
      name,
      faker.lorem.sentences(3),
      faker.internet.email(),
      address_id,
      faker.datatype.boolean({ probability: 0.1 }) ? 1 : 0,
      faker.phone.number({ style: "international" }),
      faker.image.urlPicsumPhotos({ width: 200, height: 200 }),
      faker.image.urlPicsumPhotos({ width: 800, height: 400 }),
    ]);
    // owner
    restaurantManagersCsv.writeRow([userIds.shift(), restaurant_id, "owner"]);

    // Schedule 7 days
    for (let day = 0; day <= 6; day++) {
      const openingTime = `${faker.number.int({ min: 6, max: 10 }).toString().padStart(2, "0")}:${faker.number.int({ min: 0, max: 59 }).toString().padStart(2, "0")}:00`;
      const closingTime = `${faker.number.int({ min: 20, max: 23 }).toString().padStart(2, "0")}:${faker.number.int({ min: 0, max: 59 }).toString().padStart(2, "0")}:00`;
      restaurantSchedulesCsv.writeRow([
        restaurant_id,
        day,
        openingTime,
        closingTime,
        faker.datatype.boolean({ probability: 0.1 }) ? 1 : 0,
      ]);
    }

    // Food categories
    const numCategories = faker.number.int({ min: 15, max: 30 });
    const used = new Set();
    for (let c = 0; c < numCategories; c++) {
      let name;
      do {
        name = faker.helpers.arrayElement(FOOD_CATEGORIES);
      } while (used.has(name));
      used.add(name);
      foodCategoriesCsv.writeRow([nanoidNumbersOnly(), restaurant_id, name]);
    }
  }
  console.log("✅ Restaurants, managers, schedules, categories CSV created");
};

// Create Foods
const createFoods = () => {
  const descPool = Array.from({ length: 200 }, () => faker.lorem.sentences(2));
  const imagePool = Array.from({ length: 200 }, () => faker.image.urlPicsumPhotos({ width: 400, height: 400 }));

  for (const restaurant_id of restaurantIds) {
    const categories = FOOD_CATEGORIES.map((_) => nanoidNumbersOnly()); // placeholder, you can map real category ids if needed
    for (let j = 0; j < FOODS_PER_RESTAURANT; j++) {
      const food_id = nanoidNumbersOnly();
      foodIds.push(food_id);
      const name = faker.food.dish() + (j >= 200 ? ` (${j})` : "");
      const price = faker.number.int({ min: 10000, max: 500000 });
      const available = faker.datatype.boolean() ? 1 : 0;
      foodsCsv.writeRow([
        food_id,
        restaurant_id,
        name,
        faker.helpers.arrayElement(descPool),
        price,
        "VND",
        faker.helpers.arrayElement(imagePool),
        available,
      ]);

      // map food category
      const selectedCategories = faker.helpers.arrayElements(categories, faker.number.int({ min: 1, max: 2 }));
      for (const catId of selectedCategories) {
        foodCategoryMappingCsv.writeRow([food_id, catId]);
      }
    }
  }
  console.log("✅ Foods and food_category_mapping CSV created");
};

// Create Tables, Reservations, Bills, BillItems
const createTablesReservationsAndBills = () => {
  for (const restaurant_id of restaurantIds) {
    const numTables = faker.number.int({ min: 5, max: 15 });
    const tableIds = [];
    for (let t = 0; t < numTables; t++) {
      const table_id = nanoidNumbersOnly();
      tableIds.push(table_id);
      tablesCsv.writeRow([table_id, `Bàn ${t + 1}`, restaurant_id, faker.number.int({ min: 2, max: 10 })]);
    }

    for (const table_id of tableIds) {
      const numRes = faker.number.int({ min: 1, max: 5 });
      for (let r = 0; r < numRes; r++) {
        const user_id = faker.helpers.arrayElement(userIds);
        const reservation_id = nanoidNumbersOnly();
        const resTime = faker.date.future();
        const checkIn = faker.date.between({ from: resTime, to: new Date(resTime.getTime() + 3600000) });
        const status = faker.helpers.arrayElement(["pending", "confirmed", "completed", "cancelled"]);
        reservationsCsv.writeRow([reservation_id, restaurant_id, user_id, table_id, resTime, checkIn, status]);

        const order_status =
          status === "pending"
            ? "pending"
            : status === "confirmed"
              ? "preparing"
              : status === "completed"
                ? "completed"
                : "canceled";
        const payment_method = faker.helpers.arrayElement(["cash", "card", "online", "postpaid"]);
        const online_provider = payment_method === "online" ? faker.helpers.arrayElement(["momo", "zalopay"]) : "";
        const payment_status = status === "completed" ? "paid" : "unpaid";
        const bill_id = nanoidNumbersOnly();
        billsCsv.writeRow([
          bill_id,
          restaurant_id,
          user_id,
          reservation_id,
          order_status,
          online_provider,
          payment_method,
          payment_status,
          0,
        ]);

        // Bill items
        if (["confirmed", "completed"].includes(status)) {
          const numItems = faker.number.int({ min: 1, max: 5 });
          for (let b = 0; b < numItems; b++) {
            const food_id = faker.helpers.arrayElement(foodIds);
            const quantity = faker.number.int({ min: 1, max: 5 });
            const price = faker.number.int({ min: 10000, max: 500000 });
            const name = faker.food.dish();
            billItemsCsv.writeRow([nanoidNumbersOnly(), bill_id, food_id, price, name, quantity]);
          }
        }
      }
    }
  }
  console.log("✅ Tables, reservations, bills, bill_items CSV created");
};

// Search history
const foodSearchQueries = ["bánh mì", "phở", "bún bò Huế", "cơm tấm", "pizza", "sushi", "trà sữa", "kem"];
const createSearchHistory = () => {
  for (const userId of userIds) {
    const numSearches = faker.number.int({ min: 40, max: 100 });
    const set = new Set();
    for (let i = 0; i < numSearches; i++) {
      set.add(faker.helpers.arrayElement(foodSearchQueries));
    }
    for (const query of set) {
      searchHistoryCsv.writeRow([userId, query, removeDiacritics(query)]);
    }
  }
  console.log("✅ Search history CSV created");
};

// Main
const seedToCsv = async () => {
  await createUsersAndAddresses();
  createRestaurants();
  createFoods();
  createTablesReservationsAndBills();
  createSearchHistory();

  // close all CSV streams
  usersCsv.close();
  addressesCsv.close();
  userAddressesCsv.close();
  restaurantsCsv.close();
  restaurantManagersCsv.close();
  restaurantSchedulesCsv.close();
  foodCategoriesCsv.close();
  foodsCsv.close();
  foodCategoryMappingCsv.close();
  tablesCsv.close();
  reservationsCsv.close();
  billsCsv.close();
  billItemsCsv.close();
  searchHistoryCsv.close();

  console.log("🎉 All CSV files generated successfully!");
};

// CLI
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question("📣 Generate CSV? (y/N): ", (answer) => {
  if (answer.toLowerCase() === "y") {
    seedToCsv().finally(() => rl.close());
  } else {
    console.log("❌ Cancelled.");
    rl.close();
  }
});
