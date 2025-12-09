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

import hoodieImg from "@/assets/hoodie.jpg";
import tshirtImg from "@/assets/tshirt.jpg";
import sneakersImg from "@/assets/sneakers.jpg";
import pantsImg from "@/assets/pants.jpg";
import jacketImg from "@/assets/jacket.jpg";
import pinkHoodieImg from "@/assets/pink-hoodie.jpg";
import { ItemService } from "@/data/services/item.service";
import { Item } from "@/data/models/item.model";
import { UserData } from "@/data/models/user.model";

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
        const response = await itemService.getItemList();
        setItemList(response.data);
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
            <button onClick={() => navigate('/')} className="p-1 hover:bg-secondary rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </button>
            <button onClick={handleUserClick} className="p-1 hover:bg-secondary rounded-lg transition-colors">
              <User className="w-6 h-6 text-foreground" />
            </button>
          </div>
          <h1 className="text-lg font-semibold text-foreground">The Five Five</h1>
          <div className="flex items-center gap-2">
            <MusicPlayer variant="compact" />
            <button onClick={() => navigate('/cart')} className="p-1 hover:bg-secondary rounded-lg transition-colors">
              <ShoppingCart className="w-6 h-6 text-foreground" />
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
