import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, X } from "lucide-react";

const PROMO_MODAL_SHOWN_KEY = "fitfive_promo_modal_shown";

interface PromoModalProps {
    // Optional: delay before showing modal (in ms)
    delay?: number;
}

export const PromoModal = ({ delay = 2000 }: PromoModalProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if modal has been shown before
        const hasSeenPromo = localStorage.getItem(PROMO_MODAL_SHOWN_KEY);

        if (!hasSeenPromo) {
            // Show modal after delay
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, delay);

            return () => clearTimeout(timer);
        }
    }, [delay]);

    const handleClose = () => {
        // Mark as shown in localStorage
        localStorage.setItem(PROMO_MODAL_SHOWN_KEY, "true");
        setIsOpen(false);
    };

    const handleShopNow = () => {
        // Mark as shown in localStorage
        localStorage.setItem(PROMO_MODAL_SHOWN_KEY, "true");
        setIsOpen(false);
        navigate("/home");
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] border-white/10">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 z-10 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
               
                </button>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute -top-20 -left-20 w-40 h-40 bg-yellow-500/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-red-500/20 rounded-full blur-3xl" />
                </div>

                {/* Content */}
                <div className="relative p-8 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-yellow-500/20 rounded-full border border-red-500/30 mb-6">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-semibold text-yellow-400 uppercase tracking-wider">
                            Limited Time Offer
                        </span>
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                    </div>

                    {/* Main Offer */}
                    <div className="mb-6">
                        <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-400 to-red-400 mb-2">
                            50% OFF
                        </div>
                        <p className="text-white/80 text-lg">
                            On Selected Premium T-Shirts
                        </p>
                    </div>

                    {/* Launching Offer Banner */}
                    <div className="bg-gradient-to-r from-red-500/10 to-yellow-500/10 rounded-xl p-4 mb-6 border border-yellow-500/20">
                        <div className="flex items-center justify-center gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">🚀</span>
                                <div className="text-left">
                                    <p className="text-yellow-400 font-bold text-lg">Launching Offer</p>
                                    <p className="text-white/60 text-sm">Valid till <span className="text-white font-semibold">Dec 31, 2024</span></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            className="flex-1 h-12 border-white/20 text-white hover:bg-white/10 rounded-full"
                        >
                            Maybe Later
                        </Button>
                        <Button
                            onClick={handleShopNow}
                            className="flex-1 h-12 bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600 text-white font-semibold rounded-full border-0 shadow-lg shadow-red-500/25"
                        >
                            Shop Now
                        </Button>
                    </div>

                    {/* Footer Note */}
                    <p className="text-white/40 text-xs mt-4">
                        *Offer valid while stocks last. T&C apply.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PromoModal;
