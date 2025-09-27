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
import cliProgress from "cli-progress";
import { uploadFileFood } from "../src/utils/s3.js";
dotenvFlow.config();

const connection = await mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
});

const TOTAL_FOODS_TARGET = 1000000;
const FOODS_PER_RESTAURANT = 100;
const NUMBER_OF_RESTAURANTS = Math.ceil(TOTAL_FOODS_TARGET / FOODS_PER_RESTAURANT);
const NUMBER_OF_USERS = NUMBER_OF_RESTAURANTS * 3;
const NUMBER_OF_BILLS = 200;

const userIds = [];
const addressIds = [];
const restaurantIds = [];
const foodIds = [];

const USER_BATCH = 10000;

export async function createUsers(connection, pass = "cdio@team1") {
  const hashPassword = await bcrypt.hash(pass, 10);
  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  bar.start(NUMBER_OF_USERS, 0);

  for (let i = 0; i < NUMBER_OF_USERS; i += USER_BATCH) {
    const usersChunk = [];
    const addressesChunk = [];
    const userAddressesChunk = [];

    for (let j = 0; j < USER_BATCH && i + j < NUMBER_OF_USERS; j++) {
      const user_id = nanoidNumbersOnly();
      userIds.push(user_id);

      let baseUsername = faker.internet.username().toLowerCase();
      const suffix = faker.number.int({ min: 1000, max: 9999 }).toString();
      const username = (baseUsername + suffix).slice(0, 30);

      // user
      usersChunk.push([
        user_id,
        faker.person.fullName(),
        faker.number.int({ min: 0, max: 2 }),
        username,
        hashPassword,
        faker.internet.email(),
        faker.image.avatar(),
        faker.phone.number({ style: "international" }),
      ]);

      // address(es)
      const numAddresses = faker.number.int({ min: 1, max: 5 });
      for (let k = 0; k < numAddresses; k++) {
        const address_id = nanoidNumbersOnly();
        addressesChunk.push([
          address_id,
          faker.location.streetAddress(),
          faker.datatype.boolean() ? faker.location.secondaryAddress() : null,
          parseFloat(faker.location.longitude({ min: 108.1, max: 108.3 })),
          parseFloat(faker.location.latitude({ min: 15.95, max: 16.15 })),
        ]);
        userAddressesChunk.push([
          nanoidNumbersOnly(),
          address_id,
          user_id,
          faker.phone.number({ style: "international" }),
          k === 0, // địa chỉ đầu tiên là default
        ]);
      }
    }

    try {
      await connection.beginTransaction();

      if (usersChunk.length)
        await connection.query(
          `INSERT INTO users (user_id, name, gender, username, password, email, avatar_url, phone_number) VALUES ?`,
          [usersChunk],
        );

      if (addressesChunk.length)
        await connection.query(
          `INSERT INTO addresses (address_id, address_line1, address_line2, longitude, latitude) VALUES ?`,
          [addressesChunk],
        );

      if (userAddressesChunk.length)
        await connection.query(
          `INSERT INTO user_addresses (user_address_id, address_id, user_id, phone_number, is_default) VALUES ?`,
          [userAddressesChunk],
        );

      await connection.commit();
    } catch (err) {
      await connection.rollback();
      console.error("❌ Lỗi khi insert batch users:", err);
      throw err;
    }

    bar.update(Math.min(i + USER_BATCH, NUMBER_OF_USERS));
  }

  bar.stop();
  console.log(`✅ Inserted ${NUMBER_OF_USERS} users (batch mode)`);
}

const createAddresses = async (batchSize = 15000) => {
  const addressesToInsert = [];
  const progressBar = new cliProgress.SingleBar({
    format: "Seeding address |{bar}| {percentage}% || {value}/{total} address restaurant",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });

  progressBar.start(NUMBER_OF_RESTAURANTS, 0);

  for (let i = 0; i < NUMBER_OF_RESTAURANTS; i++) {
    const address_id = nanoidNumbersOnly();
    addressIds.push(address_id);

    const address_line1 = faker.location.streetAddress();
    const address_line2 = faker.location.secondaryAddress();
    const longitude = parseFloat(faker.location.longitude({ min: 108.1, max: 108.3 }));
    const latitude = parseFloat(faker.location.latitude({ min: 15.95, max: 16.15 }));

    addressesToInsert.push([address_id, address_line1, address_line2, longitude, latitude]);

    if (addressesToInsert.length >= batchSize) {
      await insertAddressBatch();
    }
    progressBar.update(i + 1);
  }

  if (addressesToInsert.length > 0) await insertAddressBatch();

  progressBar.stop();

  async function insertAddressBatch() {
    await connection.beginTransaction();
    try {
      if (addressesToInsert.length) {
        await connection.query(
          `INSERT INTO addresses (address_id, address_line1, address_line2, longitude, latitude) VALUES ?`,
          [addressesToInsert],
        );
      }
      await connection.commit();
      addressesToInsert.length = 0; // reset batch
    } catch (err) {
      await connection.rollback();
      console.error("❌ Lỗi khi insert batch addresses:", err);
    }
  }
};

