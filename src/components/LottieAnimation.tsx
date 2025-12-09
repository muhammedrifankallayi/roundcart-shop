import { useEffect, useRef } from 'react';
import Lottie from 'lottie-react';

interface LottieAnimationProps {
  animationData: any;
  duration?: number;
  onComplete?: () => void;
  className?: string;
}

export const LottieAnimation = ({ 
  animationData, 
  duration = 2000, 
  onComplete,
  className = '' 
}: LottieAnimationProps) => {
  const animationRef = useRef<any>(null);

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.play();
    }

    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/50 ${className}`}>
      <div className="bg-background rounded-lg p-8 shadow-lg">
        <Lottie
          lottieRef={animationRef}
          animationData={animationData}
          loop={false}
          autoplay={true}
          style={{ width: 300, height: 300 }}
        />
      </div>
    </div>
  );
};

