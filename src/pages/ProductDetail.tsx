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
import { Loader, ProductDetailSkeleton } from "@/components/ui/loader";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { LottieAnimation } from "@/components/LottieAnimation";
import { AuthModal } from "@/components/AuthModal";
import successAnimation from "@/assets/lotties/success.json";

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
import { Item, IItemReview } from "@/data/models/item.model";
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
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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

  const getVariantList = async (id: string) => {
    try {
      if (id === null) return;
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
    setIsLoading(true);

    const loadData = async () => {
      try {
        // Fetch all data in parallel
        await Promise.all([getColorList(), getSizeList()]);

        const response = await ItemService.getItemList();
        setItemList(response.data);
        const foundItem = response.data.find(p => p._id === id);
        setItem(foundItem || null);
        if (foundItem) {
          await getVariantList(foundItem._id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Show skeleton loader while loading
  if (isLoading) {
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
        <ProductDetailSkeleton />
        <BottomNav />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">😕</div>
          <h2 className="text-xl font-semibold text-foreground">Product not found</h2>
          <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/products')} variant="outline">
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsSubmittingReview(true);
    try {
      const reviewData: IItemReview = {
        userId: userId,
        rating: rating,
        comment: reviewText,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const response = await ItemService.addItemReview(item!._id, reviewData);

      if (response.success) {
        // Update the item with the new review
        setItem(prev => prev ? {
          ...prev,
          reviews: [...(prev.reviews || []), response.data]
        } : null);

        toast({
          title: "Review Submitted",
          description: "Thank you for your feedback!",
        });

        setShowReviewForm(false);
        setRating(0);
        setReviewText("");
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Get related products (excluding current product)
  const relatedProducts = itemList.filter(p => p._id !== id).slice(0, 4);

  // Calculate average rating from item reviews
  const reviews = item?.reviews || [];
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const addToCart = () => {
    try {
      if (!selectedSize) {
        toast({
          title: "Size Required",
          description: "Please select a size before adding to cart",
          variant: "destructive",
        });
        return;
      }
      if (!selectedColor) {
        toast({
          title: "Color Required",
          description: "Please select a color before adding to cart",
          variant: "destructive",
        });
        return;
      }

      const userId = localStorage.getItem('userId') || '';




      const cartService = CartService;

      if (userId !== '') {
        cartService.addToCartasync(selectedVariantId, 1).then((response) => {
          if (response.success) {
            setShowSuccessAnimation(true);
            toast({
              title: "Added to Cart",
              description: "Item has been added to your cart.",
            });
          }
        }).catch((error) => {
          console.error('Error adding to cart:', error);
          toast({
            title: "Error",
            description: "Failed to add item to cart.",
            variant: "destructive",
          });
        });
      } else {
        const tempCart = localStorage.getItem('guestCart');
        if (tempCart) {
          const cartObj: ICart = JSON.parse(tempCart);
          const existingItem = cartObj.items.find(i => i.inventoryId._id === selectedVariantId);
          if (existingItem) {
            existingItem.qty += 1;
          } else {
            const variantItem = variantList.find(v => v._id === selectedVariantId);
            if (!variantItem) throw new Error("Variant not found");
            cartObj.items.push({ inventoryId: variantItem, qty: 1 });
          }
          localStorage.setItem('guestCart', JSON.stringify(cartObj));
          setShowSuccessAnimation(true);
          toast({
            title: "Added to Cart",
            description: "Item has been added to your cart.",
          });
        } else {
          const variantItem = variantList.find(v => v._id === selectedVariantId);
          const newCart: ICart = {
            _id: 'guest_cart',
            userId: 'guest',
            items: [{ inventoryId: variantItem, qty: 1 }],
            totalAmount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setShowSuccessAnimation(true);
          toast({
            title: "Added to Cart",
            description: "Item has been added to your cart.",
          });
          localStorage.setItem('guestCart', JSON.stringify(newCart));
        }
      }

      const isStockAvailable = (size: string) => {
        const sizeRecord = formatedVariantRecord[size];
        if (!sizeRecord) return false;
        const colorRecord = sizeRecord.colors[selectedColor];
        if (!colorRecord) return false;
        return colorRecord.totalStock > 0;
      }




    } catch (error) {
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
      {showSuccessAnimation && (
        <LottieAnimation
          animationData={successAnimation}
          duration={2000}
          onComplete={() => setShowSuccessAnimation(false)}
        />
      )}

      {/* Auth Modal for Review */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={() => {
          setIsAuthModalOpen(false);
          toast({
            title: "Login Successful",
            description: "You can now submit your review!",
          });
        }}
      />
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
                src={RESOURCE_URL + '' + (item.images?.[selectedImageIndex] || item.images?.[0])}
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
                    className={`aspect-square bg-secondary/50 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${selectedImageIndex === index
                      ? 'border-primary shadow-lg'
                      : 'border-transparent'
                      }`}
                  >
                    <img
                      src={RESOURCE_URL + '' + img}
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
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  {(() => {
                    const selectedVariant = variantList.find(v => v._id === selectedVariantId);
                    const displayPrice = selectedVariant?.price || item.price;
                    const displayCompareAtPrice = selectedVariant?.compareAtPrice || item.compareAtPrice;
                    const offerPercentage = displayCompareAtPrice && displayCompareAtPrice > 0
                      ? Math.round(((displayCompareAtPrice - displayPrice) / displayCompareAtPrice) * 100)
                      : 0;

                    return (
                      <>
                        <p className="text-3xl md:text-4xl font-bold text-foreground">₹{displayPrice.toFixed(2)}</p>
                        {displayCompareAtPrice && displayCompareAtPrice > 0 && (
                          <>
                            <p className="text-lg text-muted-foreground line-through">₹{displayCompareAtPrice.toFixed(2)}</p>
                            {offerPercentage > 0 && (
                              <span className="text-sm font-semibold text-red-500 bg-red-50 px-2 py-1 rounded">{offerPercentage}% OFF</span>
                            )}
                          </>
                        )}
                      </>
                    );
                  })()}
                </div>
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
                      className={`px-4 py-2 rounded-full transition-colors relative ${selectedSize === size._id
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
                  const isDisabled = !formatedVariantRecord[selectedSize]?.colors[color._id] || formatedVariantRecord[selectedSize]?.colors[color._id].totalStock === 0;
                  return (
                    <button
                      key={color._id}
                      disabled={isDisabled}
                      onClick={() => { setSelectedColor(color._id); setSelectedVariantId(formatedVariantRecord[selectedSize].colors[color._id].inventoryId); }}
                      className={`px-4 py-2 rounded-full transition-colors ${selectedColor === color._id
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
                                    className={`w-6 h-6 ${star <= rating
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
                              disabled={isSubmittingReview}
                            >
                              {isSubmittingReview ? "Submitting..." : "Submit Review"}
                            </Button>
                          </div>
                        </div>
                      )}

                      {showReviewForm && <Separator />}

                      {/* Existing Reviews */}
                      {reviews.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                        </div>
                      ) : (
                        reviews.map((review, index) => (
                          <div key={review._id || index} className="border-b border-border pb-6 last:border-0">
                            <div className="flex items-start gap-4">
                              <Avatar>
                                <AvatarFallback>
                                  {review.userId?.slice(0, 2).toUpperCase() || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-semibold text-foreground">Customer</h4>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(review.createdAt).toLocaleDateString('en-IN', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center mb-2">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                                    />
                                  ))}
                                </div>
                                {review.comment && (
                                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>

            {/* Add to Cart & WhatsApp Buttons */}
            <div className="sticky bottom-24 lg:bottom-0 bg-background pt-6 border-t border-border">
              <div className="flex gap-3">
                <Button onClick={() => addToCart()}
                  className="flex-1 h-14 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold rounded-full"
                >
                  ADD TO CART
                </Button>
                <a
                  href={`https://wa.me/8138957263?text=${encodeURIComponent(`I need product ${item.name}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 flex-1 h-14 bg-[#25D366] hover:bg-[#20BD5A] text-white text-base font-semibold rounded-full transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 fill-current"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <small>Buy on WhatsApp</small>
                </a>
              </div>
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
