import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AuthService } from "@/data/services/auth.service";
import { UserData } from "@/data/models/user.model";
import { AuthHelper } from "@/lib/authHelper";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: (user: UserData) => void;
}

type AuthMode = "login" | "register";

export const AuthModal = ({ isOpen, onClose, onAuthSuccess }: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Login form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form states
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await AuthService.userLogin({
        email: loginEmail,
        password: loginPassword,
      });

      if (response.success) {
        // Save to localStorage using helper
        AuthHelper.saveAuthData(response.user._id, response.token, response.refreshToken, response.user);

        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });

        // Reset form
        setLoginEmail("");
        setLoginPassword("");

        // Callback
        onAuthSuccess?.(response.user);
        onClose();
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error?.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (registerPassword.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await AuthService.userRegister({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      });

      if (response.success) {
        // Save to localStorage using helper
        AuthHelper.saveAuthData(response.user._id, response.token, response.refreshToken, response.user);

        toast({
          title: "Registration Successful",
          description: "Welcome to FitFit!",
        });

        // Reset form
        setRegisterName("");
        setRegisterEmail("");
        setRegisterPassword("");
        setRegisterConfirmPassword("");

        // Callback
        onAuthSuccess?.(response.user);
        onClose();
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error?.response?.data?.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setLoginEmail("");
    setLoginPassword("");
    setRegisterName("");
    setRegisterEmail("");
    setRegisterPassword("");
    setRegisterConfirmPassword("");
    setMode("login");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "login" ? "Login to FitFit" : "Create Account"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {mode === "login" ? (
            <>
              {/* Login Form */}
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  disabled={isLoading}
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  disabled={isLoading}
                  className="h-9"
                />
              </div>

              <Button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full h-9 mt-4"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <button
                  onClick={() => setMode("register")}
                  className="text-primary hover:underline font-medium"
                  disabled={isLoading}
                >
                  Sign up
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Register Form */}
              <div className="space-y-2">
                <Label htmlFor="register-name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  disabled={isLoading}
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="Enter your email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  disabled={isLoading}
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  disabled={isLoading}
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-confirm" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <Input
                  id="register-confirm"
                  type="password"
                  placeholder="Confirm your password"
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="h-9"
                />
              </div>

              <Button
                onClick={handleRegister}
                disabled={isLoading}
                className="w-full h-9 mt-4"
              >
                {isLoading ? "Creating account..." : "Sign up"}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <button
                  onClick={() => setMode("login")}
                  className="text-primary hover:underline font-medium"
                  disabled={isLoading}
                >
                  Login
                </button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
