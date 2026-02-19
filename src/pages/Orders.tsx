import { ArrowLeft, Package, XCircle, RotateCcw, AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";
import { useCart } from "@/contexts/CartContext";

import { OrderService } from "@/data/services/order.service";
import { IOrder } from "@/data/models/order.model";
import { useEffect, useState } from "react";
import { RESOURCE_URL } from "@/data/constants/constants";


const statusColors: Record<string, string> = {
  delivered: "bg-green-500/20 text-green-500 border-green-500/20",
  processing: "bg-yellow-500/20 text-yellow-500 border-yellow-500/20",
  pending: "bg-yellow-500/20 text-yellow-500 border-yellow-500/20",
  confirmed: "bg-blue-500/20 text-blue-500 border-blue-500/20",
  shipped: "bg-purple-500/20 text-purple-500 border-purple-500/20",
  cancelled: "bg-red-500/20 text-red-500 border-red-500/20",
  returned: "bg-orange-500/20 text-orange-500 border-orange-500/20",
};

// Check if order can be cancelled (only pending or confirmed)
const canCancelOrder = (order: IOrder) =>
  order.status === "pending" || order.status === "confirmed";

// Check if order can be returned (delivered within last 1 day)
const canReturnOrder = (order: IOrder) => {
  if (order.status !== "delivered") return false;
  if (!order.actualDeliveryDate) return false;
  const deliveredAt = new Date(order.actualDeliveryDate).getTime();
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  return now - deliveredAt <= oneDayMs;
};

// Format remaining return window
const getReturnTimeLeft = (order: IOrder): string => {
  if (!order.actualDeliveryDate) return "";
  const deliveredAt = new Date(order.actualDeliveryDate).getTime();
  const expiresAt = deliveredAt + 24 * 60 * 60 * 1000;
  const remaining = expiresAt - Date.now();
  if (remaining <= 0) return "";
  const hours = Math.floor(remaining / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
  if (hours > 0) return `${hours}h ${minutes}m left to return`;
  return `${minutes}m left to return`;
};

interface ActionModalProps {
  type: "cancel" | "return";
  order: IOrder;
  onConfirm: (reason: string) => void;
  onClose: () => void;
  loading: boolean;
}

const ActionModal = ({ type, order, onConfirm, onClose, loading }: ActionModalProps) => {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className={`flex items-center gap-3 p-5 border-b border-border rounded-t-2xl ${type === "cancel" ? "bg-red-500/10" : "bg-orange-500/10"}`}>
          {type === "cancel" ? (
            <XCircle className="w-6 h-6 text-red-500 shrink-0" />
          ) : (
            <RotateCcw className="w-6 h-6 text-orange-500 shrink-0" />
          )}
          <div>
            <h2 className="font-bold text-foreground text-lg">
              {type === "cancel" ? "Cancel Order" : "Return Order"}
            </h2>
            <p className="text-xs text-muted-foreground">
              Order #{order._id.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className={`flex items-start gap-2 p-3 rounded-lg ${type === "cancel" ? "bg-red-500/10 text-red-400" : "bg-orange-500/10 text-orange-400"}`}>
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p className="text-sm">
              {type === "cancel"
                ? "Are you sure you want to cancel this order? This action cannot be undone."
                : "You are requesting a return for this order. Return window is 1 day after delivery."}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              {type === "cancel" ? "Cancellation Reason" : "Return Reason"}
              <span className="text-muted-foreground font-normal ml-1">(optional)</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={type === "cancel" ? "Why are you cancelling this order?" : "Why are you returning this order?"}
              rows={3}
              className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 pt-0">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={loading}
          >
            Keep Order
          </Button>
          <Button
            className={`flex-1 ${type === "cancel" ? "bg-red-500 hover:bg-red-600 text-white" : "bg-orange-500 hover:bg-orange-600 text-white"}`}
            onClick={() => onConfirm(reason)}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {type === "cancel" ? "Cancelling..." : "Returning..."}
              </span>
            ) : (
              type === "cancel" ? "Cancel Order" : "Return Order"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface ToastProps {
  message: string;
  type: "success" | "error";
}

const Orders = () => {
  const navigate = useNavigate();
  const { refreshOrderCount } = useCart();

  const [orderList, setOrderList] = useState<IOrder[]>([]);
  const [actionModal, setActionModal] = useState<{ type: "cancel" | "return"; order: IOrder } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<ToastProps | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const getAllOrders = () => {
    try {
      OrderService.getListasync().then(
        (response) => {
          setOrderList(response.data);
        },
        (error) => {
          console.log(error);
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllOrders();
    refreshOrderCount();
  }, []);

  const getSortedOrders = () =>
    [...orderList].sort(
      (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );

  const handleCancelConfirm = async (reason: string) => {
    if (!actionModal) return;
    setActionLoading(true);
    try {
      await OrderService.cancelOrder(actionModal.order._id, reason || undefined);
      showToast("Order cancelled successfully", "success");
      setActionModal(null);
      getAllOrders();
      refreshOrderCount();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to cancel order. Please try again.";
      showToast(msg, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturnConfirm = async (reason: string) => {
    if (!actionModal) return;
    setActionLoading(true);
    try {
      await OrderService.returnOrder(actionModal.order._id, reason || undefined);
      showToast("Return request submitted successfully", "success");
      setActionModal(null);
      getAllOrders();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to submit return. Please try again.";
      showToast(msg, "error");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      {/* Action Modal */}
      {actionModal && (
        <ActionModal
          type={actionModal.type}
          order={actionModal.order}
          onConfirm={actionModal.type === "cancel" ? handleCancelConfirm : handleReturnConfirm}
          onClose={() => !actionLoading && setActionModal(null)}
          loading={actionLoading}
        />
      )}

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

          {getSortedOrders().length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No orders found</p>
              <Button onClick={() => navigate("/")} size="lg">
                Shop Now
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getSortedOrders()?.map((order) => (
                <Card key={order._id} className="p-4 bg-card border-border flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">
                        #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(order.orderDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <Badge className={statusColors[order.status] || "bg-gray-500/20 text-gray-500"}>
                      {order.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-3 flex-1">
                    {order?.items?.filter((i) => i.itemId).map((item) => (
                      <div key={item.itemId._id} className="flex gap-3">
                        <img
                          src={RESOURCE_URL + "" + item.itemId.images[0]}
                          alt={item.itemId.name}
                          className="w-16 h-16 object-cover rounded-lg bg-secondary/50"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-foreground">{item.itemId.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">Qty: {item.qty}</p>
                          <p className="text-sm font-semibold text-foreground mt-1">
                            ₹{item.itemId.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border mt-4 pt-4 space-y-3">
                    <div className="flex justify-between text-foreground">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold">₹{order.totalAmount.toFixed(2)}</span>
                    </div>

                    {/* Track Shipment */}
                    {(order.status === "shipped" || order.status === "delivered") && (
                      <Button
                        onClick={() => navigate(`/tracking/${order._id}`)}
                        className="w-full"
                        variant="outline"
                        size="sm"
                      >
                        <Package className="w-4 h-4 mr-2" />
                        Track Shipment
                      </Button>
                    )}

                    {/* Cancel Button */}
                    {canCancelOrder(order) && (
                      <Button
                        onClick={() => setActionModal({ type: "cancel", order })}
                        className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20"
                        variant="ghost"
                        size="sm"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancel Order
                      </Button>
                    )}

                    {/* Return Button */}
                    {canReturnOrder(order) && (
                      <div>
                        <Button
                          onClick={() => setActionModal({ type: "return", order })}
                          className="w-full bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/20"
                          variant="ghost"
                          size="sm"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Return Order
                        </Button>
                        <p className="text-xs text-orange-400 text-center mt-1">
                          ⏱ {getReturnTimeLeft(order)}
                        </p>
                      </div>
                    )}

                    {/* Return/Cancel status info */}
                    {order.status === "returned" && (
                      <div className="flex items-center gap-2 text-xs text-orange-400 bg-orange-500/10 rounded-lg px-3 py-2">
                        <RotateCcw className="w-3 h-3" />
                        Return requested
                        {(order as any).returnReason && ` · ${(order as any).returnReason}`}
                      </div>
                    )}
                    {order.status === "cancelled" && order.cancellationReason && (
                      <div className="flex items-start gap-2 text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
                        <XCircle className="w-3 h-3 mt-0.5" />
                        {order.cancellationReason}
                      </div>
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
