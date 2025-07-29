const MeetOurTeam = () => {
  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "Founder & CEO",
      description: "Former librarian turned tech entrepreneur, passionate about making reading accessible to everyone.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Michael Torres", 
      role: "Head of Content",
      description: "Curates our extensive book collection and works with publishers to bring you the best titles.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Emma Watson",
      role: "UX Designer", 
      description: "Designs intuitive reading experiences that make digital books feel natural and enjoyable.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Alex Thompson",
      role: "Engineering Lead",
      description: "Builds the technology that powers our platform and ensures a seamless reading experience.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-16 px-8">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          The passionate people behind BookVerse who make it all possible
        </p>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {teamMembers.map((member, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            {/* Profile Image */}
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-gray-200 overflow-hidden">
                {member.image ? (
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Member Info */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900">
                {member.name}
              </h3>
              
              <p className="text-purple-600 font-semibold text-sm">
                {member.role}
              </p>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                {member.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetOurTeam;