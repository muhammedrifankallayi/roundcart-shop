import { useEffect, useState } from "react";
import { ArrowLeft, CreditCard, Lock, Plus, MapPin, Check, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import hoodieImg from "@/assets/hoodie.jpg";
import sneakersImg from "@/assets/sneakers.jpg";
import { IAddress } from "@/data/models/address.model";
import { AddressService } from "@/data/services/address.service";
import { ICart } from "@/data/models/cart.model";
import { CartService } from "@/data/services/cart.service";
import AddAddressForm from "@/components/AddAddressForm";
import { RESOURCE_URL } from "@/data/constants/constants";


import { load } from '@cashfreepayments/cashfree-js';
import { CreateOrder } from "@/data/models/order.model";
import { OrderService } from "@/data/services/order.service";
import { CashFreeOrderCreate } from "@/data/models/cashfree.model";
import { CashFreePaymentService } from "@/data/services/cashfree.service";
import { LottieAnimation } from "@/components/LottieAnimation";
import congratsAnimation from "@/assets/lotties/congrats.json";




interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  variantId?: string;
}


const Checkout = () => {

  let cashfree;
  var initializeSDK = async function () {
    cashfree = await load({
      mode: "production"
    });
  };
  initializeSDK();

  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("online");

  // State for addresses and cart
  const [savedAddresses, setSavedAddresses] = useState<IAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [cart, setCart] = useState<ICart | null>(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [showCongratsAnimation, setShowCongratsAnimation] = useState(false);



  const subtotal = cart?.items?.reduce((sum, item) => sum + item.inventoryId.price * item.qty, 0);
  const shipping = 0.00;
  const tax = subtotal * 0.0;
  const codCharge = paymentMethod === "cod" ? 25 : 0;
  const total = subtotal + shipping + tax + codCharge;


  const getAllAddresses = async () => {
    setIsLoadingAddresses(true);
    try {
      const addresses = await AddressService.getListasync();
      setSavedAddresses(addresses.data);
      if (addresses.data.length > 0) {
        setSelectedAddressId(addresses.data[0]._id || "");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch addresses.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const getCart = async () => {
    setIsLoadingCart(true);
    try {
      const cartResponse = await CartService.getCartasync();
      setCart(cartResponse.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch cart data.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCart(false);
    }
  };

  const handleAddNewAddress = async (formData: IAddress) => {
    try {
      await AddressService.createAsync(formData);
      toast({
        title: "Address saved",
        description: "Your new address has been added successfully.",
      });
      setIsDialogOpen(false);
      getAllAddresses();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save address.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    getAllAddresses();
    getCart();
  }, []);


  const createCashFreeOrder = async (orderId: string, amount: number, mobile: string) => {

    try {
      const userId = localStorage.getItem('userId') || '';
      const body: CashFreeOrderCreate = {
        amount: amount,
        customerId: userId,
        customerPhone: mobile,
        orderId: orderId,
      }

      const response = await CashFreePaymentService.createOrder(body);
      console.log(response);

      if (response.success) {
        if (response.data.payment_session_id)
          doPayment(response.data.payment_session_id);
        else
          toast({
            title: "Error",
            description: "Failed to initiate payment session.",
            variant: "destructive",
          });
      }

    } catch (error) {
      console.log(error);

    }

  }


  const submitOrder = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId') || '';

      if (!userId) {
        toast({
          title: "Error",
          description: "User not logged in.",
          variant: "destructive",
        });
        return;
      }
      const orderBody: CreateOrder = {
        userId: userId,
        items: cart.items.map((item) => ({ inventoryId: item.inventoryId._id, qty: item.qty })),
        deliveryType: 'standard',
        discount: 0,
        orderDate: new Date().toISOString(),
        paymentDetails: {
          method: paymentMethod === "cod" ? "cod" : "card"
        },
        paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
        shippingAddressId: selectedAddressId,
        totalAmount: total,
        status: paymentMethod === "cod" ? "confirmed" : "processing",
      }

      const response = await OrderService.createOrder(orderBody);
      if (response.success) {
        if (paymentMethod === "cod") {
          // For COD, order is saved and confirmed
          setShowCongratsAnimation(true);

          toast({
            title: "Order Confirmed",
            description: "Your order has been placed successfully. Please pay ₹" + total + " on delivery.",
            variant: "default",
          });
          CartService.clearCartasync().then(() => { });
          setTimeout(() => navigate("/orders"), 3000);
        } else {
          // For online payment, proceed to Cashfree
          toast({
            title: "Order Created",
            description: "Your order has been created successfully. Please complete the payment.",
            variant: "default",
          });
          createCashFreeOrder(response.data._id, total, response.data.shippingAddressId.phone);
        }
      }

    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to create order.",
        variant: "destructive",
      });
    }
  }


  const doPayment = async (sessionId: string) => {
    let checkoutOptions = {
      paymentSessionId: sessionId,
      redirectTarget: "_modal",
    };
    cashfree.checkout(checkoutOptions).then((result) => {
      console.log(result, "RESULT");
      if (result.error) {
        // This will be true whenever user clicks on close icon inside the modal or any error happens during the payment
        console.log("User has closed the popup or there is some payment error, Check for Payment Status");
        console.log(result.error);
      }
      if (result.redirect) {


      }
      if (result.paymentDetails) {
        // This will be called whenever the payment is completed irrespective of transaction status
        console.log("Payment has been completed, Check for Payment Status");
        console.log(result.paymentDetails.paymentMessage);
        // Check if payment was successful
        if (result.paymentDetails.paymentStatus === 'SUCCESS' || result.paymentDetails.paymentStatus === 'COMPLETED') {
          setShowCongratsAnimation(true);
          CartService.clearCartasync().then(() => { });
          toast({
            title: "Order Confirmed",
            description: "Your order has been placed successfully. Please pay ₹" + total + " on delivery.",
            variant: "default",
          });
          setTimeout(() => navigate("/orders"), 3000);
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {showCongratsAnimation && (
        <LottieAnimation
          animationData={congratsAnimation}
          duration={3000}
          onComplete={() => setShowCongratsAnimation(false)}
        />
      )}
      <header className="sticky top-0 bg-background border-b border-border z-40 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Lock className="w-4 h-4" />
            <span className="text-sm">Secure Checkout</span>
          </div>
        </div>
      </header>

      <div className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Checkout Form - Left Side */}
            <div className="lg:col-span-3">
              <form onSubmit={submitOrder} className="space-y-8">
                {/* Shipping Address Selection */}
                <Card className="p-6 bg-card border-border">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-foreground">Shipping Address</h2>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Plus className="w-4 h-4" />
                          Add New
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Add New Address</DialogTitle>
                          <DialogDescription>
                            Enter your shipping address details
                          </DialogDescription>
                        </DialogHeader>
                        <AddAddressForm
                          onSubmit={handleAddNewAddress}
                          onCancel={() => setIsDialogOpen(false)}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>

                  {isLoadingAddresses ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Loading addresses...
                    </div>
                  ) : savedAddresses.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No addresses found</p>
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => setIsDialogOpen(true)}
                      >
                        <Plus className="w-4 h-4" />
                        Add Your First Address
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {savedAddresses && savedAddresses?.map((address) => (
                        <Card
                          key={address._id}
                          className={`p-4 cursor-pointer transition-all border-2 ${selectedAddressId === address._id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                            }`}
                          onClick={() => setSelectedAddressId(address._id || "")}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedAddressId === address._id
                              ? "border-primary bg-primary"
                              : "border-muted-foreground"
                              }`}>
                              {selectedAddressId === address._id && (
                                <Check className="w-3 h-3 text-primary-foreground" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="font-semibold text-foreground">{address.fullName}</p>
                                  <p className="text-sm text-muted-foreground mt-1">{address.phone}</p>
                                </div>
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <div className="mt-2 text-sm text-foreground">
                                <p>{address.addressLine1}</p>
                                {address.addressLine2 && <p>{address.addressLine2}</p>}
                                <p>{address.city}, {address.state} {address.pinCode}</p>
                                {address.country && <p>{address.country}</p>}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Payment Method Selection */}
                <Card className="p-6 bg-card border-border">
                  <div className="flex items-center gap-2 mb-6">
                    <CreditCard className="w-5 h-5 text-foreground" />
                    <h2 className="text-xl font-semibold text-foreground">Payment Method</h2>
                  </div>
                  <div className="space-y-4">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      {/* Online Payment Option */}
                      <div className="flex items-center space-x-3 p-4 border-2 border-border rounded-lg cursor-pointer hover:border-primary/50 transition-all"
                        onClick={() => setPaymentMethod("online")}
                      >
                        <RadioGroupItem value="online" id="online" />
                        <Label htmlFor="online" className="flex-1 cursor-pointer">
                          <div className="font-semibold text-foreground">Online Payment</div>
                          <p className="text-sm text-muted-foreground">Pay securely using credit/debit card</p>
                        </Label>
                      </div>

                      {/* Cash on Delivery Option */}
                      <div className="flex items-center space-x-3 p-4 border-2 border-border rounded-lg cursor-pointer hover:border-primary/50 transition-all"
                        onClick={() => setPaymentMethod("cod")}
                      >
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex-1 cursor-pointer">
                          <div className="font-semibold text-foreground">Cash on Delivery</div>
                          <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                          <p className="text-sm font-medium text-green-600 mt-1">+ ₹25 extra charge</p>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </Card>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isProcessing}
                  onClick={(e) => submitOrder(e)}
                >
                  {isProcessing ? "Processing..." : `CONFIRM ORDER - ₹${total.toFixed(2)}`}
                </Button>
              </form>
            </div>

            {/* Order Summary - Right Side */}
            <div className="lg:col-span-2">
              <Card className="p-6 bg-card border-border sticky top-24">
                <h2 className="text-xl font-semibold text-foreground mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {cart?.items?.map((item) => (
                    <div key={item.inventoryId._id} className="flex gap-4">
                      <div className="relative">
                        <img
                          src={RESOURCE_URL + '' + item.inventoryId.item.images[0]}
                          alt={item.inventoryId.item.name}
                          className="w-20 h-20 object-cover rounded-lg bg-secondary/50"
                        />
                        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                          {item.qty}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{item.inventoryId.item.name}</h3>
                        <p className="text-sm text-muted-foreground">Size: {item.inventoryId.size.code}</p>
                        <p className="text-sm font-bold text-foreground mt-1">
                          ₹{(item.inventoryId.price * item.qty).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                <div className="space-y-3">
                  <div className="flex justify-between text-foreground">
                    <span>Subtotal</span>
                    <span>₹{subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Shipping</span>
                    <span>₹{shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Tax</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  {paymentMethod === "cod" && (
                    <div className="flex justify-between text-foreground">
                      <span>COD Charge</span>
                      <span className="text-green-600 font-medium">+ ₹{codCharge.toFixed(2)}</span>
                    </div>
                  )}

                  <Separator className="my-4" />

                  <div className="flex justify-between text-lg font-bold text-foreground">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Lock className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div className="text-xs text-muted-foreground">
                      Your payment information is encrypted and secure. We never store your card details.
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
