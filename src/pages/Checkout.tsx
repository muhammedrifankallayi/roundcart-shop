import { useState } from "react";
import { ArrowLeft, CreditCard, Lock, Plus, MapPin, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
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

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
}

interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Mock saved addresses
  const [savedAddresses] = useState<Address[]>([
    {
      id: "1",
      name: "John Doe",
      phone: "+1 (555) 123-4567",
      street: "123 Main Street, Apt 4B",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States"
    },
    {
      id: "2",
      name: "John Doe",
      phone: "+1 (555) 987-6543",
      street: "456 Park Avenue",
      city: "Brooklyn",
      state: "NY",
      zip: "11201",
      country: "United States"
    }
  ]);
  
  const [selectedAddressId, setSelectedAddressId] = useState<string>(savedAddresses[0]?.id || "");

  // Mock cart items - in real app, this would come from global state
  const cartItems: CartItem[] = [
    { id: "1", name: "Graphic Hoodie", price: 110.59, image: hoodieImg, quantity: 1, size: "M" },
    { id: "3", name: "Classic Sneakers", price: 95.99, image: sneakersImg, quantity: 1, size: "42" },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 10.00;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Order placed successfully!",
        description: "You will receive a confirmation email shortly.",
      });
      navigate("/orders");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
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
              <form onSubmit={handleSubmit} className="space-y-8">
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
                        <div className="space-y-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="newFirstName">First Name</Label>
                              <Input id="newFirstName" placeholder="John" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="newLastName">Last Name</Label>
                              <Input id="newLastName" placeholder="Doe" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newPhone">Phone Number</Label>
                            <Input id="newPhone" type="tel" placeholder="+1 (555) 000-0000" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newAddress">Street Address</Label>
                            <Input id="newAddress" placeholder="123 Main Street" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="newCity">City</Label>
                              <Input id="newCity" placeholder="New York" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="newState">State</Label>
                              <Input id="newState" placeholder="NY" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="newZip">ZIP Code</Label>
                              <Input id="newZip" placeholder="10001" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="newCountry">Country</Label>
                              <Input id="newCountry" placeholder="United States" />
                            </div>
                          </div>
                          <Button 
                            className="w-full" 
                            onClick={() => {
                              toast({
                                title: "Address saved",
                                description: "Your new address has been added successfully.",
                              });
                              setIsDialogOpen(false);
                            }}
                          >
                            Save Address
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <div className="space-y-3">
                    {savedAddresses.map((address) => (
                      <Card
                        key={address.id}
                        className={`p-4 cursor-pointer transition-all border-2 ${
                          selectedAddressId === address.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedAddressId(address.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            selectedAddressId === address.id
                              ? "border-primary bg-primary"
                              : "border-muted-foreground"
                          }`}>
                            {selectedAddressId === address.id && (
                              <Check className="w-3 h-3 text-primary-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-semibold text-foreground">{address.name}</p>
                                <p className="text-sm text-muted-foreground mt-1">{address.phone}</p>
                              </div>
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="mt-2 text-sm text-foreground">
                              <p>{address.street}</p>
                              <p>{address.city}, {address.state} {address.zip}</p>
                              <p>{address.country}</p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>

                {/* Payment Information */}
                <Card className="p-6 bg-card border-border">
                  <div className="flex items-center gap-2 mb-6">
                    <CreditCard className="w-5 h-5 text-foreground" />
                    <h2 className="text-xl font-semibold text-foreground">Payment Information</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" required />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input id="cardName" placeholder="John Doe" required />
                    </div>
                  </div>
                </Card>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : `PAY $${total.toFixed(2)}`}
                </Button>
              </form>
            </div>

            {/* Order Summary - Right Side */}
            <div className="lg:col-span-2">
              <Card className="p-6 bg-card border-border sticky top-24">
                <h2 className="text-xl font-semibold text-foreground mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg bg-secondary/50"
                        />
                        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                        <p className="text-sm font-bold text-foreground mt-1">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                <div className="space-y-3">
                  <div className="flex justify-between text-foreground">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between text-lg font-bold text-foreground">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
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
