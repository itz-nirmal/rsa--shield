import React from "react";
import { Link } from "react-router-dom";
import { Shield, Github, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="glass-panel py-8 px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Shield className="h-5 w-5 text-primary mr-2" />
                <h3 className="text-xl font-semibold">RSA Shield</h3>
              </div>
              <p className="text-white/70 mb-4">
                A modern platform for RSA encryption and decryption. Generate
                keys, encrypt messages, and decrypt them securely.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-white/70 hover:text-white transition-colors duration-200"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/key-generation"
                    className="text-white/70 hover:text-white transition-colors duration-200"
                  >
                    Key Generation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/encryption"
                    className="text-white/70 hover:text-white transition-colors duration-200"
                  >
                    Encryption
                  </Link>
                </li>
                <li>
                  <Link
                    to="/decryption"
                    className="text-white/70 hover:text-white transition-colors duration-200"
                  >
                    Decryption
                  </Link>
                </li>
                <li>
                  <Link
                    to="/team"
                    className="text-white/70 hover:text-white transition-colors duration-200"
                  >
                    Meet The Team
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://en.wikipedia.org/wiki/RSA_(cryptosystem)"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white transition-colors duration-200 flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    About RSA Cryptography
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/itz-nirmal/rsa--shield"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white transition-colors duration-200 flex items-center"
                  >
                    <Github className="h-4 w-4 mr-1" />
                    GitHub Resources
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-6 text-center text-white/50">
            <p>© {new Date().getFullYear()} RSA Shield. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
