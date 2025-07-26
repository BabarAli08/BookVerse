import BookCarousel from "./BookCarousal";

interface Book {
  title: string;
  author: string;
  rating: number;
  image: string;
  pages: number;
}

export const booksData: Book[] = [
   {
     title: "Basic Cooking Skills",
     author: "Chef Maria",
     rating: 4.6,
     image:
       "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=400&fit=crop",
     pages: 200,
   },
   {
     title: "Introduction to Philosophy",
     author: "Dr. Robert Smith",
     rating: 4.4,
     image:
       "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
     pages: 320,
   },
   {
     title: "Open Source Revolution",
     author: "David Kim",
     rating: 4.5,
     image:
       "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=400&fit=crop",
     pages: 250,
   },
   {
     title: "The Art of Mindfulness",
     author: "Emma Watson",
     rating: 4.7,
     image:
       "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=400&fit=crop",
     pages: 280,
   },
   {
     title: "The Creative Mind",
     author: "Lisa Rodriguez",
     rating: 4.8,
     image:
       "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=400&fit=crop",
     pages: 380,
   },
   {
     title: "Modern Architecture",
     author: "Sarah Wilson",
     rating: 4.3,
     image:
       "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=300&h=400&fit=crop",
     pages: 280,
   },
   {
     title: "Data Science Basics",
     author: "Dr. Michael Chen",
     rating: 4.7,
     image:
       "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=400&fit=crop",
     pages: 420,
   },
   {
     title: "Digital Photography",
     author: "Emma Johnson",
     rating: 4.5,
     image:
       "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=400&fit=crop",
     pages: 190,
   },
 ];
 export const premiumBooks: Book[] = [
   {
     title: "Advanced Machine Learning",
     author: "Dr. Alex Chen",
     rating: 4.9,
     image:
       "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=400&fit=crop",
     pages: 580,
   },
   {
     title: "Enterprise Architecture",
     author: "Michael Brown",
     rating: 4.8,
     image:
       "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=300&h=400&fit=crop",
     pages: 450,
   },
   {
     title: "Advanced JavaScript",
     author: "Sarah Dev",
     rating: 4.7,
     image:
       "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=400&fit=crop",
     pages: 520,
   },
   {
     title: "Investment Strategies",
     author: "Robert Finance",
     rating: 4.6,
     image:
       "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=400&fit=crop",
     pages: 380,
   },
   {
     title: "Leadership Mastery",
     author: "Jennifer Leader",
     rating: 4.8,
     image:
       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
     pages: 420,
   },
   {
     title: "Advanced Photography",
     author: "David Lens",
     rating: 4.5,
     image:
       "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=400&fit=crop",
     pages: 350,
   },
 ];
const BooksSection = () => {


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Free Books Section */}
      <BookCarousel
        books={booksData}
        title="free Books"
        subtitle="Free Books"
        isPremium={false}
      />

      {/* Premium Books Section */}
      <BookCarousel
        books={premiumBooks}
        title="premium Books"
        subtitle="Subscription Required:"
        isPremium={true}
      />
    </div>
  );
};

export default BooksSection;
