import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const Landing = () => {
  const items = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);
  return (
    <div>
      <Button>
        <Link to="/home">Đi tới trang chính</Link>
      </Button>
      <h1>this is page home</h1>
      {items.map((item) => (
        <div key={item}>{item}</div>
      ))}
    </div>
  );
};

export default Landing;
