import { cn } from "@/lib/utils";

interface LoaderProps {
    size?: "sm" | "md" | "lg" | "xl";
    variant?: "spinner" | "dots" | "pulse" | "skeleton-grid";
    text?: string;
    fullScreen?: boolean;
    className?: string;
}

const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
};

const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
};

/**
 * A beautiful, reusable loader component with multiple variants
 */
export function Loader({
    size = "md",
    variant = "spinner",
    text,
    fullScreen = false,
    className,
}: LoaderProps) {
    const renderLoader = () => {
        switch (variant) {
            case "spinner":
                return (
                    <div className="relative">
                        {/* Outer glow ring */}
                        <div
                            className={cn(
                                sizeClasses[size],
                                "absolute inset-0 rounded-full",
                                "bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30",
                                "blur-md animate-pulse"
                            )}
                        />
                        {/* Main spinner */}
                        <div
                            className={cn(
                                sizeClasses[size],
                                "relative rounded-full",
                                "border-2 border-muted/30",
                                "border-t-primary border-r-primary/60",
                                "animate-spin"
                            )}
                            style={{ animationDuration: "0.8s" }}
                        />
                        {/* Inner dot */}
                        <div
                            className={cn(
                                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                                "rounded-full bg-primary/80",
                                size === "sm" && "w-1 h-1",
                                size === "md" && "w-2 h-2",
                                size === "lg" && "w-3 h-3",
                                size === "xl" && "w-4 h-4",
                                "animate-pulse"
                            )}
                        />
                    </div>
                );

            case "dots":
                return (
                    <div className="flex items-center gap-1.5">
                        {[0, 1, 2].map((index) => (
                            <div
                                key={index}
                                className={cn(
                                    "rounded-full bg-primary",
                                    size === "sm" && "w-2 h-2",
                                    size === "md" && "w-3 h-3",
                                    size === "lg" && "w-4 h-4",
                                    size === "xl" && "w-5 h-5",
                                    "animate-bounce"
                                )}
                                style={{
                                    animationDelay: `${index * 0.15}s`,
                                    animationDuration: "0.6s",
                                }}
                            />
                        ))}
                    </div>
                );

            case "pulse":
                return (
                    <div className="relative">
                        {/* Pulsing rings */}
                        {[0, 1, 2].map((index) => (
                            <div
                                key={index}
                                className={cn(
                                    sizeClasses[size],
                                    "absolute inset-0 rounded-full border-2 border-primary/40",
                                    "animate-ping"
                                )}
                                style={{
                                    animationDelay: `${index * 0.4}s`,
                                    animationDuration: "1.5s",
                                }}
                            />
                        ))}
                        {/* Center circle */}
                        <div
                            className={cn(
                                sizeClasses[size],
                                "relative rounded-full",
                                "bg-gradient-to-br from-primary to-primary/60",
                                "animate-pulse shadow-lg shadow-primary/20"
                            )}
                        />
                    </div>
                );

            case "skeleton-grid":
                return (
                    <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, index) => (
                            <div
                                key={index}
                                className="space-y-3 animate-pulse"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="aspect-square bg-muted rounded-2xl" />
                                <div className="space-y-2">
                                    <div className="h-4 bg-muted rounded-lg w-3/4" />
                                    <div className="h-3 bg-muted rounded-lg w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    if (variant === "skeleton-grid") {
        return <div className={cn("px-4 py-4", className)}>{renderLoader()}</div>;
    }

    const content = (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-4",
                fullScreen && "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
                className
            )}
        >
            {renderLoader()}
            {text && (
                <p
                    className={cn(
                        textSizeClasses[size],
                        "text-muted-foreground font-medium animate-pulse"
                    )}
                >
                    {text}
                </p>
            )}
        </div>
    );

    return content;
}

/**
 * Product card skeleton loader for consistent loading states
 */
export function ProductCardSkeleton() {
    return (
        <div className="space-y-3 animate-pulse">
            <div className="aspect-square bg-muted rounded-2xl relative overflow-hidden">
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-muted rounded-lg w-3/4" />
                <div className="flex items-center gap-2">
                    <div className="h-4 bg-muted rounded-lg w-1/3" />
                    <div className="h-3 bg-muted/60 rounded-lg w-1/4" />
                </div>
            </div>
        </div>
    );
}

/**
 * Product detail skeleton loader
 */
export function ProductDetailSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 animate-pulse">
            {/* Product Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Section */}
                <div className="space-y-4">
                    {/* Main Image */}
                    <div className="aspect-square bg-muted rounded-2xl relative overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                    </div>
                    {/* Thumbnails */}
                    <div className="grid grid-cols-4 gap-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-square bg-muted rounded-lg" />
                        ))}
                    </div>
                </div>

                {/* Info Section */}
                <div className="space-y-6">
                    {/* Title & Rating */}
                    <div className="space-y-3">
                        <div className="h-8 bg-muted rounded-lg w-2/3" />
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-4 h-4 bg-muted rounded" />
                                ))}
                            </div>
                            <div className="h-4 bg-muted rounded w-12" />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-10 bg-muted rounded-lg w-32" />
                            <div className="h-6 bg-muted/60 rounded-lg w-20" />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="border-t border-border pt-6 space-y-3">
                        <div className="h-5 bg-muted rounded-lg w-28" />
                        <div className="space-y-2">
                            <div className="h-4 bg-muted/80 rounded w-full" />
                            <div className="h-4 bg-muted/80 rounded w-full" />
                            <div className="h-4 bg-muted/80 rounded w-3/4" />
                        </div>
                    </div>

                    {/* Sizes */}
                    <div className="border-t border-border pt-6 space-y-3">
                        <div className="h-4 bg-muted rounded-lg w-12" />
                        <div className="flex gap-2">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="w-12 h-10 bg-muted rounded-full" />
                            ))}
                        </div>
                    </div>

                    {/* Colors */}
                    <div className="border-t border-border pt-6 space-y-3">
                        <div className="h-4 bg-muted rounded-lg w-12" />
                        <div className="flex gap-2">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-16 h-10 bg-muted rounded-full" />
                            ))}
                        </div>
                    </div>

                    {/* Button */}
                    <div className="pt-6 border-t border-border">
                        <div className="h-14 bg-muted rounded-full w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export { Loader as default };
