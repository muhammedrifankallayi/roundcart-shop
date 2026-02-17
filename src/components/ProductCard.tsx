import { Card } from "@/components/ui/card";
import { RESOURCE_URL } from "@/data/constants/constants";
import { Item } from "@/data/models/item.model";
import { useNavigate } from "react-router-dom";



export const ProductCard = ({ _id, name, price, compareAtPrice, images, sizes, colors }: Item) => {
  const navigate = useNavigate();

  return (
    <div className="cursor-pointer group" onClick={() => navigate(`/product/${_id}`)}>
      <Card className="bg-card border-border overflow-hidden hover:bg-accent transition-colors mb-3">
        <div className="aspect-square bg-secondary/50 overflow-hidden">
          <img
            src={`${RESOURCE_URL}${images[0]}`}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Card>
      <div>
        <h3 className="text-sm font-medium text-foreground mb-1">{name}</h3>

        <div className="flex items-center gap-2 flex-wrap">
          {compareAtPrice && compareAtPrice > 0 && (
            <>
              <p className="text-sm text-muted-foreground line-through">₹{compareAtPrice.toFixed(2)}</p>
              {(() => {
                const offerPercentage = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
                return offerPercentage > 0 ? (
                  <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded">{offerPercentage}% OFF</span>
                ) : null;
              })()}
            </>
          )}
          <p className="text-lg font-bold text-foreground">₹{price.toFixed(2)}</p>
        </div>

        {/* Sizes */}
        {sizes && sizes.length > 0 && (
          <div className="flex items-center gap-1 mt-2 flex-wrap">
            {sizes.map((size) => {
              const label = typeof size === 'object' ? (size.code || size.name) : null;
              if (!label) return null;
              return (
                <span
                  key={typeof size === 'object' ? size._id : size}
                  className="text-[10px] font-medium text-muted-foreground bg-secondary px-1.5 py-0.5 rounded"
                >
                  {label}
                </span>
              )
            })}
          </div>
        )}

        {/* Colors */}
        {colors && colors.length > 0 && (
          <div className="flex items-center gap-1 mt-1.5">
            {colors.map((color) => {
              const hex = typeof color === 'object' ? color.hex : null;
              const name = typeof color === 'object' ? color.name : '';
              if (!hex) return null;
              return (
                <span
                  key={typeof color === 'object' ? color._id : color}
                  className="w-3.5 h-3.5 rounded-full border border-border inline-block"
                  style={{ backgroundColor: hex || '#ccc' }}
                  title={name}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
};
