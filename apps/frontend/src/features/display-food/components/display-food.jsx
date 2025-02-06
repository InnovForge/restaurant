import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const DisplayFood = () => {
  const data = [
    {
      id: 1,
      name: "Burger king vietnam, Burger king vietnam, Burger king vietnam",
      price: 10,
    },
    {
      id: 2,
      name: "Pizza",
      price: 20,
    },
    {
      id: 4,
      name: "Pasta",
      price: 15,
    },
    {
      id: 5,
      name: "Pizza",
      price: 20,
    },
    {
      id: 6,
      name: "Pasta",
      price: 15,
    },
  ];
  return (
    <div className="grid grid-cols-4 gap-2">
      {data.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle className="text-wrap">{item.name}</CardTitle>
            <CardDescription>{item.price}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default DisplayFood;
