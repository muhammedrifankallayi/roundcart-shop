import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  comparePrice?: number;
  image: string;
  seller?: string;
}

export const ProductCard = ({ id, name, price, comparePrice, image, seller }: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="cursor-pointer group" onClick={() => navigate(`/product/${id}`)}>
      <Card className="bg-card border-border overflow-hidden hover:bg-accent transition-colors mb-3">
        <div className="aspect-square bg-secondary/50 overflow-hidden">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      </Card>
      <div>
        <h3 className="text-sm font-medium text-foreground mb-1">{name}</h3>
        {seller && (
          <p className="text-xs text-muted-foreground mb-1">@{seller}</p>
        )}
        <div className="flex items-center gap-2">
          {comparePrice && (
            <p className="text-sm text-muted-foreground line-through">${comparePrice.toFixed(2)}</p>
          )}
          <p className="text-lg font-bold text-foreground">${price.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};
