import { ArrowLeft, Package, MapPin, CheckCircle2, Clock } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { BottomNav } from "@/components/BottomNav";

interface TrackingEvent {
  status: string;
  location: string;
  date: string;
  time: string;
  completed: boolean;
}

const trackingData: Record<string, { orderNumber: string; carrier: string; trackingNumber: string; estimatedDelivery: string; events: TrackingEvent[] }> = {
  "1": {
    orderNumber: "#ORD-2024-001",
    carrier: "FedEx",
    trackingNumber: "FDX123456789",
    estimatedDelivery: "Jan 15, 2024",
    events: [
      { status: "Delivered", location: "New York, NY", date: "Jan 15, 2024", time: "2:30 PM", completed: true },
      { status: "Out for Delivery", location: "New York, NY", date: "Jan 15, 2024", time: "8:00 AM", completed: true },
      { status: "In Transit", location: "Newark, NJ", date: "Jan 14, 2024", time: "5:45 PM", completed: true },
      { status: "Shipped", location: "Los Angeles, CA", date: "Jan 13, 2024", time: "9:15 AM", completed: true },
      { status: "Order Placed", location: "Online", date: "Jan 12, 2024", time: "3:20 PM", completed: true },
    ],
  },
  "2": {
    orderNumber: "#ORD-2024-002",
    carrier: "UPS",
    trackingNumber: "UPS987654321",
    estimatedDelivery: "Jan 25, 2024",
    events: [
      { status: "In Transit", location: "Chicago, IL", date: "Jan 22, 2024", time: "11:30 AM", completed: true },
      { status: "Shipped", location: "Los Angeles, CA", date: "Jan 21, 2024", time: "7:00 AM", completed: true },
      { status: "Order Placed", location: "Online", date: "Jan 20, 2024", time: "4:45 PM", completed: true },
    ],
  },
};

const ShipmentTracking = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const tracking = orderId ? trackingData[orderId] : null;

  if (!tracking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Tracking information not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 bg-background border-b border-border z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Track Shipment</h1>
          <div className="w-6" />
        </div>
      </header>

      <div className="px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Shipment Info Card */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">{tracking.orderNumber}</h2>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Carrier</span>
                    <span className="font-medium text-foreground">{tracking.carrier}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tracking Number</span>
                    <span className="font-medium text-foreground">{tracking.trackingNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estimated Delivery</span>
                    <span className="font-medium text-foreground">{tracking.estimatedDelivery}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Tracking Timeline */}
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold text-foreground mb-6">Tracking History</h3>
            <div className="space-y-6">
              {tracking.events.map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        event.completed
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {event.completed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    {index < tracking.events.length - 1 && (
                      <div
                        className={`w-0.5 h-16 ${
                          event.completed ? "bg-primary" : "bg-border"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <h4 className="font-semibold text-foreground">{event.status}</h4>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.date} at {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ShipmentTracking;
