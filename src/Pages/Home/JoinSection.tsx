
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
          Ready to Start Your Reading Journey?
        </h1>
        <p className="text-white text-xl md:text-2xl opacity-90 leading-relaxed">
          Join thousands of readers who have discovered their next favorite
          book with BookVerse
        </p>
      </div>
      
      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
        <WhiteButton 
          title="Sign Up Free" 
          onClick={() => navigate('/signup')}
        />
        <TransparentButton 
          title="Go Premium" 
          onClick={() => navigate('/premium')}
        />
      </div>
    </div>
  );
};

export default JoinSection;