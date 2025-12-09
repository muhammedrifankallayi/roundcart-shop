import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MoreVertical, Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { ProductCard } from "@/components/ProductCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

import hoodieImg from "@/assets/hoodie.jpg";
import tshirtImg from "@/assets/tshirt.jpg";
import sneakersImg from "@/assets/sneakers.jpg";
import pantsImg from "@/assets/pants.jpg";
import jacketImg from "@/assets/jacket.jpg";
import pinkHoodieImg from "@/assets/pink-hoodie.jpg";
import { Color } from "@/data/models/color.model";
import { ColorService } from "@/data/services/color.service";
import { SizeService } from "@/data/services/size.service";
import { Size } from "@/data/models/size.model";
import { Item } from "@/data/models/item.model";
import { ItemService } from "@/data/services/item.service";
import { RESOURCE_URL } from "@/data/constants/constants";
import { ICart } from "@/data/models/cart.model";
import { set } from "date-fns";
import { CartService } from "@/data/services/cart.service";
import { Variant } from "@/data/models/variants.model";
import { VariantsService } from "@/data/services/variantService";
import { formatInventory, formatInventoryRecord, InventoryFormatted, InventoryFormattedRecordMap } from "@/data/common-functions/variantsMapper";

const products = [
  { id: "1", name: "Graphic Hoodie", price: 110.59, image: hoodieImg, images: [hoodieImg, pinkHoodieImg, hoodieImg, pinkHoodieImg], sizes: ["S", "M", "L", "XL"], colors: ["Black", "White"], description: "Premium quality hoodie with unique graphic design. Made from 100% cotton for maximum comfort and durability. Perfect for casual wear or layering in colder weather." },
  { id: "2", name: "Essential Tee", price: 80.09, image: tshirtImg, images: [tshirtImg, hoodieImg, tshirtImg, jacketImg], sizes: ["S", "M", "L"], colors: ["White", "Grey"], description: "Classic essential t-shirt crafted from soft, breathable fabric. A wardrobe staple that pairs well with any outfit. Machine washable and designed to maintain its shape." },
  { id: "3", name: "Classic Sneakers", price: 95.99, image: sneakersImg, images: [sneakersImg, pantsImg, sneakersImg, tshirtImg], sizes: ["8", "9", "10", "11"], colors: ["White", "Black"], description: "Timeless sneakers featuring premium leather construction and cushioned insoles. Versatile design suitable for both athletic and casual wear. Durable rubber outsole for excellent traction." },
  { id: "4", name: "Cotton Chinos", price: 75.55, image: pantsImg, images: [pantsImg, sneakersImg, pantsImg, jacketImg], sizes: ["30", "32", "34"], colors: ["Light Grey", "Navy"], description: "Tailored cotton chinos offering both comfort and style. Features a modern fit with just the right amount of stretch. Perfect for office or weekend wear." },
  { id: "5", name: "Denim Jacket", price: 120.00, image: jacketImg, images: [jacketImg, pantsImg, jacketImg, hoodieImg], sizes: ["S", "M", "L"], colors: ["Blue", "Black"], description: "Classic denim jacket with a modern twist. Constructed from high-quality denim with authentic wash and distressing. A versatile piece that complements any casual wardrobe." },
  { id: "6", name: "Pink Hoodie", price: 89.99, image: pinkHoodieImg, images: [pinkHoodieImg, hoodieImg, pinkHoodieImg, tshirtImg], sizes: ["S", "M", "L"], colors: ["Pink", "Grey"], description: "Cozy hoodie in a trendy pink shade. Made from ultra-soft fleece material with a relaxed fit. Features adjustable drawstring hood and kangaroo pocket." },
];

