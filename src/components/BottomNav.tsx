import { Home, ShoppingCart, Package, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import fitfivelogo from "@/assets/logo/fitfivelogo.jpg";

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Shopping", path: "/home" },
    { icon: ShoppingCart, label: "Cart", path: "/cart" },
    { label: "Add", path: "/add", isSpecial: true },
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
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
