import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const orders = [
  { id: 1, customer: 'John Doe', items: 3, total: 45.97, status: 'Completed' },
  { id: 2, customer: 'Jane Smith', items: 2, total: 29.98, status: 'In Progress' },
  { id: 3, customer: 'Bob Johnson', items: 1, total: 12.99, status: 'Pending' },
  { id: 4, customer: 'Alice Brown', items: 4, total: 67.96, status: 'Completed' },
]

export default function OrdersPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Order Tracking</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.items}</TableCell>
              <TableCell>${order.total.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant={order.status === 'Completed' ? 'success' : order.status === 'In Progress' ? 'warning' : 'default'}>
                  {order.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

