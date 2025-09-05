# 📚 BookVerse

> A Netflix-style book reading platform that combines smooth UI, fast performance, and deep personalization into a cohesive reading ecosystem.


<img width="1902" height="958" alt="image" src="https://github.com/user-attachments/assets/6bf23eb7-c545-4ed1-a866-9e990da73069" />


 <img width="1905" height="955" alt="image" src="https://github.com/user-attachments/assets/bf800bf6-ac80-468f-9f62-ff9339fa77c2" />
<br/>
Demo Link
https://bookverse-read.vercel.app/

## 🚀 What Makes BookVerse Special

BookVerse isn't just another book reader—it's a full-featured reading ecosystem designed with performance and user experience at its core. Every technical decision was made to eliminate loading screens, reduce user friction, and create a Netflix-quality experience for book lovers.

### 🎯 Core Philosophy
- **Performance First**: Data preloaded on sign-in, instant navigation
- **User-Centric**: Personalized experiences without compromising speed
- **Mobile-Native**: Responsive design that works flawlessly on any device
- **Accessibility**: Clean typography, customizable reading preferences

## ✨ Features Overview

### 📖 Immersive Reading Experience
- **Smart Highlighting**: Select and save text highlights with persistent storage
- **Customizable Typography**: Font size, family, line spacing, and background themes
- **Distraction-Free Mode**: Clean, focused reading interface
- **Smooth Navigation**: Mobile-optimized page transitions

### 🎬 Netflix-Style Discovery
- **Infinite Scroll**: Lazy-loaded book grids for smooth browsing
- **Smart Categories**: Free and Premium book tiers
- **Reliable API Integration**: Proxy and caching layer for Gutendex API
- **Search & Filter**: Find books by genre, author, or title

### 💾 Personalized Data Management
- **Wishlist System**: Save books for later with duplicate prevention
- **Reading Progress**: Track completed books and current reads
- **Preference Sync**: Reading settings synced across devices
- **Subscription Tracking**: Premium membership and billing history

### 🎨 Polished UI & Animations
- **Framer Motion**: Smooth micro-interactions throughout the app
- **Smart Loading States**: Context-aware skeleton loaders
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Error Handling**: Animated error states with clear feedback

## 🏗️ Technical Architecture

### Tech Stack
```
Frontend:  React 19 + TypeScript + Vite
Styling:   Tailwind CSS + Custom Components
State:     Redux Toolkit + RTK Query
Animation: Framer Motion
Backend:   Supabase (Auth + Database + Realtime)
API:       Gutendex (Project Gutenberg wrapper)
Deploy:    Vercel
```

### 🧠 Smart State Management

**The Problem**: Traditional apps show loading spinners everywhere, creating a fragmented UX.

**Our Solution**: Aggressive data preloading with intelligent state management.

```typescript
// On sign-in, we fetch everything at once
const initializeUserData = async () => {
  const [profile, wishlist, completed, subscriptions] = await Promise.all([
    fetchUserProfile(),
    fetchWishlist(),
    fetchCompletedBooks(), 
    fetchSubscriptionHistory()
  ]);
  
  // Dispatch everything to Redux in one shot
  dispatch(setUserProfile(profile));
  dispatch(setWishlist(wishlist));
  dispatch(setCompletedBooks(completed));
  dispatch(setSubscriptions(subscriptions));
};
```

**Result**: Navigate anywhere in the app instantly—no loading screens.

### 🔄 Advanced Reducer Patterns

**Deduplication Logic**: Prevent duplicate books in user lists using Map-based merging:

```typescript
const booksReducer = (state, action) => {
  case 'SET_COMPLETED_BOOKS':
    const combined = [...state.completedBooks, ...action.payload];
    state.completedBooks = Array.from(
      new Map(combined.map(book => [book.bookId, book])).values()
    );
```

**Why This Works**: Map automatically handles duplicates by bookId, ensuring data integrity without manual loops.

### 🎭 Performance-Optimized Animations

**Responsive Loading Skeletons**:
```typescript
// Desktop: Grid layout
<div className="grid grid-cols-4 gap-6">
  {Array(8).fill(0).map((_, i) => <BookSkeleton key={i} />)}
</div>

// Mobile: Horizontal scroll to prevent overlap
<div className="flex gap-4 overflow-x-auto">
  {Array(6).fill(0).map((_, i) => <BookSkeleton key={i} />)}
</div>
```

**Micro-Interactions**:
```typescript
<motion.div
  whileHover={{ y: -6, transition: { duration: 0.2 } }}
  className="book-card"
>
  {/* Book content */}
</motion.div>
```

### 🛡️ Error Handling & Reliability

**API Proxy Layer**: Gutendex API can be unreliable, so we implemented:
- Automatic retries with exponential backoff
- Local caching for frequently accessed books
- Graceful fallbacks for failed requests

```typescript
const fetchWithRetry = async (url: string, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
```bash
https://github.com/BabarAli08/BookVerse.git
cd bookverse
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
cp .env.example .env.local
```

Add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Database setup**
```bash
# Run the provided SQL migrations in your Supabase dashboard
# Located in /database/migrations/
```

5. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:5173` to see BookVerse in action!

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic components (Button, Card, etc.)
│   ├── book/           # Book-specific components
│   └── layout/         # Layout components
├── features/           # Feature-based modules
│   ├── auth/           # Authentication logic
│   ├── books/          # Book management
│   ├── reading/        # Reading experience
│   └── user/           # User profile & preferences
├── hooks/              # Custom React hooks
├── store/              # Redux store configuration
├── types/              # TypeScript type definitions
├── utils/              # Helper functions
└── styles/             # Global styles and Tailwind config
```

## 🎯 Key Engineering Decisions

### Why Redux Toolkit?
- **Predictable State**: Complex user data relationships need centralized management
- **DevTools**: Excellent debugging experience during development
- **Performance**: Normalized state prevents unnecessary re-renders

### Why Framer Motion?
- **Declarative Animations**: Easy to maintain and modify
- **Performance**: Hardware-accelerated animations
- **Gesture Support**: Touch interactions for mobile users

### Why Supabase?
- **Real-time**: Instant sync across devices
- **Type Safety**: Generated TypeScript types
- **Scalability**: Handles auth, database, and real-time subscriptions

## 🔮 Roadmap

### Phase 1: Enhanced Reading ✅
- [x] Text highlighting system
- [x] Reading preferences
- [x] Progress tracking

### Phase 2: Social Features 🚧
- [ ] Share highlights and notes
- [ ] Reading groups and discussions
- [ ] Social reading challenges

### Phase 3: AI Integration 🔮
- [ ] AI-powered book recommendations
- [ ] Smart reading insights
- [ ] Personalized reading goals

### Phase 4: Premium Features 🔮
- [ ] Stripe subscription integration
- [ ] Premium book catalog
- [ ] Offline reading mode

## 🤝 Contributing

We love contributions! See our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Project Gutenberg](https://www.gutenberg.org/) for providing free books
- [Gutendex API](https://gutendex.com/) for the excellent API wrapper
- The React and TypeScript communities for amazing tools

---

<div align="center">

**Built with ❤️ by Babar Ali**

[⭐ Star this repo](https://github.com/BabarAli08/BookVerse) if you found it helpful!

</div>