const reviews = [
  { id: 1, name: "Sarah Johnson", avatar: "", rating: 5, comment: "Absolutely love this product! The quality is outstanding and it fits perfectly. Highly recommend!", date: "2024-01-15" },
  { id: 2, name: "Michael Chen", avatar: "", rating: 4, comment: "Great purchase! The material is high quality and very comfortable. Only wish it came in more colors.", date: "2024-01-12" },
  { id: 3, name: "Emma Wilson", avatar: "", rating: 5, comment: "Best purchase I've made this year. Exceeded my expectations in every way!", date: "2024-01-10" },
  { id: 4, name: "David Brown", avatar: "", rating: 4, comment: "Very satisfied with this product. Good value for money and fast shipping.", date: "2024-01-08" },
  { id: 5, name: "Lisa Anderson", avatar: "", rating: 5, comment: "Perfect! Exactly as described and the quality is amazing. Will definitely buy again.", date: "2024-01-05" },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
 
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [colorList, setColorList] = useState<Color[]>([]);
  const [sizeList, setSizeList] = useState<Size[]>([]);
  const [itemList, setItemList] = useState<Item[]>([]);
  const [item, setItem] = useState<Item | null>(null);
  const [variantList, setVariantList] = useState<Variant[]>([]);
  const [formatedVariantRecord, setFormatedVariantRecord] = useState<InventoryFormattedRecordMap>({});
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const getColorList = async () => {
    try {
      const response = await ColorService.getListasync();
      setColorList(response.data);
    } catch (error) {
      console.error('Error fetching colors:', error);
    }
  };

  const getSizeList = async () => {
    try {
      const response = await SizeService.getListasync();
      setSizeList(response.data);
      // Set first size as default
      if (response.data && response.data.length > 0) {
        setSelectedSize(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching sizes:', error);
    }
  };

  const getVariantList = async (id:string) => {
    try {
      if(id===null)   return;
      const response = await VariantsService.getListByItemId(id);
      setVariantList(response.data);
      const formatted = formatInventoryRecord(response.data);
      setFormatedVariantRecord(formatted);
      
      
    } catch (error) {
      console.error('Error fetching variants:', error);
    }
  };

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedImageIndex(0);
    getColorList();
    getSizeList();


    const fetchItems = async () => {
      try {
        const response = await ItemService.getItemList();
        setItemList(response.data);
        const foundItem = response.data.find(p => p._id === id);
        setItem(foundItem || null);
   if(foundItem){
         getVariantList(foundItem._id);
   }else{
    alert("Item not found");
   }
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchItems();
  }, [id]);

  if (!item) {
    return <div>Product not found</div>;
  }

  const handleSubmitReview = () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Review Submitted",
      description: "Thank you for your feedback!",
    });
    
    setShowReviewForm(false);
    setRating(0);
    setReviewText("");
  };

  // Get related products (excluding current product)
  const relatedProducts = itemList.filter(p => p._id !== id).slice(0, 4);
  
  const averageRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

  const addToCart = () =>{
  try{
    if(!selectedSize){
      toast({
        title: "Size Required",
        description: "Please select a size before adding to cart",
        variant: "destructive",
      });
      return;
    }
    if(!selectedColor){
      toast({
        title: "Color Required",
        description: "Please select a color before adding to cart",
        variant: "destructive",
      });
      return;
    }

    const userId = localStorage.getItem('userId') || '';


   

    const cartService = CartService;

    if(userId!==''){
         cartService.addToCartasync(item._id,1).then((response)=>{
    if(response.success){
            toast({
            title: "Added to Cart",
            description: "Item has been added to your cart.",
          });
    }
         }).catch((error)=>{
          console.error('Error adding to cart:', error);
          toast({
            title: "Error",
            description: "Failed to add item to cart.",
            variant: "destructive",
          });
         });
    }else{
      const tempCart = localStorage.getItem('guestCart'); 
     if(tempCart){
        const cartObj: ICart = JSON.parse(tempCart);
        const existingItem = cartObj.items.find(i => i.inventoryId._id === item._id);
        if (existingItem) {
          existingItem.qty += 1;
        } else {
          const variantItem = variantList.find(v=>v._id===selectedVariantId);
          if(!variantItem) throw new Error("Variant not found");
          cartObj.items.push({ inventoryId: variantItem, qty: 1 });
        }
        localStorage.setItem('guestCart', JSON.stringify(cartObj));
                toast({
          title: "Added to Cart",
          description: "Item has been added to your cart.",
        });
      }else{
             const variantItem = variantList.find(v=>v._id===selectedVariantId);
        const newCart: ICart = {
          _id: 'guest_cart',
          userId: 'guest',
          items: [{ inventoryId: variantItem, qty: 1 }],
          totalAmount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        toast({
          title: "Added to Cart",
          description: "Item has been added to your cart.",
        });
        localStorage.setItem('guestCart', JSON.stringify(newCart));
      }
    }

    const isStockAvailable = (size:string)=>{
      const sizeRecord = formatedVariantRecord[size];
      if(!sizeRecord) return false;
      const colorRecord = sizeRecord.colors[selectedColor];
      if(!colorRecord) return false;
      return colorRecord.totalStock > 0;
    }
    



  }catch(error){
    console.error('Error adding to cart:', error);
    toast({
      title: "Error",
      description: "Failed to add item to cart.",
      variant: "destructive",
    });
  }

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

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Product Details - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image Gallery */}
          <div className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
            {/* Main Image */}
            <div className="aspect-square bg-secondary/50 rounded-2xl overflow-hidden">
              <img 
                src={ RESOURCE_URL +'/'+ (item.images?.[selectedImageIndex] || item.images?.[0])} 
                alt={item.name}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            {item.images && item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {item.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square bg-secondary/50 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                      selectedImageIndex === index 
                        ? 'border-primary shadow-lg' 
                        : 'border-transparent'
                    }`}
                  >
                    <img 
                      src={ RESOURCE_URL +'/'+ img} 
                      alt={`${item.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">{item.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(Number(averageRating)) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">({averageRating})</span>
                </div>
                <p className="text-3xl md:text-4xl font-bold text-foreground mt-3">₹{item.price.toFixed(2)}</p>
              </div>
              <button className="p-2">
                <MoreVertical className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Description */}
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </div>

            {/* Sizes */}
            <div className="border-t border-border pt-6">
              <h3 className="text-sm font-medium text-foreground mb-3">Size</h3>
              <div className="flex gap-2 flex-wrap">
                {sizeList.map((size) => {
                  const isSizeDisabled = !formatedVariantRecord[size._id] || Object.values(formatedVariantRecord[size._id]?.colors || {}).every((c: any) => c.totalStock === 0);
                  return (
                    <button
                      key={size._id}
                      disabled={isSizeDisabled}
                      onClick={() => { setSelectedSize(size._id); setSelectedColor(""); setSelectedVariantId(formatedVariantRecord[size._id].inventoryId); }}
                      className={`px-4 py-2 rounded-full transition-colors relative ${
                        selectedSize === size._id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary text-secondary-foreground hover:bg-accent'
                      } ${isSizeDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {size.code}
                      {isSizeDisabled && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-0.5 bg-current transform -rotate-45"></div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colors */}
            <div className="border-t border-border pt-6">
              <h3 className="text-sm font-medium text-foreground mb-3">Color</h3>
              <div className="flex gap-2 flex-wrap">
                {colorList.map((color) => {
                  const isDisabled = !formatedVariantRecord[selectedSize]?.colors[color._id] || formatedVariantRecord[selectedSize]?.colors[color._id].totalStock===0;
                  return (
                    <button
                      key={color._id}
                      disabled={isDisabled}
                      onClick={() => { setSelectedColor(color._id); setSelectedVariantId(formatedVariantRecord[selectedSize].colors[color._id].inventoryId); }}
                      className={`px-4 py-2 rounded-full transition-colors ${
                        selectedColor === color._id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary text-secondary-foreground hover:bg-accent'
                      } ${isDisabled ? 'line-through opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {color.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reviews Button */}
            <div className="border-t border-border pt-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    View Reviews ({reviews.length})
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>Customer Reviews</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[60vh] pr-4">
                    <div className="space-y-6">
                      {/* Add Review Button */}
                      {!showReviewForm ? (
                        <Button 
                          onClick={() => setShowReviewForm(true)}
                          variant="outline"
                          className="w-full gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Write a Review
                        </Button>
                      ) : (
                        <div className="bg-secondary/20 p-4 rounded-lg space-y-4">
                          <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                              Your Rating
                            </label>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setRating(star)}
                                  className="p-1 hover:scale-110 transition-transform"
                                >
                                  <Star 
                                    className={`w-6 h-6 ${
                                      star <= rating 
                                        ? 'fill-yellow-400 text-yellow-400' 
                                        : 'text-muted-foreground'
                                    }`} 
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                              Your Review
                            </label>
                            <Textarea 
                              placeholder="Share your experience with this product..."
                              value={reviewText}
                              onChange={(e) => setReviewText(e.target.value)}
                              rows={4}
                            />
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setShowReviewForm(false);
                                setRating(0);
                                setReviewText("");
                              }}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                            <Button 
                              onClick={handleSubmitReview}
                              className="flex-1"
                            >
                              Submit Review
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {showReviewForm && <Separator />}
                      
                      {/* Existing Reviews */}
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b border-border pb-6 last:border-0">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarImage src={review.avatar} />
                              <AvatarFallback>{review.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-foreground">{review.name}</h4>
                                <span className="text-xs text-muted-foreground">{review.date}</span>
                              </div>
                              <div className="flex items-center mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                                  />
                                ))}
                              </div>
                              <p className="text-sm text-muted-foreground">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>

            {/* Add to Cart Button */}
            <div className="sticky bottom-24 lg:bottom-0 bg-background pt-6 border-t border-border">
              <Button  onClick={()=>addToCart()}
              disabled={!selectedVariantId || !selectedSize || !selectedColor}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-base font-semibold rounded-full"
              >
                ADD TO CART
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="border-t border-border pt-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct._id}
                _id={relatedProduct._id}
                name={relatedProduct.name}
                price={relatedProduct.price}
                images={relatedProduct.images}
                compareAtPrice={relatedProduct.compareAtPrice}
                {...relatedProduct}
              />
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProductDetail;
