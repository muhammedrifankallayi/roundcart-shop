import { useEffect, useState } from "react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ProductCard } from "@/components/ProductCard";
import { BottomNav } from "@/components/BottomNav";
import { AuthModal } from "@/components/AuthModal";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Loader, ProductCardSkeleton } from "@/components/ui/loader";
import { ShoppingBag, Shirt, Footprints, Watch, Glasses, Crown } from "lucide-react";
import { User, ShoppingCart, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

const WHATSAPP_NUMBER = "918138957263"; // ← replace with your actual WhatsApp number
const WHATSAPP_MSG = encodeURIComponent("Hi! I'd like to order a custom designed T-shirt. Can you help me?");

function CustomDesignBanner() {
  return (
    <div className="px-4 pt-4 pb-1 max-w-7xl mx-auto">
      <div
        className="rounded-2xl overflow-hidden"
        style={{ animation: "bannerHue 8s linear infinite" }}
      >
        <div
          className="px-5 py-4 flex items-center justify-between gap-4"
          style={{
            background: "linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #10b981)",
            backgroundSize: "400% 400%",
            animation: "gradCycle 8s ease infinite",
          }}
        >
          <div>
            <p className="text-white/70 text-[10px] uppercase tracking-widest font-semibold mb-0.5">Custom Orders</p>
            <h2 className="text-white text-base font-bold leading-tight">Design your own T-shirt</h2>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 active:scale-95 backdrop-blur-sm text-white text-xs font-bold px-3 py-2 rounded-xl transition-all duration-200 border border-white/30"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
      <style>{`
        @keyframes gradCycle {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}

import hoodieImg from "@/assets/hoodie.jpg";
import tshirtImg from "@/assets/tshirt.jpg";
import sneakersImg from "@/assets/sneakers.jpg";
import pantsImg from "@/assets/pants.jpg";
import jacketImg from "@/assets/jacket.jpg";
import pinkHoodieImg from "@/assets/pink-hoodie.jpg";
import { ItemService } from "@/data/services/item.service";
import { Item } from "@/data/models/item.model";
import { UserData } from "@/data/models/user.model";
import { SizeService } from "@/data/services/size.service";
import { ColorService } from "@/data/services/color.service";
import { Size } from "@/data/models/size.model";
import { Color } from "@/data/models/color.model";

const categories = [
  { icon: ShoppingBag, label: "All" },
  { icon: Shirt, label: "Tops" },
  { icon: Footprints, label: "Shoes" },
  { icon: ShoppingBag, label: "Bottoms" },
];

const products = [
  { id: "1", name: "Graphic Hoodie", price: 110.59, comparePrice: 150.00, image: hoodieImg, seller: "represent" },
  { id: "2", name: "Essential Tee", price: 80.09, comparePrice: 120.00, image: tshirtImg, seller: "janefish" },
  { id: "3", name: "Classic Sneakers", price: 95.99, comparePrice: 135.00, image: sneakersImg, seller: "mikecode" },
  { id: "4", name: "Cotton Chinos", price: 75.55, comparePrice: 100.00, image: pantsImg, seller: "joel" },
  { id: "5", name: "Denim Jacket", price: 120.00, comparePrice: 180.00, image: jacketImg, seller: "tphillips" },
  { id: "6", name: "Pink Hoodie", price: 89.99, comparePrice: 130.00, image: pinkHoodieImg, seller: "represent" },
];



const Index = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [itemList, setItemList] = useState<Item[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const userId = localStorage.getItem('userId');
    const userData = localStorage.getItem('userData');
    if (userId && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const itemService = ItemService;
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const [itemsResponse, sizesResponse, colorsResponse] = await Promise.all([
          itemService.getItemList(),
          SizeService.getListasync(),
          ColorService.getListasync()
        ]);

        const items = itemsResponse.data;
        const allSizes = sizesResponse.data || [];
        const allColors = colorsResponse.data || [];

        // Map items to include full size/color objects if they are strings
        const populatedItems = items.map(item => ({
          ...item,
          sizes: item.sizes?.map(s => {
            if (typeof s === 'string') {
              return allSizes.find(size => size._id === s) as unknown as Size;
            }
            return s;
          }).filter(Boolean) as Size[],
          colors: item.colors?.map(c => {
            if (typeof c === 'string') {
              return allColors.find(color => color._id === c) as unknown as Color;
            }
            return c;
          }).filter(Boolean) as Color[]
        }));

        setItemList(populatedItems);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleUserClick = () => {
    if (user) {
      navigate('/settings');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = (userData: UserData) => {
    setUser(userData);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Header */}
      <header className="sticky top-0 bg-background border-b border-border z-40 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/landing')} className="p-1 hover:bg-secondary rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </button>
            <button onClick={handleUserClick} className="p-1 hover:bg-secondary rounded-lg transition-colors">
              <User className="w-6 h-6 text-foreground" />
            </button>
          </div>
          <h1 className="text-lg font-semibold text-foreground">The Five Five</h1>
          <div className="flex items-center gap-2">
            <MusicPlayer variant="compact" />
            <button onClick={() => navigate('/cart')} className="p-1 hover:bg-secondary rounded-lg transition-colors relative">
              <ShoppingCart className="w-6 h-6 text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[16px] h-[16px] flex items-center justify-center rounded-full px-1 border-2 border-background">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Categories */}
      {/* <div className="px-4 py-6 overflow-x-auto">
        <div className="max-w-md mx-auto flex gap-6 min-w-max">
          {categories.map((category, index) => (
            <CategoryIcon
              key={index}
              icon={category.icon}
              label={category.label}
              active={selectedCategory === index}
              onClick={() => setSelectedCategory(index)}
            />
          ))}
        </div>
      </div> */}

      {/* Custom Design Banner */}
      <CustomDesignBanner />

      {/* Products Grid */}
      <div className="px-4 py-4">
        {isLoading ? (
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {itemList.map((product) => (
              <ProductCard key={product._id} {...product} />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Index;
