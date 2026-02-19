import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { OrderService } from "@/data/services/order.service";
import { IOrder } from "@/data/models/order.model";
import { BottomNav } from "@/components/BottomNav";

// ─── Status pipeline ──────────────────────────────────────────────────────────
const STEPS = [
  {
    key: "pending",
    label: "Order Placed",
    sublabel: "We received your order",
    icon: "🛒",
  },
  {
    key: "confirmed",
    label: "Confirmed",
    sublabel: "Order verified & accepted",
    icon: "✅",
  },
  {
    key: "processing",
    label: "Processing",
    sublabel: "Being packed at warehouse",
    icon: "📦",
  },
  {
    key: "shipped",
    label: "Shipped",
    sublabel: "On its way to you",
    icon: "🚚",
  },
  {
    key: "delivered",
    label: "Delivered",
    sublabel: "Arrived at your door",
    icon: "🏠",
  },
];

const STATUS_ORDER = ["pending", "confirmed", "processing", "shipped", "delivered"];

function getActiveStep(status: string): number {
  const idx = STATUS_ORDER.indexOf(status);
  return idx === -1 ? 0 : idx;
}

// ─── Animated truck SVG path ──────────────────────────────────────────────────
function JourneyDiagram({ activeStep }: { activeStep: number }) {
  const total = STEPS.length - 1; // 4 segments
  const pct = (activeStep / total) * 100;

  return (
    <div className="relative w-full px-2 py-6 select-none">
      {/* Road track */}
      <div className="relative h-2 bg-white/10 rounded-full mx-10 overflow-visible">
        {/* Filled progress */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-in-out"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)",
          }}
        />

        {/* Truck emoji riding along */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-1000 ease-in-out text-2xl"
          style={{ left: `${Math.max(4, pct)}%` }}
        >
          🚚
        </div>
      </div>

      {/* Step dots + labels */}
      <div className="flex justify-between mt-5 relative">
        {STEPS.map((step, i) => {
          const done = i <= activeStep;
          const current = i === activeStep;
          return (
            <div key={step.key} className="flex flex-col items-center gap-1.5 flex-1">
              {/* Dot */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-500 ${done
                    ? "bg-violet-500 shadow-lg shadow-violet-500/40 scale-110"
                    : "bg-white/10"
                  } ${current ? "ring-2 ring-violet-300 ring-offset-2 ring-offset-transparent" : ""}`}
              >
                {step.icon}
              </div>
              {/* Label */}
              <span
                className={`text-[10px] font-semibold text-center leading-tight transition-colors duration-300 ${done ? "text-violet-300" : "text-white/30"
                  }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Timeline events derived from order ──────────────────────────────────────
function buildTimeline(order: IOrder) {
  const active = getActiveStep(order.status);
  return STEPS.slice(0, active + 1)
    .map((step, i) => ({
      ...step,
      done: true,
      date:
        i === 0
          ? order.orderDate
          : i === active && order.status === "delivered"
            ? order.actualDeliveryDate || order.updatedAt
            : i === active
              ? order.updatedAt
              : null,
    }))
    .reverse(); // most recent first
}

function fmt(dateStr?: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Main component ───────────────────────────────────────────────────────────
const ShipmentTracking = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();

  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!orderId) { setError(true); setLoading(false); return; }
    OrderService.getById(orderId)
      .then((res) => { setOrder(res.data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [orderId]);

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm">Loading shipment details…</p>
      </div>
    );
  }

  // ── Error / not found ──
  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="text-5xl">📦</span>
        <h2 className="text-lg font-semibold text-foreground">Order not found</h2>
        <p className="text-muted-foreground text-sm">We couldn't load tracking info for this order.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-2 px-5 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  // ── Cancelled / returned ──
  if (order.status === "cancelled" || order.status === "returned") {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="sticky top-0 bg-background border-b border-border z-40 px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <button onClick={() => navigate(-1)}>
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </button>
            <h1 className="text-lg font-semibold text-foreground">Track Shipment</h1>
            <div className="w-6" />
          </div>
        </header>
        <div className="flex flex-col items-center justify-center gap-4 px-6 pt-20 text-center">
          <span className="text-6xl">{order.status === "cancelled" ? "❌" : "↩️"}</span>
          <h2 className="text-xl font-bold text-foreground capitalize">Order {order.status}</h2>
          {order.cancellationReason && (
            <p className="text-sm text-muted-foreground max-w-xs">{order.cancellationReason}</p>
          )}
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-5 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition"
          >
            Back to Orders
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  const activeStep = getActiveStep(order.status);
  const timeline = buildTimeline(order);
  const currentStep = STEPS[activeStep];
  const isDelivered = order.status === "delivered";

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-background border-b border-border z-40 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Track Shipment</h1>
          <div className="w-6" />
        </div>
      </header>

      <div className="px-4 py-6 max-w-2xl mx-auto space-y-5">

        {/* ── Hero journey card ── */}
        <div
          className="rounded-2xl p-5 overflow-hidden relative"
          style={{
            background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)",
          }}
        >
          {/* Decorative blobs */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-violet-500/20 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />

          {/* Order ID + status */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-white/60 text-xs font-mono">
              #{order._id.slice(-8).toUpperCase()}
            </span>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${isDelivered
                  ? "bg-green-500/20 text-green-300"
                  : "bg-violet-500/20 text-violet-200"
                }`}
            >
              {order.status.toUpperCase()}
            </span>
          </div>

          <h2 className="text-white text-xl font-bold mb-0.5">{currentStep.label}</h2>
          <p className="text-white/60 text-sm mb-5">{currentStep.sublabel}</p>

          {/* Journey diagram */}
          <JourneyDiagram activeStep={activeStep} />

          {/* ETA row */}
          {!isDelivered && order.expectedDeliveryDate && (
            <div className="mt-4 flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3">
              <span className="text-lg">📅</span>
              <div>
                <p className="text-white/50 text-[10px] uppercase tracking-wide">Expected Delivery</p>
                <p className="text-white text-sm font-semibold">{fmt(order.expectedDeliveryDate)}</p>
              </div>
            </div>
          )}
          {isDelivered && (
            <div className="mt-4 flex items-center gap-2 bg-green-500/20 rounded-xl px-4 py-3">
              <span className="text-lg">🎉</span>
              <div>
                <p className="text-green-300/70 text-[10px] uppercase tracking-wide">Delivered on</p>
                <p className="text-green-200 text-sm font-semibold">{fmt(order.actualDeliveryDate || order.updatedAt)}</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Tracking number ── */}
        {order.trackingNumber && (
          <div className="bg-card border border-border rounded-2xl px-5 py-4 flex items-center gap-3">
            <span className="text-2xl">🔍</span>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Tracking Number</p>
              <p className="text-foreground font-mono font-semibold">{order.trackingNumber}</p>
            </div>
          </div>
        )}

        {/* ── Delivery address ── */}
        {order.shippingAddressId && (
          <div className="bg-card border border-border rounded-2xl px-5 py-4 flex items-start gap-3">
            <span className="text-2xl mt-0.5">📍</span>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Delivering to</p>
              <p className="text-foreground font-semibold text-sm">
                {order.shippingAddressId.fullName || order.userId?.name}
              </p>
              <p className="text-muted-foreground text-sm">
                {order.shippingAddressId.addressLine1}
                {order.shippingAddressId.addressLine2 ? `, ${order.shippingAddressId.addressLine2}` : ""}
              </p>
              <p className="text-muted-foreground text-sm">
                {order.shippingAddressId.city}, {order.shippingAddressId.state} {order.shippingAddressId.pinCode}
              </p>
            </div>
          </div>
        )}

        {/* ── Timeline ── */}
        <div className="bg-card border border-border rounded-2xl px-5 py-5">
          <h3 className="text-sm font-bold text-foreground mb-5 uppercase tracking-wide">
            Order Timeline
          </h3>
          <div className="space-y-0">
            {timeline.map((event, i) => (
              <div key={event.key} className="flex gap-4">
                {/* Spine */}
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-violet-500/20 border-2 border-violet-500 flex items-center justify-center text-base shrink-0">
                    {event.icon}
                  </div>
                  {i < timeline.length - 1 && (
                    <div className="w-0.5 flex-1 bg-violet-500/20 my-1 min-h-[24px]" />
                  )}
                </div>
                {/* Content */}
                <div className="pb-5 flex-1">
                  <p className="text-foreground font-semibold text-sm">{event.label}</p>
                  <p className="text-muted-foreground text-xs">{event.sublabel}</p>
                  {event.date && (
                    <p className="text-violet-400 text-xs mt-0.5">{fmt(event.date)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <BottomNav />
    </div>
  );
};

export default ShipmentTracking;
