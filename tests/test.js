import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 1000,
  duration: "1m",
};

export default function () {
  const res = http.get("http://localhost:90/api/api/v1/foods?latitude=16.0345189&longitude=108.2205302&radius=20000&page=1&filter=nearby");

  check(res, {
    "status là 200": (r) => r.status === 200,
  });

  sleep(1);
}

