import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  seller?: string;
}

export const ProductCard = ({ id, name, price, image, seller }: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="bg-card border-border overflow-hidden cursor-pointer hover:bg-accent transition-colors"
      onClick={() => navigate(`/product/${id}`)}
    >
      <div className="aspect-square bg-secondary/50 overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-foreground mb-1">{name}</h3>
        <p className="text-lg font-bold text-foreground">${price.toFixed(2)}</p>
        {seller && (
          <p className="text-xs text-muted-foreground mt-1">@{seller}</p>
        )}
      </div>
    </Card>
  );
};
