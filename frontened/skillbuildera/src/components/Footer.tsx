import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">T</span>
              </div>
              <span className="font-bold text-xl">SkillBuild Era</span>
            </div>
            <p className="text-background/70 text-sm leading-relaxed">
              Empowering the next generation of tech professionals through hands-on internship experiences and industry-relevant training.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-background/70 hover:text-background text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a href="#programs" className="text-background/70 hover:text-background text-sm transition-colors">
                  Programs
                </a>
              </li>
              <li>
                <Link to="/verify" className="text-background/70 hover:text-background text-sm transition-colors">
                  Verify Certificate
                </Link>
              </li>
              <li>
                <a href="#about" className="text-background/70 hover:text-background text-sm transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#faq" className="text-background/70 hover:text-background text-sm transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-background/70">
                <Mail className="w-4 h-4" />
                <span>contact@skillbuildera.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-background/70">
                <Phone className="w-4 h-4" />
                <span>+91 8679089320</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-background/70">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Dehradun, Uttarakhand, India</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="www.linkedin.com/in/skillbuild-era-b5a8b03a2"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/skillbuildera"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/60">
            © {currentYear} SkillBuild Era. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-background/60">
            <Link to="/privacy" className="hover:text-background transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-background transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
