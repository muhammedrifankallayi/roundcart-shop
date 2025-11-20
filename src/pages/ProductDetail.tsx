import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";

import hoodieImg from "@/assets/hoodie.jpg";
import tshirtImg from "@/assets/tshirt.jpg";
import sneakersImg from "@/assets/sneakers.jpg";
import pantsImg from "@/assets/pants.jpg";
import jacketImg from "@/assets/jacket.jpg";
import pinkHoodieImg from "@/assets/pink-hoodie.jpg";

const products = [
  { id: "1", name: "Graphic Hoodie", price: 110.59, image: hoodieImg, sizes: ["S", "M", "L", "XL"], colors: ["Black", "White"] },
  { id: "2", name: "Essential Tee", price: 80.09, image: tshirtImg, sizes: ["S", "M", "L"], colors: ["White", "Grey"] },
  { id: "3", name: "Classic Sneakers", price: 95.99, image: sneakersImg, sizes: ["8", "9", "10", "11"], colors: ["White", "Black"] },
  { id: "4", name: "Cotton Chinos", price: 75.55, image: pantsImg, sizes: ["30", "32", "34"], colors: ["Light Grey", "Navy"] },
  { id: "5", name: "Denim Jacket", price: 120.00, image: jacketImg, sizes: ["S", "M", "L"], colors: ["Blue", "Black"] },
  { id: "6", name: "Pink Hoodie", price: 89.99, image: pinkHoodieImg, sizes: ["S", "M", "L"], colors: ["Pink", "Grey"] },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === id);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-background border-b border-border z-40 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-foreground">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-lg font-semibold text-foreground">Product Details</h1>
          <div className="w-5" />
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Product Image */}
        <div className="aspect-square bg-secondary/50 rounded-2xl overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{product.name}</h2>
              <p className="text-3xl font-bold text-foreground mt-2">${product.price.toFixed(2)}</p>
            </div>
            <button className="p-2">
              <MoreVertical className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Size</h3>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Color</h3>
            <div className="flex gap-2 flex-wrap">
              {product.colors.map((color) => (
                <button
                  key={color}
                  className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button 
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-base font-semibold rounded-full"
        >
          ADD TO CART
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProductDetail;
