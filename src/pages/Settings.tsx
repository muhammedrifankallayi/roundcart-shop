import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Heart, 
  Download, 
  Globe, 
  MapPin, 
  CreditCard, 
  Monitor, 
  Trash2, 
  Clock, 
  LogOut,
  ChevronRight,
  ArrowLeft,
  Settings as SettingsIcon,
  Pencil,
  Store,
  MessageSquare,
  Lock
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { AuthHelper } from "@/lib/authHelper";
import { UserData } from "@/data/models/user.model";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const user = AuthHelper.getUserData();
    if (user) {
      setUserData(user);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const navigationItems = [
    { 
      icon: Heart, 
      label: "Wishlists", 
      onClick: () => toast({ title: "Wishlists", description: "View your saved items" }) 
    },
    { 
      icon: CreditCard, 
      label: "Payment History", 
      onClick: () => toast({ title: "Payment History", description: "View your transactions" }) 
    },
    { 
      icon: Download, 
      label: "Downloads", 
      onClick: () => toast({ title: "Downloads", description: "View your downloads" }) 
    },
  ];

  const preferencesItems = [
    { 
      icon: Globe, 
      label: "Languages", 
      onClick: () => toast({ title: "Languages", description: "Change language settings" }) 
    },
    { 
      icon: MapPin, 
      label: "Location", 
      onClick: () => toast({ title: "Location", description: "Update your location" }) 
    },
    { 
      icon: Monitor, 
      label: "Display", 
      onClick: () => toast({ title: "Display", description: "Customize display settings" }) 
    },
  ];

  const accountItems = [
    { 
      icon: Lock, 
      label: "Reset Password", 
      onClick: () => toast({ title: "Password Reset", description: "Check your email for reset link" }) 
    },
    { 
      icon: MessageSquare, 
      label: "Report Issue", 
      onClick: () => toast({ title: "Report Issue", description: "Tell us about your problem" }) 
    },
    { 
      icon: Store, 
      label: "Become a Reseller", 
      onClick: () => toast({ title: "Reseller Program", description: "Learn about becoming a reseller" }) 
    },
  ];

  const systemItems = [
    { 
      icon: Trash2, 
      label: "Clear Cache", 
      onClick: () => toast({ title: "Cache Cleared", description: "Your cache has been cleared" }) 
    },
    { 
      icon: Clock, 
      label: "Clear History", 
      onClick: () => toast({ title: "History Cleared", description: "Your history has been cleared" }) 
    },
    { 
      icon: LogOut, 
      label: "Log Out", 
      onClick: () => {
        AuthHelper.clearAuthData();
        toast({ title: "Logged Out", description: "You have been logged out" });
        navigate("/");
      }
    },
  ];

  const handleEditProfile = () => {
    navigate("/profile/edit");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-background border-b border-border z-40 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">My Profile</h1>
          <button className="p-2">
            <SettingsIcon className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Section - Left Side on Desktop */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <Avatar className="w-24 h-24 lg:w-32 lg:h-32">
                    <AvatarImage src={userData?.avatar} />
                    <AvatarFallback className="text-2xl lg:text-3xl bg-primary/10 text-primary">
                      {userData?.name.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={handleEditProfile}
                    className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-foreground">{userData?.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{userData?.email}</p>
                </div>
                <Button onClick={handleEditProfile} size="sm" className="rounded-full px-8 w-full">
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Settings Options - Right Side on Desktop */}
          <div className="lg:col-span-2 space-y-6">
            {/* Favorites & Purchases */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Favorites & Purchases</h3>
              <div className="space-y-1">
                {navigationItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className="w-full flex items-center justify-between p-4 hover:bg-accent rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span className="text-foreground font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Preferences</h3>
              <div className="space-y-1">
                {preferencesItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className="w-full flex items-center justify-between p-4 hover:bg-accent rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span className="text-foreground font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Account Settings</h3>
              <div className="space-y-1">
                {accountItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className="w-full flex items-center justify-between p-4 hover:bg-accent rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span className="text-foreground font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* System */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">System</h3>
              <div className="space-y-1">
                {systemItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className="w-full flex items-center justify-between p-4 hover:bg-accent rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span className="text-foreground font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* App Version */}
            <p className="text-center lg:text-left text-xs text-muted-foreground pt-2">App Version 2.3</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Settings;
