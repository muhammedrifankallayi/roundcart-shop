import { useEffect, useState } from "react";
import { ArrowLeft, Trash2, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BottomNav } from "@/components/BottomNav";
import { AuthModal } from "@/components/AuthModal";
import { useCart } from "@/contexts/CartContext";

import hoodieImg from "@/assets/hoodie.jpg";
import { ICart } from "@/data/models/cart.model";
import { CartService } from "@/data/services/cart.service";
import { RESOURCE_URL } from "@/data/constants/constants";
import { UserData } from "@/data/models/user.model";

const Cart = () => {
  const navigate = useNavigate();
  const { refreshCartCount } = useCart();
  const [cart, setCart] = useState<ICart>();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const updateQuantity = (cartItem: any, delta: number) => {
    if (!cart?.items) return;
    const userId = localStorage.getItem('userId');
    const itemId = cartItem.itemId._id;
    const sizeId = cartItem.sizeId?._id;
    const colorId = cartItem.colorId?._id;

    if (!userId) {
      const newCart = { ...cart };
      const itemIndex = newCart.items.findIndex(i =>
        i.itemId._id === itemId &&
        i.sizeId?._id === sizeId &&
        i.colorId?._id === colorId
      );

      if (itemIndex > -1) {
        const newQty = newCart.items[itemIndex].qty + delta;
        if (newQty < 1) return;
        newCart.items[itemIndex] = { ...newCart.items[itemIndex], qty: newQty };
        setCart(newCart);
        localStorage.setItem('guestCart', JSON.stringify(newCart));
        refreshCartCount();
      }
      return;
    }

    const newQty = cartItem.qty + delta;
    if (newQty < 1) return;
    CartService.updateItemQuantityasync(cartItem._id, newQty).then((response) => {
      setCart(response.data);
      refreshCartCount();
    });
  };

  const removeItem = (cartItem: any) => {
    if (!cart?.items) return;
    const userId = localStorage.getItem('userId');

    if (!userId) {
      const newCart = { ...cart };
      newCart.items = newCart.items.filter(i =>
        !(i.itemId._id === cartItem.itemId._id &&
          i.sizeId?._id === cartItem.sizeId?._id &&
          i.colorId?._id === cartItem.colorId?._id)
      );
      setCart(newCart);
      localStorage.setItem('guestCart', JSON.stringify(newCart));
      refreshCartCount();
      return;
    }

    CartService.removeItemFromCartasync(cartItem._id).then((response) => {
      setCart(response.data);
      refreshCartCount();
    }).catch((error) => {
      console.error('Error removing item from cart:', error);
    });
  };

  const subtotal = cart?.items?.filter(i => i.itemId).reduce((sum, item) => sum + item.itemId.price * item.qty, 0) || 0;
  const shipping = 0.00;
  const total = subtotal + shipping;

  const getCartItems = () => {
    try {
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '{}') as ICart;
      const userId = localStorage.getItem('userId');
      if (userId) {
        CartService.getCartasync().then((response) => {
          setCart(response.data || guestCart);
        }, err => {
          if (guestCart && guestCart.items) {
            setCart(guestCart);
          }
        })
      } else {
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '{}') as ICart;
        if (guestCart && guestCart.items) {
          setCart(guestCart);
        }
      }

    } catch (error) {

    }
  }

  const onCheckout = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setIsAuthModalOpen(true);
      return;
    }
    navigate('/checkout');
  };

  const handleAuthSuccess = (userData: UserData) => {
    const cartData = localStorage.getItem('guestCart');
    if (cartData) {
      const guestCart = JSON.parse(cartData) as ICart;
      const items = guestCart.items.map(item => ({
        itemId: typeof item.itemId === 'string' ? item.itemId : item.itemId?._id,
        qty: item.qty,
        sizeId: typeof item.sizeId === 'string' ? item.sizeId : item.sizeId?._id,
        colorId: typeof item.colorId === 'string' ? item.colorId : item.colorId?._id
      })).filter(item => item.itemId); // Ensure we only send valid items
      if (items.length > 0) {
        CartService.addBulkToCartasync(items).then((response) => {
          setCart(response.data);
          localStorage.removeItem('guestCart');
          refreshCartCount();
          navigate('/checkout');
        });
        return;
      }
      navigate('/checkout');
    };
  }

  useEffect(() => {
    getCartItems();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <header className="sticky top-0 bg-background border-b border-border z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Shopping Cart</h1>
          <div className="w-6" />
        </div>
      </header>

      <div className="px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {!cart?.items || cart?.items?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Your cart is empty</p>
              <Button onClick={() => navigate('/')} size="lg">
                Shop Now
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {cart?.items?.filter(i => i.itemId).map((item) => {
                  const offerPercentage = (item.itemId.compareAtPrice || 0) > 0
                    ? Math.round(((((item.itemId.compareAtPrice || 0) - item.itemId.price) / (item.itemId.compareAtPrice || 1)) * 100))
                    : 0;

                  return (
                    <Card key={item.itemId._id} className="p-4 bg-card border-border">
                      <div className="flex gap-4">
                        <img
                          src={RESOURCE_URL + '' + item.itemId.images[0] || hoodieImg}
                          alt={item.itemId.name}
                          className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg bg-secondary/50"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">{item.itemId.name}</h3>

                          {(item.sizeId || item.colorId) && (
                            <div className="flex flex-wrap gap-2 mt-1">
                              {item.sizeId && (
                                <span className="text-[10px] bg-secondary/80 px-1.5 py-0.5 rounded text-muted-foreground border border-border">
                                  Size: {item.sizeId.code || item.sizeId.name}
                                </span>
                              )}
                              {item.colorId && (
                                <div className="flex items-center gap-1.5 bg-secondary/80 px-1.5 py-0.5 rounded text-muted-foreground border border-border">
                                  <span className="text-[10px]">Color: {item.colorId.name}</span>
                                  <span
                                    className="w-2 h-2 rounded-full border border-black/10"
                                    style={{ backgroundColor: item.colorId.hex }}
                                  />
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-2 mt-2">
                            <p className="text-lg font-bold text-foreground">₹{item.itemId.price.toFixed(2)}</p>
                            {(item.itemId.compareAtPrice || 0) > 0 && (
                              <>
                                <p className="text-sm text-muted-foreground line-through">₹{(item.itemId.compareAtPrice || 0).toFixed(2)}</p>
                                <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded">{offerPercentage}% OFF</span>
                              </>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 mt-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item, -1)}
                          className="h-8 w-8"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="text-foreground font-medium min-w-[2rem] text-center">
                          {item.qty}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item, 1)}
                          className="h-8 w-8"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>

              <div className="lg:col-span-1">
                <Card className="p-6 bg-card border-border sticky top-20">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Order Summary</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between text-foreground">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-foreground">
                      <span>Shipping</span>
                      <span>₹{shipping.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-border pt-3 mt-3">
                      <div className="flex justify-between text-lg font-bold text-foreground">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full mt-6" size="lg" onClick={() => onCheckout()}>
                    CHECKOUT
                  </Button>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Cart;
