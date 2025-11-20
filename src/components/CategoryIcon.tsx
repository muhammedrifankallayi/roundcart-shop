import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryIconProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  active?: boolean;
}

export const CategoryIcon = ({ icon: Icon, label, onClick, active }: CategoryIconProps) => {
  return (
    <div 
      className="flex flex-col items-center gap-2 cursor-pointer"
      onClick={onClick}
    >
      <div className={cn(
        "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
        active ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
      )}>
        <Icon className="w-7 h-7" />
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
};
