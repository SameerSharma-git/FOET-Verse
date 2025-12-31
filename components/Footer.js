"use client"

import React from 'react';
import Link from 'next/link';
import { Home, Info, Mail, Instagram, Linkedin, Github } from 'lucide-react'; // Importing icons for navigation and social media
import { usePathname } from 'next/navigation';
import { Notebook } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname()

  return (
    <footer className={`bg-gray-950 ${pathname==='/dashboard' && "md:hidden"} text-gray-300 py-10 px-4 sm:px-6 lg:px-8 rounded-t-xl shadow-lg`}>
      <div className="max-w-7xl mx-auto grid place-items-center grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">

        {/* Section 1: Blog Title and Copyright */}
        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-2xl font-bold text-white mb-4">FOET-Verse</h4>
          <div className="text-sm text-white">
            &copy; {currentYear} FOET-Verse. All rights reserved.
          </div>
          <div className="text-sm mt-2">
            Together, We Share!
          </div>
          <div className="text-sm mt-2">
            Made with lots of love ❤️
          </div>
        </div>

        {/* Section 2: Navigation Links */}
        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
          <div className="space-y-2">
            {/* Using simple anchor tags as Next.js App Router handles client-side navigation */}
            <Link href="/" className="flex items-center justify-center md:justify-start text-gray-300 hover:text-blue-400 transition duration-300 ease-in-out rounded-md p-1">
              <Home className="h-5 w-5 mr-2" /> Home
            </Link>
            <Link href="/about" className="flex items-center justify-center md:justify-start text-gray-300 hover:text-blue-400 transition duration-300 ease-in-out rounded-md p-1">
              <Info className="h-5 w-5 mr-2" /> About
            </Link>
            <Link href="/contact" className="flex items-center justify-center md:justify-start text-gray-300 hover:text-blue-400 transition duration-300 ease-in-out rounded-md p-1">
              <Mail className="h-5 w-5 mr-2" /> Contact
            </Link>
            <Link href="/resources" className="flex items-center justify-center md:justify-start text-gray-300 hover:text-blue-400 transition duration-300 ease-in-out rounded-md p-1">
              <Notebook className="h-5 w-5 mr-2" /> Resources
            </Link>
          </div>
        </div>

        {/* Section 3: Social Media Links */}
        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-lg font-semibold text-white mb-4">Connect With Us</h4>
          <div className="flex space-x-4">
            {/* Social media icons with hover effects */}
            <Link href="https://instagram.com/Sameer_Sharma.22" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 transition duration-300 ease-in-out transform hover:scale-110">
              <Instagram className="h-7 w-7" />
            </Link>
            <Link href="https://www.linkedin.com/in/sameer-sharma-7b0108371/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 transition duration-300 ease-in-out transform hover:scale-110">
              <Linkedin className="h-7 w-7" />
            </Link>
            <Link href="https://github.com/SameerSharma-git" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 transition duration-300 ease-in-out transform hover:scale-110">
              <Github className="h-7 w-7" />
            </Link>
          </div>
          {/* Optional: Add a newsletter signup or contact info */}
          <div className="text-sm mt-4">
            Stay updated with our latest posts!
          </div>
          {/* You could add a simple form here for newsletter signup */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
