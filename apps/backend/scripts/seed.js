import mysql from "mysql2/promise";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import dotenvFlow from "dotenv-flow";
import { nanoidNumbersOnly } from "../src/utils/nanoid.js";
import readline from "readline";
import { generateUniqueFoods } from "./generate/food.js";
import { removeDiacritics } from "../src/utils/removeDiacritics.js";
import fs from "fs";
import path from "path";
import mime from "mime-types";
import { uploadFileFood } from "../src/utils/s3.js";
dotenvFlow.config();

const connection = await mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
});

const NUMBER_OF_USERS = 100;
const NUMBER_OF_RESTAURANTS = Math.floor(NUMBER_OF_USERS / 3);
const NUMBER_OF_FOODS_PER_RESTAURANT = 100;
const NUMBER_OF_BILLS = 200;

const userIds = [];
const addressIds = [];
const restaurantIds = [];
const foodIds = [];

const createUsers = async (pass = "cdio@team1") => {
  for (let i = 0; i < NUMBER_OF_USERS; i++) {
    const user_id = nanoidNumbersOnly();
    userIds.push(user_id);

    const name = faker.person.fullName();
    const gender = faker.number.int({ min: 0, max: 2 });
    const username = faker.internet.username().toLowerCase();
    const password = await bcrypt.hash(pass, 10);
    const email = faker.internet.email();
    const avatar_url = faker.image.avatar();
    const phone_number = faker.phone.number({ style: "international" });

    await connection.execute(
      `
      INSERT INTO users (user_id, name, gender, username, password, email, avatar_url, phone_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [user_id, name, gender, username, password, email, avatar_url, phone_number],
    );

    const numAddresses = faker.number.int({ min: 1, max: 5 });

    let addresses = [];
    for (let j = 0; j < numAddresses; j++) {
      const address_id = nanoidNumbersOnly();
      const address_line1 = faker.location.streetAddress();
      const address_line2 = faker.datatype.boolean() ? faker.location.secondaryAddress() : null;
      const longitude = parseFloat(faker.location.longitude({ min: 108.1, max: 108.3 }));
      const latitude = parseFloat(faker.location.latitude({ min: 15.95, max: 16.15 }));

      await connection.execute(
        `
        INSERT INTO addresses (address_id, address_line1, address_line2, longitude, latitude)
        VALUES (?, ?, ?, ?, ?)
      `,
        [address_id, address_line1, address_line2, longitude, latitude],
      );

      addresses.push(address_id);
    }

    for (let j = 0; j < addresses.length; j++) {
      await connection.execute(
        `
        INSERT INTO user_addresses (user_address_id, address_id, user_id, phone_number, is_default)
        VALUES (?, ?, ?, ?, ?)
      `,
        [nanoidNumbersOnly(), addresses[j], user_id, phone_number, j === 0],
      );
    }
  }
  console.log(`✅ Inserted ${NUMBER_OF_USERS} users with multiple addresses`);
};

const createAddresses = async () => {
  for (let i = 0; i < NUMBER_OF_RESTAURANTS; i++) {
    const address_id = nanoidNumbersOnly();
    addressIds.push(address_id);
    const address_line1 = faker.location.streetAddress();
    const address_line2 = faker.location.secondaryAddress();
    const longitude = parseFloat(faker.location.longitude({ min: 108.1, max: 108.3 }));
    const latitude = parseFloat(faker.location.latitude({ min: 15.95, max: 16.15 }));

    await connection.execute(
      `
      INSERT INTO addresses (address_id, address_line1, address_line2, longitude, latitude)
      VALUES (?, ?, ?, ?, ?)
    `,
      [address_id, address_line1, address_line2, longitude, latitude],
    );
  }
  console.log(`✅ Inserted ${NUMBER_OF_RESTAURANTS} addresses`);
};

const createRestaurants = async () => {
  for (let i = 0; i < NUMBER_OF_RESTAURANTS; i++) {
    if (addressIds.length === 0) {
      console.log("❌ Not enough addresses to assign as restaurant address");
      return;
    }

    const restaurant_id = nanoidNumbersOnly();
    restaurantIds.push(restaurant_id);
    const name = faker.company.name();
    const address_id = addressIds.shift();
    const description = faker.lorem.sentences(3);
    const phone_number = faker.phone.number({ style: "international" });
    const logo_url = faker.image.urlPicsumPhotos({ width: 200, height: 200 });
    const cover_url = faker.image.urlPicsumPhotos({ width: 800, height: 400 });

    await connection.execute(
      `
      INSERT INTO restaurants (restaurant_id, name, description, address_id, phone_number, logo_url, cover_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [restaurant_id, name, description, address_id, phone_number, logo_url, cover_url],
    );

    await connection.execute(
      `
      INSERT INTO restaurant_managers (user_id, restaurant_id, role)
      VALUES (?, ?, ?)
    `,
      [userIds.shift(), restaurant_id, "owner"],
    );

    const schedules = [];
    for (let day = 0; day <= 6; day++) {
      const openingHour = faker.number.int({ min: 6, max: 10 }).toString().padStart(2, "0");
      const openingMinute = faker.number.int({ min: 0, max: 59 }).toString().padStart(2, "0");
      const openingTime = `${openingHour}:${openingMinute}:00`;

      const closingHour = faker.number.int({ min: 20, max: 23 }).toString().padStart(2, "0");
      const closingMinute = faker.number.int({ min: 0, max: 59 }).toString().padStart(2, "0");
      const closingTime = `${closingHour}:${closingMinute}:00`;

      const isClosed = faker.datatype.boolean({ probability: 0.1 }); // 10%  đóng cửa cả ngày

      schedules.push([restaurant_id, day.toString(), openingTime, closingTime, isClosed]);
    }

    await connection.query(
      `
      INSERT INTO restaurant_schedules (restaurant_id, day_of_week, opening_time, closing_time, is_closed)
      VALUES ?
    `,
      [schedules],
    );

    // console.log(`✅ Inserted restaurant: ${NUMBER_OF_RESTAURANTS} with random schedules`);
  }
  console.log(`✅ Inserted ${NUMBER_OF_RESTAURANTS} restaurants with random schedules`);
};

const createRestaurantManagers = async () => {
  const usedUserIds = new Set();

  while (usedUserIds.size < userIds.length) {
    const user_id = userIds[Math.floor(Math.random() * userIds.length)];
    if (usedUserIds.has(user_id)) continue;

    const restaurant_id = restaurantIds[Math.floor(Math.random() * restaurantIds.length)];
    const role = faker.helpers.arrayElement(["manager", "staff"]);

    await connection.execute(
      `
      INSERT INTO restaurant_managers (user_id, restaurant_id, role)
      VALUES (?, ?, ?)
    `,
      [user_id, restaurant_id, role],
    );

    usedUserIds.add(user_id);
  }

  console.log(`✅ Inserted ${usedUserIds.size} restaurant managers`);
};

const createFoodCategories = async () => {
  for (const restaurant_id of restaurantIds) {
    const numCategories = faker.number.int({ min: 15, max: 30 }); // Mỗi nhà hàng có 5-10 danh mục

    const existingCategories = new Set(); // Để lưu danh mục đã tạo cho nhà hàng

    for (let i = 0; i < numCategories; i++) {
      let name;
      do {
        name = faker.helpers.arrayElement(FOOD_CATEGORIES);
      } while (existingCategories.has(name)); // Chọn lại nếu trùng

      existingCategories.add(name);
      const food_category_id = nanoidNumbersOnly();

      await connection.execute(`INSERT INTO food_categories (food_category_id, restaurant_id, name) VALUES (?, ?, ?)`, [
        food_category_id,
        restaurant_id,
        name,
      ]);
    }
  }
  console.log(`✅ Created food categories with diverse options`);
};

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

function getRandomImage() {
  const files = fs.readdirSync(imagesDir);
  if (files.length === 0) throw new Error("No images found in images/ directory");

  const randomFile = files[Math.floor(Math.random() * files.length)];
  console.log(randomFile);
  return path.join(imagesDir, randomFile);
}

const imagesDir = path.join(process.cwd(), "images");

const usedFileNames = new Set();

async function uploadRandomImage(restaurantId, foodId) {
  let imagePath, fileBuffer, fileSize, fileMimeType, fileName, objectName;
  let attempt = 0;

  do {
    imagePath = getRandomImage();
    fileBuffer = fs.readFileSync(imagePath);
    fileSize = fileBuffer.length;
    fileMimeType = mime.lookup(imagePath) || "application/octet-stream";

    const parsedPath = path.parse(imagePath); // Tách phần mở rộng
    fileName = parsedPath.name; // Lấy tên file không có đuôi mở rộng

    if (usedFileNames.has(`${restaurantId}-${fileName}`)) {
      attempt++;
      fileName = `${parsedPath.name}-${attempt}`; // Thêm số nếu trùng
    }
  } while (usedFileNames.has(`${restaurantId}-${fileName}`));

  usedFileNames.add(`${restaurantId}-${fileName}`);

  objectName = `${restaurantId}/food/${foodId}/${fileName}${path.extname(imagePath)}`; // Giữ nguyên file khi upload

  const fileUrl = await uploadFileFood(objectName, {
    buffer: fileBuffer,
    size: fileSize,
    mimetype: fileMimeType,
  });

  return {
    url: fileUrl,
    name: fileName, // Chỉ trả về tên file, bỏ phần mở rộng
  };
}

const createFoods = async () => {
  for (let i = 0; i < NUMBER_OF_RESTAURANTS; i++) {
    for (let j = 0; j < NUMBER_OF_FOODS_PER_RESTAURANT; j++) {
      const food_id = nanoidNumbersOnly();
      const restaurant_id = restaurantIds[Math.floor(Math.random() * restaurantIds.length)];

      const description = faker.lorem.sentences(2);
      const price = faker.number.int({ min: 10000, max: 500000 }) & ~1;
      const { url: image_url, name } = await uploadRandomImage(restaurant_id, food_id);
      const price_type = "VND";
      // const name = faker.helpers.arrayElement(generateUniqueFoods());

      console.log(image_url, name);
      const available = faker.datatype.boolean();

      await connection.execute(
        `
        INSERT INTO foods (food_id, restaurant_id, name, description, price, price_type, image_url, available)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [food_id, restaurant_id, name, description, price, price_type, image_url, available],
      );
      foodIds.push(food_id);

      const [categories] = await connection.execute(
        `SELECT food_category_id FROM food_categories WHERE restaurant_id = ?`,
        [restaurant_id],
      );

      if (categories.length > 0) {
        const selectedCategories = faker.helpers.arrayElements(categories, faker.number.int({ min: 1, max: 2 }));

        for (const category of selectedCategories) {
          await connection.execute(`INSERT INTO food_category_mapping (food_id, food_category_id) VALUES (?, ?)`, [
            food_id,
            category.food_category_id,
          ]);
        }
      }
    }
  }
  console.log(`✅ Inserted ${NUMBER_OF_RESTAURANTS * NUMBER_OF_FOODS_PER_RESTAURANT} foods with categories`);
};

const createTablesReservationsAndBills = async ({
  numTablesPerRestaurant = { min: 5, max: 15 },
  numReservationsPerTable = { min: 1, max: 5 },
  numBillItemsPerReservation = { min: 1, max: 5 },
} = {}) => {
  for (const restaurant_id of restaurantIds) {
    const numTables = faker.number.int(numTablesPerRestaurant);
    const tableIds = [];

    // ✅ Tạo danh sách bàn ăn
    for (let i = 0; i < numTables; i++) {
      const table_id = nanoidNumbersOnly();
      tableIds.push(table_id);
      const table_name = `Bàn ${i + 1}`;
      const seat_count = faker.number.int({ min: 2, max: 10 });

      await connection.execute(
        `INSERT INTO tables (table_id, table_name, restaurant_id, seat_count) VALUES (?, ?, ?, ?)`,
        [table_id, table_name, restaurant_id, seat_count],
      );
    }

    for (const table_id of tableIds) {
      const numReservations = faker.number.int(numReservationsPerTable);

      for (let i = 0; i < numReservations; i++) {
        if (userIds.length === 0) {
          console.log("❌ Not enough users for reservations");
          return;
        }

        const reservation_id = nanoidNumbersOnly();
        const user_id = faker.helpers.arrayElement(userIds);
        if (!user_id) {
          console.error("❌ Lỗi: Không có user_id");
          continue;
        }

        const reservation_datetime = faker.date.future();
        const check_in_time = faker.date.between({
          from: reservation_datetime,
          to: new Date(reservation_datetime.getTime() + 3600000),
        });
        const reservation_status = faker.helpers.arrayElement(["pending", "confirmed", "completed", "cancelled"]);

        await connection.execute(
          `INSERT INTO reservations (reservation_id, restaurant_id, user_id, table_id, reservation_datetime, check_in_time, reservation_status)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [reservation_id, restaurant_id, user_id, table_id, reservation_datetime, check_in_time, reservation_status],
        );

        // ✅ Xác định order_status dựa trên reservation_status
        const order_status =
          reservation_status === "pending"
            ? "pending"
            : reservation_status === "confirmed"
              ? "preparing"
              : reservation_status === "completed"
                ? "completed"
                : "canceled";

        const bill_id = nanoidNumbersOnly();
        const payment_method = faker.helpers.arrayElement(["cash", "card", "online", "postpaid"]);
        const online_provider = payment_method === "online" ? faker.helpers.arrayElement(["momo", "zalopay"]) : null;
        const payment_status = reservation_status === "completed" ? "paid" : "unpaid";
        // ✅ Chèn bill trước, `total_amount` ban đầu là 0
        await connection.execute(
          `INSERT INTO bills (bill_id, restaurant_id, user_id, reservation_id, order_status, online_provider,  payment_method, payment_status, total_amount)
           VALUES (?, ?, ?, ?, ?,?, ?, ?, ?)`,
          [
            bill_id,
            restaurant_id,
            user_id,
            reservation_id,
            order_status,
            online_provider,
            payment_method,
            payment_status,
            0,
          ],
        );

        const billItems = [];

        // ✅ Chỉ thêm món ăn nếu reservation đã được xác nhận hoặc hoàn thành
        if (["confirmed", "completed"].includes(reservation_status)) {
          const numBillItems = faker.number.int(numBillItemsPerReservation);

          for (let j = 0; j < numBillItems; j++) {
            const bill_item_id = nanoidNumbersOnly();
            const food_id = foodIds[Math.floor(Math.random() * foodIds.length)];

            if (!food_id) {
              console.error("❌ Lỗi: Không có food_id");
              continue;
            }

            const [[food]] = await connection.execute(`SELECT name, price FROM foods WHERE food_id = ?`, [food_id]);

            if (!food || !food.name || food.price === undefined) {
              console.error(`❌ Food item với ID ${food_id} không tồn tại hoặc bị lỗi.`);
              continue;
            }

            const quantity = faker.number.int({ min: 1, max: 5 });
            billItems.push([bill_item_id, bill_id, food_id, food.price, food.name, quantity]);
          }

          // ✅ Chèn bill items vào DB
          if (billItems.length > 0) {
            await connection.query(
              `INSERT INTO bill_items (bill_item_id, bill_id, food_id, price_at_purchase, name_at_purchase, quantity)
               VALUES ?`,
              [billItems],
            );

            // ✅ Cập nhật lại `total_amount` từ `bill_items`
            await connection.execute(
              `
              UPDATE bills
              SET total_amount = (
                SELECT COALESCE(SUM(price_at_purchase * quantity), 0)
                FROM bill_items
                WHERE bill_id = ?
              )
              WHERE bill_id = ?
              `,
              [bill_id, bill_id],
            );
          }
        }
      }
    }
  }
  console.log(`✅ Inserted tables, reservations, bills, and bill items`);
};

