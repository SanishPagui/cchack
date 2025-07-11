'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowRight, ExternalLink } from 'lucide-react';
import gsap from 'gsap';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const logoRef = useRef(null);
  const menuItemsRef = useRef([]);
  const ctaButtonRef = useRef(null);

  const navItems = [
    { name: 'Asteriod Tracking', href: '/asteroidTracking' },
  ];
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    if (menuItemsRef.current?.length > 0) {
      gsap.fromTo(menuItemsRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out", delay: 0.7 }
      );
    }
  
    if (ctaButtonRef.current) {
      gsap.fromTo(ctaButtonRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)", delay: 0.9 }
      );
    }
  }, []);
  

  // Mobile menu animations
  useEffect(() => {
    if (!mobileMenuRef.current) return;
  
    if (isOpen) {
      gsap.set(mobileMenuRef.current, { display: 'block' });
      gsap.fromTo(mobileMenuRef.current,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );
  
      const items = mobileMenuRef.current.querySelectorAll('.mobile-menu-item');
      if (items.length) {
        gsap.fromTo(items,
          { x: -50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, stagger: 0.1, delay: 0.2, ease: "power3.out" }
        );
      }
    } else {
      gsap.to(mobileMenuRef.current,
        {
          opacity: 0,
          y: -50,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            gsap.set(mobileMenuRef.current, { display: 'none' });
          }
        }
      );
    }
  }, [isOpen]);
  

  const handleMenuItemHover = (e, index) => {
    setActiveItem(index);
    gsap.to(e.target, {
      y: -2,
      duration: 0.3,
      ease: "power2.out"
    });
    
    // Animate the underline
    gsap.to(e.target.querySelector('.menu-underline'), {
      scaleX: 1,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleMenuItemLeave = (e, index) => {
    setActiveItem(null);
    gsap.to(e.target, {
      y: 0,
      duration: 0.3,
      ease: "power2.out"
    });
    
    // Animate the underline
    gsap.to(e.target.querySelector('.menu-underline'), {
      scaleX: 0,
      duration: 0.3,
      ease: "power2.out"
    });
  };
  useEffect(() => {
    if (!navRef.current) return;
  
    gsap.to(navRef.current, {
      backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.95)' : 'rgba(0, 0, 0, 0.1)',
      backdropFilter: scrolled ? 'blur(20px)' : 'blur(5px)',
      borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.05)',
      duration: 0.4,
      ease: "power2.out"
    });
  }, [scrolled]);
  

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav 
      className="fixed w-full top-0 z-[999]  transition-all duration-300"
    >
      <div className="max-w-7xl lg:max-w-full mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div ref={logoRef} className="flex-shrink-0">
            <a href="/" className="flex items-center">
              <span className="ml-3 text-2xl font-light lg:text-4xl lg:font-semibold text-white tracking-wide">
                Kodierer
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-12">
            {navItems.map((item, index) => (
              <div key={item.name} className="relative">
                <a
                  ref={el => menuItemsRef.current[index] = el}
                  href={item.href}
                  className="relative text-white text-lg font-medium tracking-wide py-2 px-1 transition-colors duration-200 hover:text-white flex items-center"
                  onMouseEnter={(e) => handleMenuItemHover(e, index)}
                  onMouseLeave={(e) => handleMenuItemLeave(e, index)}
                >
                  {item.name}
                  {item.isExternal && <ExternalLink className="ml-2 h-3 w-3" />}
                  <div className="menu-underline absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 transform scale-x-0 origin-left"></div>
                </a>
              </div>
            ))}
          </div>
          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white/90 hover:text-bllack hover:bg-white/10 transition-colors duration-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Navigation */}
      <div 
        ref={mobileMenuRef}
        className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/10"
        style={{ display: 'none' }}
      >
        <div className="px-6 pt-6 pb-8 space-y-6">
          {navItems.map((item, index) => (
            <a
              key={item.name}
              href={item.href}
              className="mobile-menu-item  text-white/90 text-lg font-medium tracking-wide py-3 border-b border-white/10 hover:text-white transition-colors duration-200 flex items-center justify-between"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
              {item.isExternal && <ExternalLink className="h-4 w-4" />}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;