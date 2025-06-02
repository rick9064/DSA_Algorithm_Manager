import React from 'react';
import { Code2, Github, Linkedin, Mail, Heart, ExternalLink } from 'lucide-react';

function Footer() {
  const socialLinks = [
    { icon: <Github className="w-5 h-5" />, label: "GitHub", href: "https://github.com/rick9064" },
    { icon: <Linkedin className="w-5 h-5" />, label: "LinkedIn", href: "https://www.linkedin.com/in/rick-mistri/" },
    { icon: <Mail className="w-5 h-5" />, label: "Email", href: "mailto:contact@example.com" }
  ];

  const quickLinks = [
    { label: "About", href: "#" },
    { label: "Documentation", href: "#" },
    { label: "Tutorials", href: "#" },
    { label: "Support", href: "#" }
  ];

  const algorithmLinks = [
    { label: "Search Algorithms", href: "./search" },
    { label: "Sorting Algorithms", href: "./sort" },
    { label: "Queue Algorithms", href: "./queue" },
    { label: "BinaryTree Algorithms", href: "./binarytree" }
  ];

  return (
    <footer className="relative bg-gradient-to-t from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700/50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <Code2 className="w-8 h-8 text-cyan-400" />
                  <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-md"></div>
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  DSA Algorithm Manager
                </h3>
              </div>
              
              <p className="text-slate-300 mb-6 max-w-md leading-relaxed">
                Master data structures and algorithms through interactive learning. 
                Built with passion to help developers excel in their coding journey.
              </p>

              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="group relative p-3 bg-white/5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-cyan-400/50 transition-all duration-300 hover:bg-white/10"
                    aria-label={social.label}
                  >
                    {social.icon}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-slate-400 hover:text-cyan-400 transition-colors duration-300 flex items-center group"
                    >
                      <span>{link.label}</span>
                      <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 flex items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                Algorithms
              </h4>
              <ul className="space-y-3">
                {algorithmLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-slate-400 hover:text-purple-400 transition-colors duration-300 flex items-center group"
                    >
                      <span>{link.label}</span>
                      <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700/50 bg-slate-900/50">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              
              <div className="flex items-center space-x-2 text-slate-400">
                <span>© 2024 DSA Algorithm Manager. All rights reserved.</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-slate-500">Made with</span>
                <Heart className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="text-slate-500">by</span>
                <span className="font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  RICK MISTRI
                </span>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-8 left-8 opacity-10 font-mono text-xs text-cyan-400">
          {"<footer>"}
        </div>
        <div className="absolute top-8 right-8 opacity-10 font-mono text-xs text-purple-400">
          {"</footer>"}
        </div>
      </div>
    </footer>
  );
}

export default Footer;