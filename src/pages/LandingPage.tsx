import React, { useEffect, useRef, useState } from 'react';
import { Plane, Ship, Truck, Box, Mail, Phone, Shirt, ShoppingBag, Crown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link, useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MusicPlayer } from "@/components/MusicPlayer";
import modelPoseImg from "@/assets/model-pose.jpg";

// NOTE: This component expects TailwindCSS to be available in your app (via CDN or compiled Tailwind).
// It also expects lucide-react and gsap packages to be installed. If you prefer CDN scripts,
// move the imports out and include the script tags in your index.html.

export default function LandingPage() {
  const navigate = useNavigate();
  const cursorDot = useRef(null);
  const cursorOutline = useRef(null);
  const preloader = useRef(null);
  const trackResult = useRef(null);
  const trackInput = useRef(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isComingSoonModalOpen, setIsComingSoonModalOpen] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Cursor
    function onMouseMove(e) {
      const posX = e.clientX;
      const posY = e.clientY;
      if (cursorDot.current) {
        cursorDot.current.style.left = `${posX}px`;
        cursorDot.current.style.top = `${posY}px`;
      }
      if (cursorOutline.current) {
        // animate outline smoothly
        gsap.to(cursorOutline.current, { left: posX, top: posY, duration: 0.35, ease: 'power2.out' });
      }
    }
    window.addEventListener('mousemove', onMouseMove);

    // Preloader timeline
    const tlLoader = gsap.timeline();
    tlLoader
      .to('.pre-char', { y: 0, stagger: 0.05, duration: 0.8, ease: 'power4.out' })
      .to('.pre-char', { y: '-100%', stagger: 0.05, duration: 0.6, ease: 'power4.in', delay: 0.2 })
      .to(preloader.current, { y: '-100%', duration: 1, ease: 'expo.inOut' }, '-=0.2')
      .to('.hero-text', { y: 0, stagger: 0.1, duration: 1.2, ease: 'power4.out' }, '-=0.5')
      .to('.hero-sub', { opacity: 1, duration: 1, ease: 'power2.out' }, '-=0.8')
      .to('.hero-scroll', { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '-=0.8');

    // Fade up
    gsap.utils.toArray('.fade-up').forEach((el) => {
      gsap.from((el as any), {
        scrollTrigger: { trigger: el as any, start: 'top 85%' },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });
    });

    // Service cards
    gsap.from('.service-card', {
      scrollTrigger: { trigger: '#services', start: 'top 70%' },
      y: 100,
      opacity: 0,
      stagger: 0.2,
      duration: 1.2,
      ease: 'power3.out',
    });

    // Parallax
    gsap.to('.parallax-img', {
      scrollTrigger: { trigger: '.parallax-img', start: 'top bottom', end: 'bottom top', scrub: true },
      y: 100,
      ease: 'none',
    });
    gsap.to('.parallax-content', {
      scrollTrigger: { trigger: '.parallax-img', start: 'top bottom', end: 'bottom top', scrub: true },
      y: -50,
      ease: 'none',
    });

    // Stats
    gsap.utils.toArray('.stat-item').forEach((item) => {
      gsap.from( (item as any), {
        scrollTrigger: { trigger: item as any, start: 'top 80%' },
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
      });
    });

    // marquee
    gsap.to('#marquee-content', { xPercent: -50, ease: 'none', duration: 20, repeat: -1 });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.killTweensOf(cursorOutline.current);
    };
  }, []);

  // Hover scaling handled by class selectors via event delegation
  useEffect(() => {
    const elements = document.querySelectorAll('.hover-trigger');
    elements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        const type = el.getAttribute('data-cursor');
        if (type === 'hover') {
          gsap.to(cursorOutline.current, { scale: 1.5, backgroundColor: 'rgba(255,255,255,0.1)', duration: 0.2 });
        } else if (type === 'text') {
          gsap.to(cursorOutline.current, { scale: 0.5, backgroundColor: 'rgba(255,255,255,0.8)', mixBlendMode: 'difference', duration: 0.2 });
        }
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(cursorOutline.current, { scale: 1, backgroundColor: 'transparent', mixBlendMode: 'normal', duration: 0.2 });
      });
    });

    return () => {
      elements.forEach((el) => {
        el.removeEventListener('mouseenter', () => {});
        el.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);

  function simulateTracking() {
    const btn = document.querySelector('#track-btn');
    const result = trackResult.current;
    const input = trackInput.current;
    if (!input || input.value.length < 3) return;
    if (btn) btn.innerHTML = 'Locating...';
    setTimeout(() => {
      if (btn) btn.innerHTML = 'Track';
      if (result) {
        result.classList.remove('hidden');
        gsap.from(result, { y: 20, opacity: 0, duration: 0.5 });
      }
    }, 1000);
  }

  return (
    <div className="antialiased selection:bg-white selection:text-black bg-[#050505] text-white min-h-screen">
      {/* Custom Cursor */}
      <div ref={cursorDot} className="cursor-dot fixed -translate-x-1/2 -translate-y-1/2 rounded-full w-2 h-2 bg-white z-[9999] pointer-events-none" />
      <div ref={cursorOutline} className="cursor-outline fixed -translate-x-1/2 -translate-y-1/2 rounded-full w-10 h-10 border border-white/30 z-[9998] pointer-events-none transition-[width,height]" />

      {/* Preloader */}
      <div ref={preloader} className="preloader fixed inset-0 bg-black z-[10000] flex items-center justify-center">
        <div className="preloader-text text-4xl font-bold overflow-hidden flex space-x-2">
          {['THE', 'F', 'I', 'T', 'F', 'I', 'V', 'E'].map((c, i) => (
            <span key={i} className="inline-block translate-y-full pre-char">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center mix-blend-difference text-white">
        <Link to="/" className="text-2xl font-bold tracking-tighter hover-trigger" data-cursor="hover">THE FIT FIVE</Link>
        <div className="hidden md:flex space-x-12 text-sm font-medium uppercase tracking-widest">
          <button 
            onClick={() => setIsConnectModalOpen(true)}
            className="hover:text-gray-400 transition-colors hover-trigger" 
            data-cursor="hover"
          >
            CONNECT
          </button>
          <Link to="/about" className="hover:text-gray-400 transition-colors hover-trigger" data-cursor="hover">About us</Link>
        </div>
        <MusicPlayer />
      </nav>

      {/* Hero */}
      <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundSize: '40px 40px', backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' }} />

        <div className="absolute w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse duration-[4000ms]"></div>

        <div className="relative z-10 text-center px-4">
          <h1 className="text-[12vw] leading-[0.9] font-bold tracking-tighter mix-blend-overlay opacity-80 select-none">
            <div className="line-reveal"><span className="hero-text block translate-y-full">TAKE</span></div>
            <div className="line-reveal"><span className="hero-text block translate-y-full">ACTION</span></div>
          </h1>
          <div className="mt-10 flex flex-col items-center gap-6 overflow-hidden">
            <Link 
              to="/home" 
              className="shop-now-btn border border-white/20 px-8 py-3 m-4 rounded-full text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 hover-trigger opacity-0 hero-sub relative"
              data-cursor="hover"
            >
              Shop Now
            </Link>
            <p className="text-gray-400 text-lg md:text-xl max-w-md text-center opacity-0 hero-sub"> CHOOSE YOUR PERFECT FIT </p>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 hero-scroll">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent" />
        </div>
      </section>

      {/* Marquee */}
      <div className="w-full bg-white text-black py-4 overflow-hidden whitespace-nowrap border-y border-white/10 relative z-20">
        <div className="inline-block" id="marquee-content">
          {Array.from({ length: 4 }).map((_, i) => (
            <span className="text-4xl font-bold mx-8" key={i}>UNISEX • FIVE FLEEVE TEES • DELIVERY WITHIN 3 DAYS• ALL INDIA DELIVERY •</span>
          ))}
        </div>
      </div>

      {/* Tracking Section */}
      <section id="tracking" className="py-32 px-6 md:px-20 relative bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-light mb-12 fade-up">Real-time <span className="font-bold">Tracking</span></h2>

          <div className="relative group fade-up">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative bg-black border border-white/10 rounded-lg p-2 flex items-center">
              <Box className="ml-4 text-gray-400" />
              <input
                ref={trackInput}
                type="text"
                placeholder="Enter Consignment ID (e.g., NEX-8291)"
                className="w-full bg-transparent border-none focus:ring-0 text-white px-4 py-4 text-lg placeholder-gray-600 outline-none hover-trigger"
                data-cursor="text"
                id="track-input"
              />
              <button id="track-btn" onClick={simulateTracking} className="bg-white text-black px-8 py-3 rounded hover:bg-gray-200 transition-colors font-bold uppercase tracking-wider text-sm hover-trigger" data-cursor="hover">Track</button>
            </div>
          </div>

          <div ref={trackResult} id="track-result" className="hidden mt-8 text-left bg-[#111] border border-white/5 p-6 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-bold">NEX-8291</h4>
                <p className="text-sm text-gray-500">Standard Ocean Freight</p>
              </div>
              <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded text-xs uppercase tracking-wide border border-green-500/20">In Transit</span>
            </div>
            <div className="relative pt-6">
              <div className="absolute top-0 left-0 w-full h-1 bg-gray-800 rounded overflow-hidden">
                <div className="h-full bg-blue-500 w-[70%]" />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2 font-mono">
                <span>Shanghai, CN</span>
                <span>Rotterdam, NL</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-32 px-6 md:px-12 bg-black">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-white/10 pb-8 fade-up">
          <h2 className="text-4xl md:text-6xl font-light tracking-tight max-w-xl">Premium Fashion <br /> <span className="font-bold text-gray-500">Redefined.</span></h2>
          <p className="text-gray-400 max-w-xs mt-6 md:mt-0">Curated collections that blend style, comfort, and quality craftsmanship.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            onClick={() => navigate('/home')} 
            className="group relative h-[500px] border-r border-white/10 service-card overflow-hidden hover-trigger cursor-pointer" 
            data-cursor="hover"
          >
            <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" alt="T-Shirts" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent p-8 flex flex-col justify-end">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <Shirt className="w-10 h-10 mb-4 text-white" />
                <h3 className="text-2xl font-bold mb-2">Five Sleeve Tees</h3>
                <p className="text-gray-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">Unisex five-fleeve t-shirts crafted from premium cotton with exceptional fit and comfort.</p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => setIsComingSoonModalOpen(true)} 
            className="group relative h-[500px] border-r border-white/10 service-card overflow-hidden hover-trigger cursor-pointer" 
            data-cursor="hover"
          >
            <img src={modelPoseImg} alt="Fashion" className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent p-8 flex flex-col justify-end">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <ShoppingBag className="w-10 h-10 mb-4 text-white" />
                <h3 className="text-2xl font-bold mb-2">Custom designs</h3>
                <p className="text-gray-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">Contemporary designs that reflect your unique personality and modern fashion sensibilities.</p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => setIsComingSoonModalOpen(true)} 
            className="group relative h-[500px] service-card overflow-hidden hover-trigger cursor-pointer" 
            data-cursor="hover"
          >
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" alt="Quality" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent p-8 flex flex-col justify-end">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <Crown className="w-10 h-10 mb-4 text-white" />
                <h3 className="text-2xl font-bold mb-2">hoodies</h3>
                <p className="text-gray-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">Every piece is carefully selected and quality-checked to ensure lasting durability and style.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parallax Stats */}
      <section className="py-40 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img src={modelPoseImg} className="w-full h-full object-cover opacity-10 parallax-img" alt="" />
        </div>

        <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center parallax-content">
          <div className="stat-item">
            <div className="text-6xl font-bold mb-2 clip-text-image">150+</div>
            <div className="text-sm uppercase tracking-widest text-gray-400">Countries Served</div>
          </div>
          <div className="stat-item">
            <div className="text-6xl font-bold mb-2 clip-text-image">2.5M</div>
            <div className="text-sm uppercase tracking-widest text-gray-400">Tons Shipped</div>
          </div>
          <div className="stat-item">
            <div className="text-6xl font-bold mb-2 clip-text-image">24/7</div>
            <div className="text-sm uppercase tracking-widest text-gray-400">Support</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050505] border-t border-white/10 pt-20 pb-10 px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold mb-6">Let's make you look good.</h2>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-white transition-colors hover-trigger">Instagram</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors hover-trigger">LinkedIn</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors hover-trigger">Twitter</a>
            </div>
          </div>
          <div className="mt-10 md:mt-0 text-right">
            <p className="text-2xl font-light">thefitfiveapparels.com</p>
            <p className="text-gray-500 mt-2">+91 8138957263</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-700 uppercase tracking-wider border-t border-white/5 pt-8">
          <p>© 2024 The Fit Five Apparels.</p>
          <div className="space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>

      {/* Connect Modal */}
      <Dialog open={isConnectModalOpen} onOpenChange={setIsConnectModalOpen}>
        <DialogContent className="sm:max-w-md bg-[#0a0a0a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">Connect With Us</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex items-center gap-4 p-4 border border-white/10 rounded-lg hover:border-white/20 transition-colors">
              <div className="p-3 bg-white/5 rounded-full">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Email</p>
                <a 
                  href="mailto:contact@thefitfiveapparels.com" 
                  className="text-lg text-white hover:text-gray-300 transition-colors"
                >
                  contact@thefitfiveapparels.com
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 border border-white/10 rounded-lg hover:border-white/20 transition-colors">
              <div className="p-3 bg-white/5 rounded-full">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Phone</p>
                <a 
                  href="tel:+918138957263" 
                  className="text-lg text-white hover:text-gray-300 transition-colors"
                >
                  +91 8138957263
                </a>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Coming Soon Modal */}
      <Dialog open={isComingSoonModalOpen} onOpenChange={setIsComingSoonModalOpen}>
        <DialogContent className="sm:max-w-md bg-[#0a0a0a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">Coming Soon</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300 text-center">
              This feature is currently under development. Stay tuned for updates!
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Inline styles (scoped) */}
      <style>{`
        /* Custom cursor & small utility styles */
        .preloader { background: #000; }
        .pre-char { display: inline-block; transform: translateY(100%); }
        .hero-text { transform: translateY(100%); display: inline-block; }
        .hero-sub { opacity: 0; }
        .hero-scroll { opacity: 0; transform: translateY(12px); }
        .clip-text-image { background-clip: text; -webkit-background-clip: text; color: transparent; background-image: url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'); background-size: cover; background-position: center; }
        
        /* Shop Now button border animation */
        @keyframes borderPulse {
          0%, 100% {
            border-color: rgba(255, 255, 255, 0.2);
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
          }
          50% {
            border-color: rgba(255, 255, 255, 0.6);
            box-shadow: 0 0 20px 5px rgba(255, 255, 255, 0.3);
          }
        }
        
        .shop-now-btn {
          animation: borderPulse 2s ease-in-out infinite;
        }
        
        .shop-now-btn:hover {
          animation: none;
        }
      `}</style>
    </div>
  );
}
