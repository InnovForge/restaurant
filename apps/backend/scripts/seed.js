import mysql from "mysql2/promise";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import dotenvFlow from "dotenv-flow";
import { nanoidNumbersOnly } from "../src/utils/nanoid.js";
import readline from "readline";
import { generateUniqueFoods } from "./generate/food.js";

dotenvFlow.config();

const connection = await mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
});

const NUMBER_OF_USERS = 30;
const NUMBER_OF_RESTAURANTS = Math.floor(NUMBER_OF_USERS / 3);
const NUMBER_OF_FOODS_PER_RESTAURANT = 20;
const NUMBER_OF_BILLS = 200;

const userIds = [];
const addressIds = [];
const restaurantIds = [];

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
  }
  console.log(`✅ Inserted ${NUMBER_OF_USERS} users`);
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
  }
  console.log(`✅ Inserted ${NUMBER_OF_RESTAURANTS} restaurants`);
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

const createFoods = async () => {
  for (let i = 0; i < NUMBER_OF_RESTAURANTS; i++) {
    for (let j = 0; j < NUMBER_OF_FOODS_PER_RESTAURANT; j++) {
      const food_id = nanoidNumbersOnly();
      const restaurant_id = restaurantIds[Math.floor(Math.random() * restaurantIds.length)];
      const name = faker.helpers.arrayElement(generateUniqueFoods());

      const description = faker.lorem.sentences(2);
      const price = faker.number.float({
        min: 10000,
        max: 500000,
        precision: 1000,
      });
      const price_type = "VND";
      const image_url = faker.image.urlLoremFlickr({ width: 400, height: 300 });

      const available = faker.datatype.boolean();

      await connection.execute(
        `
        INSERT INTO foods (food_id, restaurant_id, name, description, price, price_type, image_url, available)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [food_id, restaurant_id, name, description, price, price_type, image_url, available],
      );
    }
  }
  console.log(`✅ Inserted ${NUMBER_OF_RESTAURANTS * NUMBER_OF_FOODS_PER_RESTAURANT} foods`);
};

const createBill = async () => {
  for (let i = 0; i < NUMBER_OF_BILLS; i++) {
    const bill_id = nanoidNumbersOnly();
    const restaurant_id = restaurantIds[Math.floor(Math.random() * restaurantIds.length)];
    const user_id = userIds[Math.floor(Math.random() * userIds.length)];
    const order_status = faker.helpers.arrayElement(["pending", "preparing", "completed", "canceled"]);
    const quantity = faker.number.int({ min: 1, max: 10 });

    const [foods] = await connection.execute(
      `
      SELECT food_id 
      FROM foods 
      WHERE restaurant_id = ?
    `,
      [restaurant_id],
    );

    if (foods.length === 0) continue;

    const food_id = foods[Math.floor(Math.random() * foods.length)].food_id;

    await connection.execute(
      `
      INSERT INTO bills (bill_id, restaurant_id, user_id, order_status)
      VALUES (?, ?, ?, ?)
    `,
      [bill_id, restaurant_id, user_id, order_status],
    );

    await connection.execute(
      `
      INSERT INTO bill_items (bill_item_id, bill_id, food_id, quantity)
      VALUES (?,?, ?, ?)
    `,
      [nanoidNumbersOnly(), bill_id, food_id, quantity],
    );
  }
  console.log(`✅ Inserted ${NUMBER_OF_BILLS} bills`);
};

const seedDatabase = async (password) => {
  try {
    await connection.beginTransaction();
    await createUsers(password);
    await createAddresses();
    await createRestaurants();
    await createRestaurantManagers();
    await createFoods();
    await createBill();
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
