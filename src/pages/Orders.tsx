import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";

import hoodieImg from "@/assets/hoodie.jpg";
import tshirtImg from "@/assets/tshirt.jpg";
import sneakersImg from "@/assets/sneakers.jpg";

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: "delivered" | "shipping" | "processing";
  total: number;
  items: {
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
  }[];
}

const orders: Order[] = [
  {
    id: "1",
    orderNumber: "#ORD-2024-001",
    date: "Jan 15, 2024",
    status: "delivered",
    total: 206.58,
    items: [
      { id: "1", name: "Graphic Hoodie", image: hoodieImg, quantity: 1, price: 110.59 },
      { id: "3", name: "Classic Sneakers", image: sneakersImg, quantity: 1, price: 95.99 },
    ],
  },
  {
    id: "2",
    orderNumber: "#ORD-2024-002",
    date: "Jan 20, 2024",
    status: "shipping",
    total: 80.09,
    items: [
      { id: "2", name: "Essential Tee", image: tshirtImg, quantity: 1, price: 80.09 },
    ],
  },
];

const statusColors = {
  delivered: "bg-green-500/20 text-green-500 border-green-500/20",
  shipping: "bg-blue-500/20 text-blue-500 border-blue-500/20",
  processing: "bg-yellow-500/20 text-yellow-500 border-yellow-500/20",
};

const Orders = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 bg-background border-b border-border z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">My Orders</h1>
          <div className="w-6" />
        </div>
      </header>

      <div className="px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No orders yet</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.map((order) => (
                <Card key={order.id} className="p-4 bg-card border-border flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{order.orderNumber}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{order.date}</p>
                    </div>
                    <Badge className={statusColors[order.status]}>
                      {order.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-3 flex-1">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg bg-secondary/50"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-foreground">{item.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                          <p className="text-sm font-semibold text-foreground mt-1">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border mt-4 pt-4">
                    <div className="flex justify-between text-foreground">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Orders;