const foodSearchQueries = [
  // Các món ăn sáng
  "bánh mì",
  "bánh mì chả lụa",
  "bánh mì trứng",
  "bánh mì thịt nướng",
  "bánh cuốn",
  "bún bò Huế",
  "phở bò",
  "phở gà",
  "bún chả",
  "xôi xéo",
  "xôi gà",
  "xôi lạp xưởng",
  "xôi bắp",
  "bánh ướt",
  "hủ tiếu",
  "mì quảng",
  "bánh canh",
  "bánh bèo",
  "bún riêu cua",
  "bánh đúc nóng",
  "bánh hỏi lòng heo",

  // Các món ăn trưa
  "cơm tấm",
  "cơm sườn",
  "cơm gà Hội An",
  "cơm chiên dương châu",
  "cơm hến",
  "bún thịt nướng",
  "bún đậu mắm tôm",
  "bún mắm",
  "bún cá",
  "bún bò Nam Bộ",
  "mì vịt tiềm",
  "cơm gà xối mỡ",
  "cơm niêu",
  "cơm rang",
  "cơm trộn Hàn Quốc",
  "cơm cá kho",
  "cơm chay",

  // Các món ăn tối
  "bánh xèo",
  "bánh khọt",
  "nem lụi",
  "gỏi cuốn",
  "chả cá lã vọng",
  "chả giò",
  "gà nướng",
  "gà bó xôi",
  "mì cay",
  "bò né",
  "bò kho",
  "bánh tráng nướng",
  "bánh căn",
  "bánh tráng trộn",
  "bánh tráng cuốn",

  // Hải sản & món nhậu
  "lẩu thái",
  "lẩu hải sản",
  "lẩu bò",
  "lẩu gà lá é",
  "lẩu cá kèo",
  "lẩu cua đồng",
  "cá lóc nướng trui",
  "tôm hùm",
  "cua rang me",
  "ghẹ hấp bia",
  "ốc hương",
  "ốc len xào dừa",
  "sò huyết",
  "sò điệp nướng mỡ hành",
  "nghêu hấp sả",
  "bò nhúng dấm",
  "gỏi gà",
  "gỏi bò bóp thấu",
  "chân gà nướng",
  "dê nướng",
  "dê hấp tía tô",
  "lòng nướng",
  "lòng xào nghệ",
  "bò tái chanh",

  // Đồ ăn nhanh
  "pizza",
  "hamburger",
  "gà rán",
  "khoai tây chiên",
  "mì cay Hàn Quốc",
  "tokbokki",
  "hotdog phô mai",
  "ramen",
  "takoyaki",
  "sushi",
  "cá viên chiên",
  "bánh gạo cay",
  "gà sốt cay Hàn Quốc",
  "bánh mì que",

  // Đồ uống & tráng miệng
  "trà sữa",
  "chè khúc bạch",
  "chè bưởi",
  "chè thập cẩm",
  "chè trôi nước",
  "sâm bổ lượng",
  "nước mía",
  "trà đào cam sả",
  "cà phê sữa đá",
  "bạc xỉu",
  "sinh tố bơ",
  "sinh tố xoài",
  "sinh tố dâu",
  "sữa chua nếp cẩm",
  "kem dừa",
  "kem flan",
  "bánh flan",
  "bánh bông lan trứng muối",
  "bánh su kem",
  "bánh crepe sầu riêng",
  "bánh mousse chanh dây",
  "bánh tiramisu",
  "bánh donut",
  "bánh tart trứng",
];

