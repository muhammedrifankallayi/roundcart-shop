import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IAddress } from "@/data/models/address.model";
import { UserData } from "@/data/models/user.model";

interface AddAddressFormProps {
  onSubmit: (address: IAddress) => void | Promise<void>;
  onCancel: () => void;
}

const AddAddressForm = ({ onSubmit, onCancel }: AddAddressFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    userId: "",
  });

  // Initialize fullName from localStorage
  useEffect(() => {
   const userData:UserData = JSON.parse(localStorage.getItem("userData") || "{}");
    const userId = localStorage.getItem("userId");
    
    if (userData.name) {
      setFormData((prev) => ({
        ...prev,
        fullName: userData.name,
        email: userData.email || "",
       
      }));
    }
    
    if (userId) {
      setFormData((prev) => ({
        ...prev,
        userId: userId,
      }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    // Special handling for phone field - only allow digits and max 10
    if (id === "phone") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        [id]: digitsOnly,
      }));
      // Clear phone error when user starts typing
      if (errors.phone) {
        setErrors((prev) => ({
          ...prev,
          phone: "",
        }));
      }
    } 
    // Special handling for pinCode - only allow digits
    else if (id === "pinCode") {
      const digitsOnly = value.replace(/\D/g, "");
      setFormData((prev) => ({
        ...prev,
        [id]: digitsOnly,
      }));
      // Clear pinCode error when user starts typing
      if (errors.pinCode) {
        setErrors((prev) => ({
          ...prev,
          pinCode: "",
        }));
      }
    }
    else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
      // Clear error for this field when user starts typing
      if (errors[id]) {
        setErrors((prev) => ({
          ...prev,
          [id]: "",
        }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.fullName || formData.fullName.trim() === "") {
      newErrors.fullName = "Full name is required";
    }

    // Phone validation
    if (!formData.phone || formData.phone.trim() === "") {
      newErrors.phone = "Mobile number is required";
    } else if (formData.phone.length !== 10) {
      newErrors.phone = "Mobile number must be exactly 10 digits";
    }

    // Pin code validation
    if (!formData.pinCode || formData.pinCode.trim() === "") {
      newErrors.pinCode = "PIN code is required";
    }

    // Address line 1 validation
    if (!formData.addressLine1 || formData.addressLine1.trim() === "") {
      newErrors.addressLine1 = "Street address is required";
    }

    // City validation
    if (!formData.city || formData.city.trim() === "") {
      newErrors.city = "City is required";
    }

    // State validation
    if (!formData.state || formData.state.trim() === "") {
      newErrors.state = "State is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!formData.userId) {
      alert("User not logged in");
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData as IAddress);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
          />
          {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Mobile Number *</Label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500 font-medium pointer-events-none">+91</span>
            <Input
              id="phone"
              type="tel"
              placeholder="10 digit mobile number"
              value={formData.phone}
              onChange={handleChange}
              maxLength={10}
              className="pl-10"
            />
          </div>
          {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="addressLine1">Street Address *</Label>
        <Input
          id="addressLine1"
          placeholder="123 Main Street"
          value={formData.addressLine1}
          onChange={handleChange}
        />
        {errors.addressLine1 && <p className="text-xs text-red-500">{errors.addressLine1}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            placeholder="New York"
            value={formData.city}
            onChange={handleChange}
          />
          {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            placeholder="eg:Kerala"
            value={formData.state}
            onChange={handleChange}
          />
          {errors.state && <p className="text-xs text-red-500">{errors.state}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pinCode">PIN Code *</Label>
          <Input
            id="pinCode"
            placeholder="eg:657867  "
            value={formData.pinCode}
            onChange={handleChange}
          />
          {errors.pinCode && <p className="text-xs text-red-500">{errors.pinCode}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            placeholder="eg : India"
            value={formData.country}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Address"}
        </Button>
      </div>
    </form>
  );
};

export default AddAddressForm;
