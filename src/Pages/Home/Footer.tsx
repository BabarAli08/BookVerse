
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import { useNavigate } from 'react-router';

const Footer = () => {
  const navigate=useNavigate()
  return (
    <footer className="bg-slate-900 text-gray-300 px-6 py-12">
      <div className="max-w-7xl mx-auto">
     
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
    
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-white text-xl font-semibold">BookVerse</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your gateway to infinite stories and knowledge. Read, discover, and grow with BookVerse.
            </p>
          
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

      
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <button onClick={()=>navigate('/books')} className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Browse Books
                </button>
              </li>
              <li>
                <button onClick={()=>navigate('/premium')} className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Premium
                </button>
              </li>
              <li>
                <button onClick={()=>navigate('/about')} className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  About Us
                </button>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>

       
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Account</h3>
            <ul className="space-y-3">
              <li>
                <button onClick={()=>navigate('/profile')} className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  My Profile
                </button>
              </li>
              <li>
                <button onClick={()=>navigate('/library')} className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  My Library
                </button>
              </li>
              <li>
                <button onClick={()=>navigate('/wishlist')}  className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Wishlist
                </button>
              </li>
              <li>
                <button onClick={()=>navigate('/settings')}   className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Settings
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <button onClick={()=>navigate('/premium')} className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  FAQ
                </button>
              </li>
            </ul>
          </div>
        </div>

      
        <div className="border-t border-gray-700 pt-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © 2025 BookVerse. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;