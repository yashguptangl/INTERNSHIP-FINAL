import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Programs', href: '/#programs' },
    { name: 'About', href: '/#about' },
    { name: 'FAQ', href: '/#faq' },
    { name: 'Verify', href: '/verify' },
    { name: 'Contact', href: '/#contact' },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    
    // Handle Home click - scroll to top
    if (href === '/') {
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      }
      return;
    }
    
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      
      // If we're not on the home page, navigate first then scroll
      if (location.pathname !== '/') {
        navigate('/');
        // Wait for navigation to complete, then scroll
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
            <img src="/logo.jpeg" alt="SkillBuild Era Logo" className="w-10 h-10 sm:w-12 sm:h-12 pt-0.5" />
            <span className="font-bold text-lg sm:text-2xl text-foreground hidden xs:block">SkillBuild Era</span>
            <span className="font-bold text-lg text-foreground xs:hidden">SkillBuild Era</span>
            </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              link.href === '/' ? (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {link.name}
                </button>
              ) : link.href.startsWith('/#') ? (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {link.name}
                </Link>
              )
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-border bg-background"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                link.href === '/' ? (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.href)}
                    className={`text-sm font-medium transition-colors hover:text-primary text-left ${
                      location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {link.name}
                  </button>
                ) : link.href.startsWith('/#') ? (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.href)}
                    className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground text-left"
                  >
                    {link.name}
                  </button>
                ) : (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      location.pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
