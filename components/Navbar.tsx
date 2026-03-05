'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User, Menu, X, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, loginWithGoogle, logout, isAdmin } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPhoto = async () => {
      // In the new backend, the user object might already contain the picture URL if it came from Google
      if (!user) return;
      
      if (user.avatar) {
        setPhotoUrl(user.avatar);
        return;
      }

      if (user.picture) {
        setPhotoUrl(user.picture);
        return;
      }

      // If we still need to fetch from applicants collection (e.g. if photo is uploaded manually)
      // We can check the /api/applicants/my endpoint
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applicants/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const applicants = await response.json();
          if (applicants && applicants.length > 0) {
            const applicant = applicants[0];
            // If the applicant has a photoId (which might be a URL in the new system or ID)
            if (applicant.photoId) {
               // Assuming photoId stores the URL directly now, or we construct it
               // For now, let's assume it might be a full URL if we changed how we store it,
               // or if it's still an ID, we'd need an endpoint to serve it.
               // Since we removed Appwrite storage, we don't have `storage.getFilePreview`.
               // If the user hasn't implemented a file upload backend yet, we might skip this
               // OR assume photoId is a URL.
               // Given "DO NOT modify UI", we should try to show something.
               setPhotoUrl(applicant.photoId);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user photo:", error);
      }
    };

    fetchUserPhoto();
  }, [user]);

  const navLinks = [
    { name: 'Services', href: '/services' },
    { name: 'Departments', href: '/departments' },
    { name: 'Team', href: '/team' },
    { name: 'Careers', href: '/careers' },
  ];

  if (isAdmin) {
    navLinks.push({ name: 'Admin', href: '/admin' });
  }

  const handleAdminPanel = () => {
    // Check if admin token exists
    const token = localStorage.getItem('adminToken');
    if (token) {
      router.push('/admin/dashboard');
    } else {
      router.push('/admin/login');
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-black/5 bg-yellow-50/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center bg-black font-bold text-white">
                <img src="/images/abhibhi-logo.png" alt="Abhibhi Developers" className="h-6 w-6 object-contain" />
              </div>
              <span className="text-xl font-bold tracking-tighter text-black uppercase">Abhibhi</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-3 py-2 text-sm font-light text-black/60 transition-colors hover:text-black uppercase tracking-widest"
                >
                  {link.name}
                </Link>
              ))}
              
              <button
                onClick={handleAdminPanel}
                className="group flex items-center gap-2 px-3 py-2 text-sm font-light text-black/60 transition-colors hover:text-black uppercase tracking-widest"
              >
                <Lock className="h-3 w-3 transition-transform group-hover:scale-110" />
                Admin Panel
              </button>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-black/5 text-xs font-medium text-black">
                      {photoUrl ? (
                        <img src={photoUrl} alt={user.name} className="h-full w-full object-cover" />
                      ) : (
                        user.name?.charAt(0) || <User className="h-4 w-4" />
                      )}
                    </div>
                    <span className="text-sm font-light text-black">{user.name}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-light text-black/60 transition-colors hover:text-black uppercase tracking-widest"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={loginWithGoogle}
                  className="bg-black px-6 py-2.5 text-xs font-medium text-white transition-colors hover:bg-black/80 uppercase tracking-widest"
                >
                  Login with Google
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 text-black/60 hover:text-black focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-yellow-50 border-b border-black/5">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-4 text-base font-light text-black/60 hover:text-black uppercase tracking-widest"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            <button
              onClick={() => {
                setIsOpen(false);
                handleAdminPanel();
              }}
              className="flex w-full items-center gap-2 px-3 py-4 text-base font-light text-black/60 hover:text-black uppercase tracking-widest text-left"
            >
              <Lock className="h-4 w-4" />
              Admin Panel
            </button>
          </div>
          <div className="border-t border-black/5 pb-6 pt-4">
            {user ? (
              <div className="px-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-black/5 text-sm font-medium text-black">
                    {photoUrl ? (
                      <img src={photoUrl} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      user.name?.charAt(0) || <User className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <div className="text-base font-medium leading-none text-black">
                      {user.name}
                    </div>
                    <div className="text-sm font-light leading-none text-black/60 mt-2">
                      {user.email}
                    </div>
                  </div>
                </div>
                <div className="mt-6 space-y-1">
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-3 py-3 text-base font-light text-black/60 hover:text-black uppercase tracking-widest"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-5 mt-4">
                <button
                  onClick={() => {
                    loginWithGoogle();
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center justify-center bg-black px-4 py-4 text-sm font-medium text-white hover:bg-black/80 uppercase tracking-widest"
                >
                  Login with Google
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
