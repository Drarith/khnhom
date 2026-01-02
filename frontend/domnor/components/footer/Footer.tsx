import Link from "next/link";
import { Mail, Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <h3 className="text-xl font-bold text-white">Domnor</h3>
            <p className="text-sm leading-relaxed max-w-xs">
              A home for all your social media links. Made especially for
              Cambodians.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-white">Quick Links</h4>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-white">Legal</h4>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Credits */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <h4 className="text-base font-semibold text-white">Contact</h4>
            <div className="space-y-2 text-sm">
              <p>
                Created by{" "}
                <span className="font-medium text-white">Sarin Dararith</span>
              </p>
              <a
                href="mailto:sarindararith5540@gmail.com"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail size={14} />
                sarindararith5540@gmail.com
              </a>

              {/* Social Placeholders */}
              <div className="flex gap-4 pt-1">
                <a
                  href="#"
                  className="hover:text-white transition-colors"
                  aria-label="Github"
                >
                  <Github size={18} />
                </a>
                <a
                  href="#"
                  className="hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="#"
                  className="hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Domnor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
