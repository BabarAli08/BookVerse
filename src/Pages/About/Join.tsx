
import WhiteButton from '../../Component/WhiteButton';
import TransparentButton from '../../Component/TransparentButton';
import { useNavigate } from 'react-router';

const JoinSection = () => {
  const navigate=useNavigate()
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-700 flex flex-col items-center justify-center w-full min-h-[35vh] py-16 px-4">
      {/* Text Content */}
      <div className="text-center mb-8 max-w-4xl">
        <h1 className="text-4xl md:text-5xl text-white font-bold mb-6 leading-tight">
         Join Our Global Reading Community
        </h1>
        <p className="text-white text-xl md:text-2xl opacity-90 leading-relaxed">
          Connect with readers worldwide, discover your next favorite book, and be part of the reading revolution.
        </p>
      </div>
      
      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
        <WhiteButton 
          title="Join BookVerse" 
          onClick={() => navigate('/signup')}
        />
        <TransparentButton 
          title="Browse Books" 
          onClick={() => navigate('/books')}
        />
      </div>
    </div>
  );
};

export default JoinSection;