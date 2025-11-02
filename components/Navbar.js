// components/Navbar.jsx
'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from './ui/button-group';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';
import { ModeToggle } from '@/components/ModeToggle';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import LoadingBar from "react-top-loading-bar";
import ProfileImage from './ProfileImage';
import { decodeJWT } from '@/lib/actions/jwt_token';
import { set } from 'mongoose';

export default function Navbar() {
  const pathname = usePathname()
  let initialPathname = '/';
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [user, setUser] = useState(null);

  const [navLinks, setNavLinks] = useState(
    [
      { href: '/', label: 'Home' },
      { href: '/resources', label: 'Resources' },
      { href: '/about', label: 'About Us' },
      { href: '/contact', label: 'Contact' },
    ]
  )

  const { theme } = useTheme()

  useEffect(() => {
    if (pathname === "/dashboard") {
      decodeJWT().then(data => {
        if (data) {
          setUser(data);
          setIsSignedIn(true)
        }
      })
    }
  }, [pathname])

  useEffect(() => {
    if (isSignedIn) {
      setNavLinks(
        [
          { href: '/', label: 'Home' },
          { href: '/resources', label: 'Resources' },
          { href: '/dashboard', label: 'Dashboard' },
          { href: '/about', label: 'About Us' },
          { href: '/contact', label: 'Contact' },
        ]
      )
    }

  }, [isSignedIn])

  useEffect(() => {
    const handleLinkClick = (e) => {
      const target = e.target.closest('a')
      if (target) {
        if (pathname === initialPathname) {
          setTimeout(() => {
            setProgress(100)
          }, 800);
        }
        setProgress(30)
        setTimeout(() => {
          setProgress(70)
        }, 100);
      }
    }
    document.addEventListener('click', handleLinkClick)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    initialPathname = pathname

    //Loading Bar
    setProgress(100)

    setTimeout(() => {
      setProgress(0)
    }, 300);
  }, [pathname])

  return (
    <nav
      className={`
        sticky top-0 p-3 backdrop-blur-lg 
        transition-colors duration-300 ease-in-out
        border-b border-gray-100/50 border-b-gray-900 dark:border-b-white
        
        // Custom Glass Effect Styling with better transparency
        bg-background/80 dark:bg-background/80 
        
        // Subtle shadow for lift
        shadow-md dark:shadow-xl
      `}
    >
      <LoadingBar
        className="z-[200]"
        color={theme === "dark" ? '#FFFFFF' : "#111827"}
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className='container mx-auto flex items-center justify-between h-10'>

        {/* Logo/Site Title */}
        <Link
          href='/'
          className='text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100 transition-colors hover:text-primary'
        >
          FOET-Verse
        </Link>

        {/* Desktop Navigation Links and Theme Button */}
        <div className='hidden space-x-3 md:flex items-center'>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(`text-center py-3 text-[16px] font-semibold text-gray-600 dark:text-gray-200 dark:hover:text-gray-50 hover:text-gray-900 rounded-md transition duration-300 ${pathname === link.href && "dark:text-gray-50 text-gray-900 font-bold pointer-events-none"}`)}
            >
              {link.label}
            </Link>
          ))}
          {!isSignedIn && (
            <ButtonGroup className="ml-2" aria-label="Authentication Actions">
              <Button variant="outline" size="default" asChild><Link href="/login">Login</Link></Button>
              <Button variant="outline" size="default" asChild><Link href="/signup">Sign Up</Link></Button>
            </ButtonGroup>
          )}
          {/* Theme Toggle Button Placeholder */}
          <div className='ml-4 items-center justify-center flex'><ModeToggle /></div>
          <div className='ml-2 items-center justify-center flex'>
            {isSignedIn && (
              <ProfileImage src={user.profilePicture} />
            )}
          </div>
        </div>

        {/* Mobile: Hamburger Menu & Theme Button */}
        <div className='flex relative items-center md:hidden space-x-2'>

          {/* Hamburger Menu (Sheet) */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant='outline' // Use outline for better visibility
                size='icon'
                aria-label='Toggle Menu'
              >
                <Menu className='h-5 w-5' />
              </Button>
            </SheetTrigger>

            <SheetTitle />

            {/* Mobile Side Panel (Sheet Content) */}
            <SheetContent
              side='right'
              className='
                flex flex-col w-[80vw] sm:w-[50vw] p-4 space-y-4 
                
                // Glass Effect for Side Panel
                bg-background/95 backdrop-blur-xl 
              '
            >
              {/* Header with Title and the ONLY Close Button */}
              <SheetHeader>
                <div className="flex justify-between items-center pb-4 border-b">
                  <h2 className='text-xl font-bold'>Navigation</h2>

                  {/* Custom Close Button to replace the default one */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    aria-label='Close Menu'
                    className="h-8 w-8 text-foreground/70 hover:text-foreground"
                  >
                    <X className='h-5 w-5' />
                  </Button>
                </div>
                <div className='w-full h-0.5 bg-zinc-700 dark:bg-white'></div>
              </SheetHeader>

              {/* Mobile Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)} // Close menu on click
                  className={`ml-5 pb-1.5 text-xl font-semibold text-gray-600 dark:text-gray-200 dark:hover:text-gray-50 hover:text-gray-900 rounded-md transition duration-300 ${pathname === link.href && "dark:text-gray-50 text-gray-900 pointer-events-none"}`}
                >
                  {link.label}
                </Link>
              ))}

              {!isSignedIn && (
                <ButtonGroup className="ml-2" aria-label="Authentication Actions">
                  <Button variant="outline" size="lg" asChild><Link href="/login">Login</Link></Button>
                  <Button variant="outline" size="lg" asChild><Link href="/signup">Sign Up</Link></Button>
                </ButtonGroup>
              )}

              {/* Optional: Add a separator or footer here */}
              <div className='w-[90%] mx-auto h-0.5 mt-4 bg-zinc-700 dark:bg-white'></div>
              <div className='ml-5 mt-3 flex justify-between w-[80%] items-center'>
                <div className='font-semibold text-xl'>{theme?.toUpperCase()}</div>
                <ModeToggle />
              </div>

            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}