import { Home, ShoppingCart, Package, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import fitfivelogo from "@/assets/logo/fitfivelogo.jpg";
import { useCart } from "@/contexts/CartContext";

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, orderCount } = useCart();

  const navItems = [
    { icon: Home, label: "Shopping", path: "/" },
    { icon: ShoppingCart, label: "Cart", path: "/cart" },
    { label: "Logo", path: "/landing", isSpecial: true },
    { icon: Package, label: "My Orders", path: "/orders" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border py-2 px-4 z-50">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          if (item.isSpecial) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
                  <img
                    src={fitfivelogo}
                    alt="FitFive Logo"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </button>
            );
          }

          const Icon = item.icon;
          const isCart = item.label === "Cart";
          const isOrders = item.label === "My Orders";

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors relative",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {isCart && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 border-2 border-background">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
                {isOrders && orderCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 border-2 border-background">
                    {orderCount > 99 ? '99+' : orderCount}
                  </span>
                )}
              </div>
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
