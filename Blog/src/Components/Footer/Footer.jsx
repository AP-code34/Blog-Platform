import React from "react";
import {
  FaHeart,
  FaArrowRight,
  FaTwitter,
  FaInstagram,
  FaGithub,
  FaEnvelope,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white pt-16 pb-8 border-t border-purple-500/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Brand & Description */}
          <div>
            <Link to="/" className="text-2xl font-bold mb-4 flex items-center group">
              <FaHeart className="text-rose-400 mr-2 group-hover:scale-110 transition-transform" />
              <span className="bg-gradient-to-r from-rose-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                HeartInk
              </span>
            </Link>
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              Where emotions find their voice. A sanctuary for authentic storytelling and meaningful connections.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: FaTwitter, name: "Twitter", href: "#", hoverColor: "hover:bg-blue-500" },
                { icon: FaInstagram, name: "Instagram", href: "#", hoverColor: "hover:bg-pink-500" },
                { icon: FaGithub, name: "GitHub", href: "#", hoverColor: "hover:bg-gray-600" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={`Follow us on ${social.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-white/10 w-10 h-10 rounded-full flex items-center justify-center ${social.hoverColor} transition-all transform hover:scale-110`}
                >
                  <social.icon className="text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-rose-400">Navigate</h3>
            <ul className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "All Stories", path: "/posts" },
                { name: "Write Story", path: "/create-post" },
                { name: "Categories", path: "/categories" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-rose-400 transition flex items-center group text-sm"
                  >
                    <FaArrowRight className="text-xs mr-2 opacity-0 group-hover:opacity-100 transition duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Popular Topics */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-purple-400">Topics</h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li>
                <Link to="/posts?tag=emotions" className="hover:text-purple-400 transition">
                  #Emotions
                </Link>
              </li>
              <li>
                <Link to="/posts?tag=stories" className="hover:text-purple-400 transition">
                  #Stories
                </Link>
              </li>
              <li>
                <Link to="/posts?tag=journey" className="hover:text-purple-400 transition">
                  #Journey
                </Link>
              </li>
              <li>
                <Link to="/posts?tag=reflections" className="hover:text-purple-400 transition">
                  #Reflections
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-pink-400">Stay Connected</h3>
            <p className="text-gray-300 mb-4 text-sm">
              Get heartfelt stories delivered to your inbox.
            </p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="p-3 rounded-l-xl bg-white/10 text-white placeholder-gray-400 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 border border-white/20"
                required
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white p-3 rounded-r-xl transition-all"
                aria-label="Subscribe"
              >
                <FaEnvelope />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-gray-400 text-sm mb-2">
            &copy; {new Date().getFullYear()} HeartInk. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs italic">
            "Write what should not be forgotten" - Isabel Allende
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;