const createRestaurants = async (batchSize = 6000) => {
  const restaurantsToInsert = [];
  const restaurantManagersToInsert = [];
  const restaurantSchedulesToInsert = [];
  const assignedOwners = new Set(); // track owner đã dùng cho 1 nhà hàng

  for (let i = 0; i < NUMBER_OF_RESTAURANTS; i++) {
    if (addressIds.length === 0) {
      console.log("❌ Not enough addresses to assign as restaurant address");
      break;
    }

    const restaurant_id = nanoidNumbersOnly();
    restaurantIds.push(restaurant_id);
    const name = faker.company.name();
    const address_id = addressIds.shift();
    const description = faker.lorem.sentences(3);
    const phone_number = faker.phone.number({ style: "international" });
    const logo_url = faker.image.urlPicsumPhotos({ width: 200, height: 200 });
    const cover_url = faker.image.urlPicsumPhotos({ width: 800, height: 400 });

    restaurantsToInsert.push([restaurant_id, name, description, address_id, phone_number, logo_url, cover_url]);

    restaurantManagersToInsert.push([userIds.shift(), restaurant_id, "owner"]);

    // Tạo lịch mở cửa cho 7 ngày
    for (let day = 0; day <= 6; day++) {
      const openingHour = faker.number.int({ min: 6, max: 10 }).toString().padStart(2, "0");
      const openingMinute = faker.number.int({ min: 0, max: 59 }).toString().padStart(2, "0");
      const openingTime = `${openingHour}:${openingMinute}:00`;

      const closingHour = faker.number.int({ min: 20, max: 23 }).toString().padStart(2, "0");
      const closingMinute = faker.number.int({ min: 0, max: 59 }).toString().padStart(2, "0");
      const closingTime = `${closingHour}:${closingMinute}:00`;

      const isClosed = faker.datatype.boolean({ probability: 0.1 });

      restaurantSchedulesToInsert.push([restaurant_id, day.toString(), openingTime, closingTime, isClosed]);
    }

    // Batch insert
    if (restaurantsToInsert.length >= batchSize || i === NUMBER_OF_RESTAURANTS - 1) {
      await connection.beginTransaction();
      try {
        if (restaurantsToInsert.length > 0) {
          await connection.query(
            `INSERT INTO restaurants (restaurant_id, name, description, address_id, phone_number, logo_url, cover_url) VALUES ?`,
            [restaurantsToInsert],
          );
        }
        if (restaurantManagersToInsert.length > 0) {
          await connection.query(`INSERT INTO restaurant_managers (user_id, restaurant_id, role) VALUES ?`, [
            restaurantManagersToInsert,
          ]);
        }
        if (restaurantSchedulesToInsert.length > 0) {
          await connection.query(
            `INSERT INTO restaurant_schedules (restaurant_id, day_of_week, opening_time, closing_time, is_closed) VALUES ?`,
            [restaurantSchedulesToInsert],
          );
        }

        await connection.commit();
        restaurantsToInsert.length = 0;
        restaurantManagersToInsert.length = 0;
        restaurantSchedulesToInsert.length = 0;
      } catch (error) {
        await connection.rollback();
        console.error("❌ Lỗi khi insert batch restaurants:", error);
      }
    }
  }

  console.log(`✅ Inserted ${NUMBER_OF_RESTAURANTS} restaurants with random schedules (batch)`);
};

