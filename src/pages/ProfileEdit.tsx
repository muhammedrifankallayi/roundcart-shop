import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { BottomNav } from "@/components/BottomNav";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Fashion enthusiast and style explorer",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
    navigate(-1);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-background border-b border-border z-40 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-lg font-semibold text-foreground">Edit Profile</h1>
          <div className="w-16" />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <Card className="p-6 bg-card border-border">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {formData.firstName[0]}{formData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <Button type="button" variant="outline" size="sm">
                Change Photo
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                JPG, PNG or GIF. Max size 5MB
              </p>
            </div>
          </Card>

          {/* Personal Information */}
          <Card className="p-6 bg-card border-border">
            <h2 className="text-xl font-semibold text-foreground mb-6">Personal Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input 
                  id="bio" 
                  value={formData.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  placeholder="Tell us about yourself"
                />
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProfileEdit;
