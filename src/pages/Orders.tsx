import { ArrowLeft, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BottomNav } from "@/components/BottomNav";

import hoodieImg from "@/assets/hoodie.jpg";
import tshirtImg from "@/assets/tshirt.jpg";
import sneakersImg from "@/assets/sneakers.jpg";
import { OrderService } from "@/data/services/order.service";
import { IOrder } from "@/data/models/order.model";
import { useEffect, useState } from "react";
import { RESOURCE_URL } from "@/data/constants/constants";


const statusColors = {
  delivered: "bg-green-500/20 text-green-500 border-green-500/20",
  processing: "bg-yellow-500/20 text-yellow-500 border-yellow-500/20",
  pending: "bg-yellow-500/20 text-yellow-500 border-yellow-500/20",
  shipped: "bg-purple-500/20 text-purple-500 border-purple-500/20",
};

const Orders = () => {
  const navigate = useNavigate();

  const [orderList, setOrderList] = useState<IOrder[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");



  const getAllOrders = () => {
    try {
      OrderService.getListasync().then((response) => {
        setOrderList(response.data);
      },
        (error) => {
          console.log(error);
        }
      )
    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    getAllOrders();
  }, [])

  const getFilteredOrders = () => {
    if (filterStatus === "all") {
      return orderList;
    }
    return orderList.filter(order => order.status === filterStatus);
  };



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
          {/* Filter Tabs */}
          <div className="mb-6">
            <Tabs value={filterStatus} onValueChange={setFilterStatus}>
              <TabsList className="grid w-full grid-cols-4 gap-2">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="shipped">Shipped</TabsTrigger>
                <TabsTrigger value="delivered">Delivered</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {getFilteredOrders().length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No orders found</p>
              <Button onClick={() => navigate('/')} size="lg">
                Shop Now
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredOrders()?.map((order) => (
                <Card key={order._id} className="p-4 bg-card border-border flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{order._id}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(order.orderDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>

                    </div>
                    <Badge className={statusColors[order.status]}>
                      {order.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-3 flex-1">
                    {order?.items?.map((item) => (
                      <div key={item.inventoryId._id} className="flex gap-3">
                        <img
                          src={RESOURCE_URL + '' + item.inventoryId.item.images[0]}
                          alt={item.inventoryId.item.name}
                          className="w-16 h-16 object-cover rounded-lg bg-secondary/50"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-foreground">{item.inventoryId.item.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">Qty: {item.qty}</p>
                          <p className="text-sm font-semibold text-foreground mt-1">
                            ${item.inventoryId.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border mt-4 pt-4 space-y-3">
                    <div className="flex justify-between text-foreground">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold">${order.totalAmount.toFixed(2)}</span>
                    </div>
                    {(order.status === "shipped" || order.status === "delivered") && (
                      <Button
                        onClick={() => navigate(`/tracking/${order._id}`)}
                        className="w-full"
                        variant="outline"
                      >
                        <Package className="w-4 h-4 mr-2" />
                        Track Shipment
                      </Button>
                    )}
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
