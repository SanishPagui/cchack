'use client';

import { useEffect, useRef } from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import gsap from 'gsap';

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    gsap.from(footerRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top 80%',
      },
    });
  }, []);

  return (
    <footer
      ref={footerRef}
      className="w-full bg-gray-900 text-white px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4"
    >
      <div className="text-center md:text-left text-sm">
        © {new Date().getFullYear()} YourCompany. All rights reserved.
      </div>
      <div className="flex space-x-4">
        <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors duration-300">
          <FaGithub size={24} />
        </a>
        <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors duration-300">
          <FaLinkedin size={24} />
        </a>
        <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors duration-300">
          <FaTwitter size={24} />
        </a>
      </div>
    </footer>
  );
}