const createRestaurantManagers = async (batchSize = 15000) => {
  const managersToInsert = [];
  const availableUserIds = [...userIds]; // copy để không ảnh hưởng gốc

  for (const restaurant_id of restaurantIds) {
    // random số lượng staff/manager (1–3)
    const numberOfStaff = faker.number.int({ min: 1, max: 3 });

    for (let i = 0; i < numberOfStaff; i++) {
      if (availableUserIds.length === 0) {
        console.warn("! Hết userIds để gán role!");
        break;
      }

      // lấy user random rồi xóa khỏi danh sách
      const idx = faker.number.int({
        min: 0,
        max: availableUserIds.length - 1,
      });
      const [user_id] = availableUserIds.splice(idx, 1);

      const role = faker.helpers.arrayElement(["manager", "staff"]);
      managersToInsert.push([user_id, restaurant_id, role]);
    }

    // batch insert
    if (managersToInsert.length >= batchSize) {
      try {
        await connection.query(`INSERT INTO restaurant_managers (user_id, restaurant_id, role) VALUES ?`, [
          managersToInsert,
        ]);
        managersToInsert.length = 0;
      } catch (error) {
        console.error("❌ Lỗi khi insert batch restaurant managers:", error);
      }
    }
  }

  // insert phần còn lại
  if (managersToInsert.length > 0) {
    try {
      await connection.query(`INSERT INTO restaurant_managers (user_id, restaurant_id, role) VALUES ?`, [
        managersToInsert,
      ]);
    } catch (error) {
      console.error("❌ Lỗi khi insert phần còn lại:", error);
    }
  }

  console.log("✅ Inserted managers/staff (1–3 per restaurant)");
};

