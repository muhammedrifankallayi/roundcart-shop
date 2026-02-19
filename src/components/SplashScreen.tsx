import { useEffect, useRef } from "react";
import gsap from "gsap";

const SESSION_KEY = "fitfive_splash_shown";

// Exact same characters as LandingPage preloader
const CHARS = ["T", "H", "E", " ", "F", "I", "T", "F", "I", "V", "E"];

interface SplashScreenProps {
    onDone: () => void;
}

export function SplashScreen({ onDone }: SplashScreenProps) {
    const preloaderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Mirror the exact GSAP timeline from LandingPage
        const tl = gsap.timeline({
            onComplete: () => {
                sessionStorage.setItem(SESSION_KEY, "1");
                onDone();
            },
        });

        tl.to(".splash-char", {
            y: 0,
            stagger: 0.05,
            duration: 0.8,
            ease: "power4.out",
        })
            .to(".splash-char", {
                y: "-100%",
                stagger: 0.05,
                duration: 0.6,
                ease: "power4.in",
                delay: 0.3,
            })
            .to(preloaderRef.current, {
                y: "-100%",
                duration: 1,
                ease: "expo.inOut",
            }, "-=0.2");

        return () => {
            tl.kill();
        };
    }, [onDone]);

    return (
        <div
            ref={preloaderRef}
            className="fixed inset-0 z-[10000] bg-black flex items-center justify-center"
        >
            <div className="text-4xl font-bold overflow-hidden flex space-x-2">
                {CHARS.map((char, i) => (
                    <span
                        key={i}
                        className="splash-char inline-block text-white"
                        style={{
                            transform: "translateY(100%)",
                            width: char === " " ? "0.5em" : undefined,
                        }}
                    >
                        {char}
                    </span>
                ))}
            </div>
        </div>
    );
}

/** Returns true if splash should be shown this session */
export function shouldShowSplash(): boolean {
    return !sessionStorage.getItem(SESSION_KEY);
}
