import { Card } from "@/components/ui/card";
import { RESOURCE_URL } from "@/data/constants/constants";
import { Item } from "@/data/models/item.model";
import { useNavigate } from "react-router-dom";



export const ProductCard = ({ _id, name, price, compareAtPrice, images,  }: Item) => {
  const navigate = useNavigate();

  return (
    <div className="cursor-pointer group" onClick={() => navigate(`/product/${_id}`)}>
      <Card className="bg-card border-border overflow-hidden hover:bg-accent transition-colors mb-3">
        <div className="aspect-square bg-secondary/50 overflow-hidden">
          <img 
            src={`${RESOURCE_URL}/${images[0]}`} 
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      </Card>
      <div>
        <h3 className="text-sm font-medium text-foreground mb-1">{name}</h3>
  
        <div className="flex items-center gap-2">
          {compareAtPrice && (
            <p className="text-sm text-muted-foreground line-through">${compareAtPrice.toFixed(2)}</p>
          )}
          <p className="text-lg font-bold text-foreground">${price.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};
