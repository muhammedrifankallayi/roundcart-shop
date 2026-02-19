import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MapPin,
  LogOut,
  ChevronRight,
  ArrowLeft,
  Pencil,
  Lock,
  Plus,
  Trash2,
  Home,
  Phone,
  X,
  ShoppingBag,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AuthHelper } from "@/lib/authHelper";
import { UserData } from "@/data/models/user.model";
import { AuthModal } from "@/components/AuthModal";
import { AddressService } from "@/data/services/address.service";
import { IAddress } from "@/data/models/address.model";
import { RESOURCE_URL } from "@/data/constants/constants";

// ─── Wishlist helpers (localStorage) ─────────────────────────────────────────
const WL_KEY = "fitfive_wishlist";
interface WishlistItem { _id: string; name: string; price: number; images: string[] }
const getWishlist = (): WishlistItem[] => {
  try { return JSON.parse(localStorage.getItem(WL_KEY) || "[]"); } catch { return []; }
};
const removeFromWishlist = (id: string) => {
  const updated = getWishlist().filter(i => i._id !== id);
  localStorage.setItem(WL_KEY, JSON.stringify(updated));
};

// ─── Reusable row ─────────────────────────────────────────────────────────────
function SettingRow({ icon: Icon, label, onClick, danger = false }: {
  icon: React.ElementType; label: string; onClick: () => void; danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3.5 hover:bg-accent rounded-xl transition-colors group ${danger ? "text-red-500" : ""}`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${danger ? "text-red-500" : "text-muted-foreground group-hover:text-foreground"} transition-colors`} />
        <span className={`font-medium text-sm ${danger ? "text-red-500" : "text-foreground"}`}>{label}</span>
      </div>
      <ChevronRight className={`w-4 h-4 ${danger ? "text-red-400" : "text-muted-foreground group-hover:text-foreground"} transition-colors`} />
    </button>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{title}</h3>
      </div>
      <div className="px-2 pb-2 space-y-0.5">{children}</div>
    </div>
  );
}

// ─── Address card ─────────────────────────────────────────────────────────────
function AddressCard({ address, onDelete }: { address: IAddress; onDelete: () => void }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-accent/40 rounded-xl">
      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
        <Home className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground text-sm">{address.fullName}</p>
        <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">
          {address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ""}
        </p>
        <p className="text-muted-foreground text-xs">
          {address.city}, {address.state} – {address.pinCode}
        </p>
        <div className="flex items-center gap-1 mt-1 text-muted-foreground text-xs">
          <Phone className="w-3 h-3" /> {address.phone}
        </div>
      </div>
      <button
        onClick={onDelete}
        className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Address state
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [addrLoading, setAddrLoading] = useState(false);

  // Wishlist state
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const user = AuthHelper.getUserData();
    if (user) {
      setUserData(user);
      fetchAddresses();
    }
    setWishlist(getWishlist());
  }, []);

  const fetchAddresses = async () => {
    setAddrLoading(true);
    try {
      const res = await AddressService.getListasync();
      setAddresses(res.data || []);
    } catch {
      // silently fail
    } finally {
      setAddrLoading(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await AddressService.deleteAsync(id);
      setAddresses(prev => prev.filter(a => a._id !== id));
      toast({ title: "Address removed" });
    } catch {
      toast({ title: "Failed to delete address", variant: "destructive" });
    }
  };

  const handleRemoveWishlist = (id: string) => {
    removeFromWishlist(id);
    setWishlist(getWishlist());
    toast({ title: "Removed from wishlist" });
  };

  const handleLogout = () => {
    AuthHelper.clearAuthData();
    toast({ title: "Logged out" });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(u) => { setUserData(u); setIsAuthModalOpen(false); fetchAddresses(); }}
      />

      {/* Header */}
      <header className="sticky top-0 bg-background border-b border-border z-40 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">My Profile</h1>
          <div className="w-9" />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {!userData ? (
          /* ── Not logged in ── */
          <Card className="p-8 text-center">
            <Lock className="w-14 h-14 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Please Login</h2>
            <p className="text-muted-foreground text-sm mb-6">
              You need to be logged in to view your profile and settings.
            </p>
            <Button onClick={() => setIsAuthModalOpen(true)} size="lg" className="w-full">
              Login
            </Button>
          </Card>
        ) : (
          <>
            {/* ── Profile card ── */}
            <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
              <div className="relative shrink-0">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={userData?.avatar} />
                  <AvatarFallback className="text-xl bg-primary/10 text-primary">
                    {userData?.name?.split(" ").map(n => n[0]).join("") || "U"}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => navigate("/profile/edit")}
                  className="absolute -bottom-1 -right-1 p-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-foreground truncate">{userData?.name}</h2>
                <p className="text-sm text-muted-foreground truncate">{userData?.email}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate("/profile/edit")} className="shrink-0">
                Edit
              </Button>
            </div>

            {/* ── Address Management ── */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 pt-4 pb-3">
                <div>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Saved Addresses</h3>
                </div>
                <button
                  onClick={() => navigate("/checkout")}
                  className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New
                </button>
              </div>
              <div className="px-4 pb-4 space-y-3">
                {addrLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm py-2">
                    <div className="w-4 h-4 border-2 border-muted border-t-primary rounded-full animate-spin" />
                    Loading addresses…
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <MapPin className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No saved addresses yet</p>
                    <button
                      onClick={() => navigate("/checkout")}
                      className="mt-2 text-xs text-primary font-semibold hover:underline"
                    >
                      Add one during checkout
                    </button>
                  </div>
                ) : (
                  addresses.map(addr => (
                    <AddressCard
                      key={addr._id}
                      address={addr}
                      onDelete={() => addr._id && handleDeleteAddress(addr._id)}
                    />
                  ))
                )}
              </div>
            </div>

            {/* ── Wishlist ── */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 pt-4 pb-3">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Wishlist {wishlist.length > 0 && <span className="text-primary">({wishlist.length})</span>}
                </h3>
                {wishlist.length > 0 && (
                  <button
                    onClick={() => navigate("/")}
                    className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    Shop more
                  </button>
                )}
              </div>
              <div className="px-4 pb-4">
                {wishlist.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <Heart className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Your wishlist is empty</p>
                    <button
                      onClick={() => navigate("/")}
                      className="mt-2 text-xs text-primary font-semibold hover:underline"
                    >
                      Browse products
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {wishlist.map(item => (
                      <div key={item._id} className="flex items-center gap-3 p-3 bg-accent/40 rounded-xl">
                        {item.images?.[0] ? (
                          <img
                            src={RESOURCE_URL + item.images[0]}
                            alt={item.name}
                            className="w-14 h-14 object-cover rounded-lg bg-secondary/50 shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0">
                            <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground text-sm truncate">{item.name}</p>
                          <p className="text-primary text-sm font-bold mt-0.5">₹{item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex flex-col gap-1.5 shrink-0">
                          <button
                            onClick={() => navigate(`/product/${item._id}`)}
                            className="text-xs font-semibold text-primary border border-primary/30 px-2.5 py-1 rounded-lg hover:bg-primary/10 transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleRemoveWishlist(item._id)}
                            className="text-xs text-muted-foreground hover:text-red-500 transition-colors flex items-center justify-center gap-0.5"
                          >
                            <X className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Account ── */}
            <Section title="Account">
              <SettingRow icon={LogOut} label="Log Out" onClick={handleLogout} danger />
            </Section>

            <p className="text-center text-xs text-muted-foreground pt-1">The Fit Five · v2.3</p>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Settings;
