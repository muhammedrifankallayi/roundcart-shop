import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function AboutUs() {
  const cursorDot = useRef(null);
  const cursorOutline = useRef(null);
  const preloader = useRef(null);
  const navigate = useNavigate();

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
      .to('.about-hero-text', { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out' }, '-=0.5')
      .to('.about-hero-sub', { opacity: 1, duration: 1, ease: 'power2.out' }, '-=0.8');

    // Fade up animations
    gsap.utils.toArray('.fade-up').forEach((el) => {
      gsap.from((el as any), {
        scrollTrigger: { trigger: el as any, start: 'top 85%' },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });
    });

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

  return (
    <div className="antialiased selection:bg-white selection:text-black bg-[#050505] text-white min-h-screen">
      {/* Custom Cursor */}
      <div ref={cursorDot} className="cursor-dot fixed -translate-x-1/2 -translate-y-1/2 rounded-full w-2 h-2 bg-white z-[9999] pointer-events-none" />
      <div ref={cursorOutline} className="cursor-outline fixed -translate-x-1/2 -translate-y-1/2 rounded-full w-10 h-10 border border-white/30 z-[9998] pointer-events-none transition-[width,height]" />

      {/* Preloader */}
      <div ref={preloader} className="preloader fixed inset-0 bg-black z-[10000] flex items-center justify-center">
        <div className="preloader-text text-4xl font-bold overflow-hidden flex space-x-2">
          {['A', 'B', 'O', 'U', 'T', ' ', 'U', 'S'].map((c, i) => (
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
          <Link to="/" className="hover:text-gray-400 transition-colors hover-trigger" data-cursor="hover">Home</Link>
        </div>
        <Link 
          to="/home"
          className="border border-white/20 px-6 py-2 rounded-full text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 hover-trigger"
          data-cursor="hover"
        >
          Shop Now
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden pt-20">
        <div className="absolute inset-0" style={{ backgroundSize: '40px 40px', backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' }} />

        <div className="absolute w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse duration-[4000ms]"></div>

        <div className="relative z-10 text-center px-4">
          <h1 className="text-[10vw] md:text-[8vw] leading-[0.9] font-bold tracking-tighter mix-blend-overlay opacity-80 select-none">
            <div className="line-reveal">
              <span className="about-hero-text block translate-y-full opacity-0">ABOUT</span>
            </div>
            <div className="line-reveal">
              <span className="about-hero-text block translate-y-full opacity-0">THE FIT FIVE</span>
            </div>
          </h1>
          <div className="mt-8 flex flex-col items-center overflow-hidden">
            <p className="text-gray-400 text-lg md:text-xl max-w-md text-center opacity-0 about-hero-sub">Crafting quality apparel for the modern world.</p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-32 px-6 md:px-20 relative bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-light mb-12 fade-up text-center">
            Our <span className="font-bold">Story</span>
          </h2>
          
          <div className="space-y-8 fade-up">
            <p className="text-gray-300 text-lg leading-relaxed">
              At The Fit Five, we believe that fashion should be accessible, comfortable, and sustainable. 
              Founded with a vision to create unisex apparel that fits everyone, we've built a brand that 
              celebrates individuality while maintaining the highest standards of quality.
            </p>
            
            <p className="text-gray-300 text-lg leading-relaxed">
              Our journey began with a simple idea: create five-sleeve tees and unisex clothing that 
              doesn't compromise on style or comfort. Every piece in our collection is carefully designed 
              to ensure the perfect fit, whether you're looking for casual wear or something more refined.
            </p>
            
            <p className="text-gray-300 text-lg leading-relaxed">
              We're committed to delivering exceptional quality with fast, reliable service. With delivery 
              within 3 days across India, we make sure you get your perfect fit when you need it.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 px-6 md:px-12 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-20 text-center fade-up">
            Our <span className="font-bold text-gray-500">Values</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="fade-up">
              <h3 className="text-2xl font-bold mb-4">Quality First</h3>
              <p className="text-gray-400">
                Every garment is crafted with attention to detail, ensuring durability and comfort that lasts.
              </p>
            </div>
            
            <div className="fade-up">
              <h3 className="text-2xl font-bold mb-4">Inclusive Design</h3>
              <p className="text-gray-400">
                Our unisex collection is designed to fit and flatter all body types, celebrating diversity.
              </p>
            </div>
            
            <div className="fade-up">
              <h3 className="text-2xl font-bold mb-4">Fast Delivery</h3>
              <p className="text-gray-400">
                We understand you want your perfect fit fast. That's why we deliver within 3 days across India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center fade-up">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to find your perfect fit?</h2>
          <p className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto">
            Explore our collection of unisex apparel and discover the quality that sets us apart.
          </p>
          <Link
            to="/home"
            className="inline-block border border-white/20 px-8 py-3 rounded-full text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 hover-trigger"
            data-cursor="hover"
          >
            Shop Now
          </Link>
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

      {/* Inline styles */}
      <style>{`
        .preloader { background: #000; }
        .pre-char { display: inline-block; transform: translateY(100%); }
        .about-hero-text { transform: translateY(100%); display: inline-block; }
        .about-hero-sub { opacity: 0; }
      `}</style>
    </div>
  );
}

