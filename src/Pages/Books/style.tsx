.scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Smooth scroll behavior enhancement */
        .scrollbar-hide {
          scroll-behavior: smooth;
        }
        
        /* Better focus states */
        button:focus-visible {
          outline: 2px solid ${isPremium ? "#a855f7" : "#10b981"};
          outline-offset: 2px;
        }