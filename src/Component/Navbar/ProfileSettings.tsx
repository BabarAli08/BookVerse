import { User, BookOpen, Heart, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';

interface profileState {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface menuItem {
  icon: any;
  label: string;
  color: string;
  onClick: () => void;
}

export default function ProfileDropdown({ isOpen, setIsOpen }: profileState) {
  const navigate=useNavigate()
  const menuItems:menuItem[] = [
    { icon: User, label: 'Profile', color: 'text-gray-700', onClick:()=>navigate('/profile') },
    { icon: BookOpen, label: 'My Library', color: 'text-gray-700', onClick:()=>navigate('/library') },
    { icon: Heart, label: 'Wishlist', color: 'text-gray-700', onClick:()=>navigate('/wishlist') },
    { icon: Settings, label: 'Settings', color: 'text-gray-700',onClick:()=>navigate('/settings') },
    { icon: LogOut, label: 'Sign Out', color: 'text-red-500', onClick:()=>navigate('/') },
  ];

  return (
    <>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  onClick={()=>item.onClick()}
                  className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Icon size={16} className={`mr-3 ${item.color}`} />
                  <span className={`${item.color} text-sm font-medium`}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}


      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