const createFoodCategories = async (batchSize = 5000) => {
  const categoriesToInsert = [];

  for (const restaurant_id of restaurantIds) {
    const numCategories = faker.number.int({ min: 15, max: 30 });
    const existingCategories = new Set();

    for (let i = 0; i < numCategories; i++) {
      let name;
      do {
        name = faker.helpers.arrayElement(FOOD_CATEGORIES);
      } while (existingCategories.has(name));
      existingCategories.add(name);

      const food_category_id = nanoidNumbersOnly();
      categoriesToInsert.push([food_category_id, restaurant_id, name]);

      if (categoriesToInsert.length >= batchSize) {
        await connection.beginTransaction();
        try {
          await connection.query(`INSERT INTO food_categories (food_category_id, restaurant_id, name) VALUES ?`, [
            categoriesToInsert,
          ]);
          await connection.commit();
          categoriesToInsert.length = 0;
        } catch (error) {
          await connection.rollback();
          console.error("❌ Lỗi khi insert batch food categories:", error);
        }
      }
    }
  }

  if (categoriesToInsert.length > 0) {
    await connection.beginTransaction();
    try {
      await connection.query(`INSERT INTO food_categories (food_category_id, restaurant_id, name) VALUES ?`, [
        categoriesToInsert,
      ]);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      console.error("❌ Lỗi khi insert final batch food categories:", error);
    }
  }

  console.log(`✅ Created food categories with diverse options (batch)`);
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

const insertFoodsBatchFast = async (foods, foodCategoryMappings, conn) => {
  if (foods.length > 0) {
    await conn.query(
      `INSERT INTO foods 
        (food_id, restaurant_id, name, description, price, price_type, image_url, available) 
       VALUES ?`,
      [foods],
    );
  }

  if (foodCategoryMappings.length > 0) {
    await conn.query(`INSERT INTO food_category_mapping (food_id, food_category_id) VALUES ?`, [foodCategoryMappings]);
  }
};

const createFoods = async (conn, batchSize = 30000) => {
  const totalFoods = NUMBER_OF_RESTAURANTS * FOODS_PER_RESTAURANT;
  let foodsInserted = 0;

  const progressBar = new cliProgress.SingleBar({
    format:
      "Seeding Foods |{bar}| {percentage}% || {value}/{total} foods || ETA: {eta_formatted} || Elapsed: {duration_formatted}",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });

  progressBar.start(totalFoods, 0);

  // ⚡ Disable FK & index
  await conn.query("SET FOREIGN_KEY_CHECKS=0;");
  await conn.query("ALTER TABLE foods DISABLE KEYS;");
  await conn.query("ALTER TABLE food_category_mapping DISABLE KEYS;");

  try {
    const [allCategories] = await conn.execute(`SELECT food_category_id, restaurant_id FROM food_categories`);

    // Map categories theo restaurant
    const categoryMap = new Map();
    for (const row of allCategories) {
      if (!categoryMap.has(row.restaurant_id)) {
        categoryMap.set(row.restaurant_id, []);
      }
      categoryMap.get(row.restaurant_id).push(row.food_category_id);
    }

    // ⚡ Pre-generate pool dữ liệu để tránh gọi faker nhiều
    const baseFoods = generateUniqueFoods();
    const descPool = Array.from({ length: 200 }, () => faker.lorem.sentences(2));
    const imagePool = Array.from({ length: 200 }, () => faker.image.urlPicsumPhotos({ width: 400, height: 400 }));

    let foodsToInsert = [];
    let foodCategoryMappings = [];

    for (let i = 0; i < NUMBER_OF_RESTAURANTS; i++) {
      const restaurant_id = restaurantIds[i];
      const categories = categoryMap.get(restaurant_id) || [];

      for (let j = 0; j < FOODS_PER_RESTAURANT; j++) {
        const baseName = baseFoods[j % baseFoods.length];
        const name = j < baseFoods.length ? baseName : `${baseName} (${j})`;

        const food_id = nanoidNumbersOnly();
        foodIds.push(food_id);

        foodsToInsert.push([
          food_id,
          restaurant_id,
          name,
          faker.helpers.arrayElement(descPool),
          faker.number.int({ min: 10000, max: 500000 }) & ~1,
          "VND",
          faker.helpers.arrayElement(imagePool),
          faker.datatype.boolean(),
        ]);

        if (categories.length > 0) {
          const selectedCategories = faker.helpers.arrayElements(categories, faker.number.int({ min: 1, max: 2 }));
          for (const catId of selectedCategories) {
            foodCategoryMappings.push([food_id, catId]);
          }
        }

        // ✅ Batch insert
        if (foodsToInsert.length >= batchSize) {
          await insertFoodsBatchFast(foodsToInsert, foodCategoryMappings, conn);
          foodsInserted += foodsToInsert.length;
          progressBar.update(Math.min(foodsInserted, totalFoods));

          foodsToInsert = [];
          foodCategoryMappings = [];
        }
      }
    }

    // Batch cuối
    if (foodsToInsert.length > 0) {
      await insertFoodsBatchFast(foodsToInsert, foodCategoryMappings, conn);
      foodsInserted += foodsToInsert.length;
      progressBar.update(totalFoods);
    }
  } finally {
    // ⚡ Re-enable FK & index
    await conn.query("ALTER TABLE foods ENABLE KEYS;");
    await conn.query("ALTER TABLE food_category_mapping ENABLE KEYS;");
    await conn.query("SET FOREIGN_KEY_CHECKS=1;");
  }

  progressBar.stop();
  console.log(`✅ Inserted ${totalFoods} foods with categories (unique per restaurant)`);
};

const createTablesReservationsAndBills = async ({
  numTablesPerRestaurant = { min: 5, max: 15 },
  numReservationsPerTable = { min: 1, max: 5 },
  numBillItemsPerReservation = { min: 1, max: 5 },
  batchSize = 5000,
} = {}) => {
  const tablesToInsert = [];
  const reservationsToInsert = [];
  const billsToInsert = [];
  const billItemsToInsert = [];

  for (const restaurant_id of restaurantIds) {
    const numTables = faker.number.int(numTablesPerRestaurant);
    const tableIds = [];

    // Tạo bàn ăn
    for (let i = 0; i < numTables; i++) {
      const table_id = nanoidNumbersOnly();
      tableIds.push(table_id);
      const table_name = `Bàn ${i + 1}`;
      const seat_count = faker.number.int({ min: 2, max: 10 });
      tablesToInsert.push([table_id, table_name, restaurant_id, seat_count]);
    }

    // Tạo reservations, bills và bill_items
    for (const table_id of tableIds) {
      const numReservations = faker.number.int(numReservationsPerTable);

      for (let i = 0; i < numReservations; i++) {
        if (userIds.length === 0) continue;
        const reservation_id = nanoidNumbersOnly();
        const user_id = faker.helpers.arrayElement(userIds);
        if (!user_id) continue;

        const reservation_datetime = faker.date.future();
        const check_in_time = faker.date.between({
          from: reservation_datetime,
          to: new Date(reservation_datetime.getTime() + 3600000),
        });
        const reservation_status = faker.helpers.arrayElement(["pending", "confirmed", "completed", "cancelled"]);

        reservationsToInsert.push([
          reservation_id,
          restaurant_id,
          user_id,
          table_id,
          reservation_datetime,
          check_in_time,
          reservation_status,
        ]);

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

        billsToInsert.push([
          bill_id,
          restaurant_id,
          user_id,
          reservation_id,
          order_status,
          online_provider,
          payment_method,
          payment_status,
          0, // total_amount tạm thời
        ]);

        if (["confirmed", "completed"].includes(reservation_status)) {
          const numBillItems = faker.number.int(numBillItemsPerReservation);
          for (let j = 0; j < numBillItems; j++) {
            const bill_item_id = nanoidNumbersOnly();
            const food_id = faker.helpers.arrayElement(foodIds);
            if (!food_id) continue;

            const [[food]] = await connection.execute(`SELECT name, price FROM foods WHERE food_id = ?`, [food_id]);
            if (!food || food.price === undefined) continue;

            const quantity = faker.number.int({ min: 1, max: 5 });
            billItemsToInsert.push([bill_item_id, bill_id, food_id, food.price, food.name, quantity]);
          }
        }

        // Batch insert nếu đủ batchSize
        if (
          tablesToInsert.length >= batchSize ||
          reservationsToInsert.length >= batchSize ||
          billsToInsert.length >= batchSize ||
          billItemsToInsert.length >= batchSize
        ) {
          await insertBatches(tablesToInsert, reservationsToInsert, billsToInsert, billItemsToInsert);
        }
      }
    }
  }

  await insertBatches(tablesToInsert, reservationsToInsert, billsToInsert, billItemsToInsert);

  console.log(`✅ Inserted tables, reservations, bills, and bill items (batch)`);
};

const insertBatches = async (tables, reservations, bills, billItems) => {
  if (tables.length === 0 && reservations.length === 0 && bills.length === 0 && billItems.length === 0) return;

  await connection.beginTransaction();
  try {
    if (tables.length > 0) {
      await connection.query(`INSERT INTO tables (table_id, table_name, restaurant_id, seat_count) VALUES ?`, [tables]);
      tables.length = 0;
    }
    if (reservations.length > 0) {
      await connection.query(
        `INSERT INTO reservations (reservation_id, restaurant_id, user_id, table_id, reservation_datetime, check_in_time, reservation_status) VALUES ?`,
        [reservations],
      );
      reservations.length = 0;
    }
    if (bills.length > 0) {
      await connection.query(
        `INSERT INTO bills (bill_id, restaurant_id, user_id, reservation_id, order_status, online_provider, payment_method, payment_status, total_amount) VALUES ?`,
        [bills],
      );
      bills.length = 0;
    }
    if (billItems.length > 0) {
      await connection.query(
        `INSERT INTO bill_items (bill_item_id, bill_id, food_id, price_at_purchase, name_at_purchase, quantity) VALUES ?`,
        [billItems],
      );
      billItems.length = 0;
    }

    // Cập nhật tổng amount cho bills
    await connection.query(`
      UPDATE bills b
      JOIN (
        SELECT bill_id, SUM(price_at_purchase * quantity) AS total_amount
        FROM bill_items
        GROUP BY bill_id
      ) bi ON b.bill_id = bi.bill_id
      SET b.total_amount = bi.total_amount
    `);

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    console.error("❌ Lỗi khi insert batch tables/reservations/bills:", err);
  }
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

const createRandomSearchHistory = async (batchSize = 5000) => {
  const rowsToInsert = [];

  for (const userId of userIds) {
    const numberOfSearches = faker.number.int({ min: 40, max: 100 });
    const searchSet = new Set();

    for (let i = 0; i < numberOfSearches; i++) {
      searchSet.add(faker.helpers.arrayElement(foodSearchQueries));
    }

    for (const searchQuery of searchSet) {
      const normalizedQuery = removeDiacritics(searchQuery);
      rowsToInsert.push([userId, searchQuery, normalizedQuery]);

      if (rowsToInsert.length >= batchSize) {
        await insertSearchHistoryBatch(rowsToInsert);
        rowsToInsert.length = 0;
      }
    }
  }

  // Chèn phần còn lại
  if (rowsToInsert.length > 0) {
    await insertSearchHistoryBatch(rowsToInsert);
  }

  console.log("✅ Inserted random search history (batch)");
};

const insertSearchHistoryBatch = async (rows) => {
  if (rows.length === 0) return;

  // MySQL batch insert với ON DUPLICATE KEY UPDATE
  const placeholders = rows.map(() => "(?, ?, ?)").join(",");
  const flatValues = rows.flat();

  const sql = `
    INSERT INTO search_history (user_id, search_query, search_query_normalized)
    VALUES ${placeholders}
    ON DUPLICATE KEY UPDATE 
      created_at = NOW(),
      search_query_normalized = VALUES(search_query_normalized)
  `;

  try {
    await connection.query(sql, flatValues);
  } catch (err) {
    console.error("❌ Lỗi khi insert batch search history:", err);
  }
};

const seedDatabase = async (password) => {
  try {
    await connection.beginTransaction();
    await createUsers(connection, password);
    await createAddresses();
    await createRestaurants();
    await createRestaurantManagers();
    await createFoodCategories();
    await createFoods(connection);
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
