import { createSlice } from "@reduxjs/toolkit";

interface billingState {
  name: string;
  endDate: string;
  price: string;
}

interface currentlyReading {
  bookId: number;
  title: string;
  description: string;
  authors: string;
  tier: string;
  cover: string;
  publishedAt: number;
}

interface wishlistedBook {
  title: string;
  bookId: number;
  description: string;
  authors: string;
  tier: string;
  cover: string;
  publishedAt: number;
}

interface initial {
  profile: {
    name: string;
    email: string;
    location: string;
    website: string;
    bio: string;
  };
  notifications: {
    emailUpdates: boolean;
    pushNotifications: boolean;
    weeklyDigest: boolean;
    bookRecommendations: boolean;
    socialActivity: boolean;
  };
  privacy: {
    profileVisibility: string;
    showReadingActivity: boolean;
    showLibrary: boolean;
    allowMessages: boolean;
  };
  reading: {
    appearanceSettings: {
      readingTheme: {
        id: string;
        name: string;
        bg: string;
        text: string;
        hex: { bg: string; text: string };
      };
      backgroundPattern: {
        id: string;
        name: string;
        pattern: string;
        preview: string;
      };
    };
    typographySettings: {
      fontSize: string;
      fontFamily: string;
      lineSpacing: string;
    };
    readingFeatures: {
      autoBookmark: boolean;
      offlineDownloads: boolean;
    };
    billing: {
      currentPlan: {
        id: string;
        name: string;
        price: number;
        nextBillingDate: string;
        status: string;
        billingCycle: string;
      };
      paymentMethod: {
        type: string;
        expiryDate: string;
        cardNumber: string;
        cvc: number | null;
        cardHolderName: string;
      };
      billingHistory: billingState[];
      subscriptionManagement: {
        autoRenewal: boolean;
        billingNotifications: boolean;
      };
    };
  };
  streaks: {
    streaks: number;
    longestStreak: number;
  };
  currentlyReading: currentlyReading[];
  completedBooks: currentlyReading[];
  wishlistedBook: wishlistedBook[];
}

const initialState: initial = {
  profile: {
    name: "",
    email: "",
    location: "",
    website: "",
    bio: "",
  },
  notifications: {
    emailUpdates: true,
    pushNotifications: true,
    weeklyDigest: true,
    bookRecommendations: true,
    socialActivity: true,
  },
  privacy: {
    profileVisibility: "public",
    showReadingActivity: true,
    showLibrary: true,
    allowMessages: true,
  },
  reading: {
    appearanceSettings: {
      readingTheme: {
        id: "light",
        name: "Light",
        bg: "bg-white",
        text: "text-gray-900",
        hex: { bg: "#FFFFFF", text: "#111827" },
      },
      backgroundPattern: {
        id: "none",
        name: "None",
        pattern: "",
        preview: "bg-transparent",
      },
    },
    typographySettings: {
      fontSize: "Medium",
      fontFamily: "Serif",
      lineSpacing: "Normal",
    },
    readingFeatures: {
      autoBookmark: true,
      offlineDownloads: true,
    },
    billing: {
      currentPlan: {
        id: "free",
        name: "Free",
        price: 0,
        nextBillingDate: "N/A",
        status: "active",
        billingCycle: "monthly",
      },
      paymentMethod: {
        type: "visa",
        expiryDate: "",
        cardNumber: "",
        cvc: null,
        cardHolderName: "",
      },
      billingHistory: [],
      subscriptionManagement: {
        autoRenewal: true,
        billingNotifications: false,
      },
    },
  },
  streaks: {
    streaks: 0,
    longestStreak: 0,
  },
  currentlyReading: [],
  completedBooks: [],
  wishlistedBook: [],
};

const userSettingsSlice = createSlice({
  name: "userSettings",
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      state.profile = action.payload;
    },
    updateNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    updatePrivacy: (state, action) => {
      state.privacy = action.payload;
    },
    updateReadingTheme: (state, action) => {
      state.reading.appearanceSettings.readingTheme = action.payload;
    },
    updateBackgroundPattern: (state, action) => {
      state.reading.appearanceSettings.backgroundPattern = action.payload;
    },
    updateTypographySettings: (state, action) => {
      state.reading.typographySettings = {
        ...state.reading.typographySettings,
        ...action.payload,
      };
    },
    updateAutoBookmark: (state, action) => {
      state.reading.readingFeatures.autoBookmark = action.payload;
    },
    updateOfflineDownloads: (state, action) => {
      state.reading.readingFeatures.offlineDownloads = action.payload;
    },
    updateCurrentPlan: (state, action) => {
      state.reading.billing.currentPlan = action.payload;
    },
    updatePaymentMethod: (state, action) => {
      state.reading.billing.paymentMethod = action.payload;
    },
    updateUserStreaks: (state, action) => {
      state.streaks = action.payload;
    },
    updateCurrentlyReading: (state, action) => {
      const combined = [...state.currentlyReading, ...action.payload];
      state.currentlyReading = Array.from(
        new Map(combined.map((book) => [book.bookId, book])).values()
      );
    },
    removeFromCurrentlyReading: (state, action) => {
      state.currentlyReading = state.currentlyReading.filter(
        (book) => book.bookId !== action.payload
      );
    },
    updateWishlisted: (state, action) => {
      if (action.payload.replace) {
        state.wishlistedBook = action.payload.books;
      } else {
        const newBooks = action.payload.filter(
          (book: wishlistedBook) =>
            !state.wishlistedBook.some((b) => b.bookId === book.bookId)
        );

        state.wishlistedBook = [...state.wishlistedBook, ...newBooks];
      }
    },
    removeFromWishlist: (state, action) => {
      state.wishlistedBook = state.wishlistedBook.filter(
        (book) => book.bookId !== action.payload
      );
    },
    updateCompletedBooks: (state, action) => {
      const newBooks = action.payload.filter(
        (book:currentlyReading) => !state.completedBooks.some((b) => b.bookId === book.bookId)
      );

      state.completedBooks = [...state.completedBooks, ...newBooks];
    },
    updateBillingHistory: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.reading.billing.billingHistory = action.payload;
      } else if (action.payload && typeof action.payload === "object") {
        const newItem = action.payload;

        state.reading.billing.billingHistory = [
          newItem,
          ...state.reading.billing.billingHistory,
        ];
      }
    },

    updateAutoRenewal: (state, action) => {
      state.reading.billing.subscriptionManagement.autoRenewal = action.payload;
    },
    updateBillingNotifications: (state, action) => {
      state.reading.billing.subscriptionManagement.billingNotifications =
        action.payload;
    },

    cleanBillingHistory: (state) => {
      state.reading.billing.billingHistory =
        state.reading.billing.billingHistory.filter(
          (item) => item && item.name && item.endDate && item.price
        );
    },
    resetUserSettings: () => {
      return initialState;
    },
  },
});

export const {
  updateProfile,
  updateNotifications,
  updatePrivacy,
  resetUserSettings,
  updateReadingTheme,
  removeFromCurrentlyReading,
  updateBackgroundPattern,
  updateTypographySettings,
  updateAutoBookmark,
  updateOfflineDownloads,
  updateCurrentPlan,
  updateCurrentlyReading,
  updateUserStreaks,
  removeFromWishlist,
  updateCompletedBooks,
  updatePaymentMethod,
  updateWishlisted,
  updateBillingHistory,
  updateAutoRenewal,
  updateBillingNotifications,
  cleanBillingHistory,
} = userSettingsSlice.actions;

export default userSettingsSlice.reducer;
