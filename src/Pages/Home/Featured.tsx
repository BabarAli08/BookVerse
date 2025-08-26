import { useEffect, useState } from "react";
import FeaturedBookCard from "../../Component/FeaturedBookCard";

const ShowcaseBooks = [
  {
    // Removed 'book1:' and made it an object directly in the array
    image:
      "https://images.unsplash.com/photo-1641716162046-e6fe7ce76818?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTAyfHxib29rJTIwY292ZXJ8ZW58MHx8MHx8fDA%3D",
    tag: "Technology",
    name: "Harry Potter",
    author: "J.K. Rowling",
    description:
      "Harry Potter is a series of seven fantasy novels written by British author J. K. Rowling",
    rating: 4.7,
    downloads: 500000,
    onClick: () => console.log("harry potter"), // Changed 'onclick' to 'onClick' to match prop name
  },
  {
    // Removed 'book2:'
    image:
      "https://images.unsplash.com/photo-1626971992587-2cc300029e7d?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tag: "Fantasy",
    name: "The Hobbit",
    author: "J.R.R. Tolkien",
    description:
      "The Hobbit is a children's fantasy novel by English author J. R. R. Tolkien. It was published on 21 September 1937 to wide critical acclaim.",
    rating: 4.5,
    downloads: 750000,
    onClick: () => console.log("the hobbit"),
  },
  {
    // Removed 'book3:'
    image:
      "https://images.unsplash.com/photo-1627351535879-d80b778fadd6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGJvb2slMjBjb3ZlcnByaWRlJTIwYW5kJTIwcHJlanVzdGljZXxlbnwwfHwwfHx8MA%3D%3D",
    tag: "Classic",
    name: "Pride and Prejudice",
    author: "Jane Austen",
    description:
      "Pride and Prejudice is a romantic novel of manners written by Jane Austen in 1813. The novel follows the character development of Elizabeth Bennet.",
    rating: 4.8,
    downloads: 600000,
    onClick: () => console.log("pride and prejudice"),
  },
];
const Featured = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobile(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="flex items-center justify-center flex-wrap flex-col gap-6 overflow-hidden">
      {" "}
     
      <div className="flex text-center items-center mb-7 justify-center flex-col">
        <h1 className="text-4xl font-bold mb-4">Featured Books</h1>
        <p className="text-gray-600 text-xl">
          Discover our handpicked selection of the most captivating reads
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {ShowcaseBooks.map((book, i) => (
          <FeaturedBookCard key={i} {...book} />
        ))}
      </div>
    </div>
  );
};

export default Featured;
