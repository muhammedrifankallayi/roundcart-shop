import { useState } from "react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ProductCard } from "@/components/ProductCard";
import { BottomNav } from "@/components/BottomNav";
import { ShoppingBag, Shirt, Footprints, Watch, Glasses, Crown } from "lucide-react";
import { User, ShoppingCart } from "lucide-react";

import hoodieImg from "@/assets/hoodie.jpg";
import tshirtImg from "@/assets/tshirt.jpg";
import sneakersImg from "@/assets/sneakers.jpg";
import pantsImg from "@/assets/pants.jpg";
import jacketImg from "@/assets/jacket.jpg";
import pinkHoodieImg from "@/assets/pink-hoodie.jpg";

const categories = [
  { icon: ShoppingBag, label: "All" },
  { icon: Shirt, label: "Tops" },
  { icon: Footprints, label: "Shoes" },
  { icon: ShoppingBag, label: "Bottoms" },
  { icon: Watch, label: "Accessories" },
  { icon: Glasses, label: "Eyewear" },
];

const products = [
  { id: "1", name: "Graphic Hoodie", price: 110.59, image: hoodieImg, seller: "represent" },
  { id: "2", name: "Essential Tee", price: 80.09, image: tshirtImg, seller: "janefish" },
  { id: "3", name: "Classic Sneakers", price: 95.99, image: sneakersImg, seller: "mikecode" },
  { id: "4", name: "Cotton Chinos", price: 75.55, image: pantsImg, seller: "joel" },
  { id: "5", name: "Denim Jacket", price: 120.00, image: jacketImg, seller: "tphillips" },
  { id: "6", name: "Pink Hoodie", price: 89.99, image: pinkHoodieImg, seller: "represent" },
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-background border-b border-border z-40 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <User className="w-6 h-6 text-foreground" />
          <h1 className="text-lg font-semibold text-foreground">Feed</h1>
          <ShoppingCart className="w-6 h-6 text-foreground" />
        </div>
      </header>

      {/* Categories */}
      <div className="px-4 py-6 overflow-x-auto">
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
      </div>

      {/* Products Grid */}
      <div className="px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Index;
