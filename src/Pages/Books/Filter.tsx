import { useState } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";

interface optionState{
    options: string[];
    selected: string;
    onSelect: (option: string) => void;
    placeholder: string;
}
const FilterComponent = () => {
  const [selectedTier, setSelectedTier] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All Tiers");
  const [selectedSort, setSelectedSort] = useState("Sort by Title");
  const [searchQuery, setSearchQuery] = useState("");

  const tiers = ["All", "Free", "Premium", "Ultimate"];
  const categories = [
    "All Tiers",
    "Technology",
    "Science",
    "Architecture",
    "Programming",
    "Design",
    "Business",
    "Fiction",
    "Non-Fiction",
    "Biography",
    "History",
    "Philosophy",
  ];
  const sortOptions = [
    "Sort by Title",
    "Newest First",
    "Oldest First",
    "Highest Rated",
    "Lowest Rated",
    "Most Popular",
    "Price: Low to High",
    "Price: High to Low",
  ];

  const DropdownSelect = ({ options, selected, onSelect, placeholder }:optionState) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        >
          <span className="text-gray-700">{selected}</span>
          <ChevronDown
            size={16}
            className={`text-gray-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                  selected === option
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center ">
    <div className="p-1 w-[70vw]  bg-white shadow-sm">
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search books or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Section */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            {/* Tier Filter */}
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <div className="min-w-[120px]">
                <DropdownSelect
                  options={tiers}
                  selected={selectedTier}
                  onSelect={setSelectedTier}
                  placeholder="All"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="min-w-[140px]">
              <DropdownSelect
                options={categories}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
                placeholder="All Tiers"
              />
            </div>

            {/* Sort Filter */}
            <div className="min-w-[160px]">
              <DropdownSelect
                options={sortOptions}
                selected={selectedSort}
                onSelect={setSelectedSort}
                placeholder="Sort by Title"
              />
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedTier !== "All" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              Tier: {selectedTier}
              <button
                onClick={() => setSelectedTier("All")}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )}
          {selectedCategory !== "All Tiers" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
              Category: {selectedCategory}
              <button
                onClick={() => setSelectedCategory("All Tiers")}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </span>
          )}
          {selectedSort !== "Sort by Title" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
              Sort: {selectedSort}
              <button
                onClick={() => setSelectedSort("Sort by Title")}
                className="ml-2 text-purple-600 hover:text-purple-800"
              >
                ×
              </button>
            </span>
          )}
        </div>

        {/* Results Summary */}
        <div className="mt-4 text-sm text-gray-600">
          {searchQuery && <span>Searching for "{searchQuery}" •</span>}
          <span className="ml-1">
            Showing books
            {selectedTier !== "All" && ` in ${selectedTier} tier`}
            {selectedCategory !== "All Tiers" && ` from ${selectedCategory}`}
            {selectedSort !== "Sort by Title" &&
              ` sorted by ${selectedSort.toLowerCase()}`}
          </span>
        </div>
      </div>
    </div>
    </div>
  );
};

export default FilterComponent;