const createRandomSearchHistory = async () => {
  for (const userId of userIds) {
    const numberOfSearches = faker.number.int({ min: 40, max: 100 });
    const searchSet = new Set();

    for (let i = 0; i < numberOfSearches; i++) {
      searchSet.add(faker.helpers.arrayElement(foodSearchQueries));
    }

    for (const searchQuery of searchSet) {
      const normalizedQuery = removeDiacritics(searchQuery);

      await connection.query(
        `INSERT INTO search_history (user_id, search_query, search_query_normalized) 
         VALUES (?, ?, ?) 
         ON DUPLICATE KEY UPDATE created_at = NOW(), search_query_normalized = ?`,
        [userId, searchQuery, normalizedQuery, normalizedQuery],
      );
    }
  }

  console.log("✅ Inserted random search history");
};

const seedDatabase = async (password) => {
  try {
    await connection.beginTransaction();
    await createUsers(password);
    await createAddresses();
    await createRestaurants();
    await createRestaurantManagers();
    await createFoodCategories();
    await createFoods();
    await createTablesReservationsAndBills();
    await createRandomSearchHistory();
    await connection.commit();
    console.log("🎉 Seeding complete!");
  } catch (error) {
    await connection.rollback();
    console.error("❌ lỗi khi ghi dữ liệu (lệnh đã được hoàn tác)", error);
  } finally {
    await connection.end();
  }
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// const icons = [
//   "✅", "!", "❌", "🔴", "🟢", "🟡", "🔵", "🔶", "🔷", "⬜", "⬛",
//   "⭐", "🌟", "💡", "🔥", "⚡", "🔔", "🔕", "📢", "📣", "📌", "📍",
//   "🔒", "🔓", "🔑", "✉", "📧", "📨", "📤", "📥", "🗑", "🖊",
//   "📅", "📆", "⏰", "⏳", "📊", "📈", "📉", "⚙", "🧲", "🔧", "🔨",
//   "🧩", "🔗", "🖇", "📎", "🔍", "🔎", "🛠", "🧰", "🛡", "🚀", "🧹"
// ];
//
// icons.forEach(icon => console.log(icon));
//

const start = () => {
  let password = "cdio@team1";
  const hasYFlag = process.argv.includes("-y");

  const proceed = () => {
    console.log("🚀 Đang ghi dữ liệu...");
    seedDatabase(password).finally(() => rl.close());
  };

  const askPassword = () => {
    rl.question("🔑 Mật khẩu (Enter để dùng mặc định [cdio@team1]): ", (inputPassword) => {
      password = inputPassword || password;
      proceed();
    });
  };

  if (hasYFlag) {
    askPassword();
  } else {
    rl.question("📣 Ghi dữ liệu? (y/N): ", (answer) => {
      if (answer.toLowerCase() === "y") {
        askPassword();
      } else {
        console.log("❌ Đã hủy.");
        rl.close();
      }
    });
  }
};

start();
