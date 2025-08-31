import { useEffect, useState } from "react";
import { BookOpen, ChevronDown, Save, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import supabase from "../../supabase-client";
import { toast } from "sonner";
import LoadingSkeleton from "./LoadingSkeleton";
import {
  updateReadingTheme,
  updateBackgroundPattern,
  updateTypographySettings,
  updateAutoBookmark,
  updateOfflineDownloads,
} from "../../Store/UserSettingsSlice";

interface ThemeOption {
  id: string;
  name: string;
  bg: string;
  text: string;
}

interface BackgroundOption {
  id: string;
  name: string;
  pattern: string;
  preview: string;
}

interface SelectFieldProps<T> {
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
}

interface RootState {
  userSettings: {
    reading: {
      appearanceSettings: {
        readingTheme: {
          id: string;
          name: string;
          bg: string;
          text: string;
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
    };
  };
}

export default function ReadingPreferences() {
  const dispatch = useDispatch();
  const [isSaving, setIsSaving] = useState(false);

  // Get data from Redux store
  const readingSettings = useSelector(
    (state: RootState) => state.userSettings.reading
  );

  // Local state that mirrors Redux state for form handling
  const [preferences, setPreferences] = useState({
    readingTheme: readingSettings.appearanceSettings.readingTheme,
    background: readingSettings.appearanceSettings.backgroundPattern,
    fontFamily: readingSettings.typographySettings.fontFamily,
    fontSize: readingSettings.typographySettings.fontSize,
    lineSpacing: readingSettings.typographySettings.lineSpacing,
    autoBookmark: readingSettings.readingFeatures.autoBookmark,
    offlineDownloads: readingSettings.readingFeatures.offlineDownloads,
  });

  // Update local state when Redux state changes
  useEffect(() => {
    setPreferences({
      readingTheme: readingSettings.appearanceSettings.readingTheme,
      background: readingSettings.appearanceSettings.backgroundPattern,
      fontFamily: readingSettings.typographySettings.fontFamily,
      fontSize: readingSettings.typographySettings.fontSize,
      lineSpacing: readingSettings.typographySettings.lineSpacing,
      autoBookmark: readingSettings.readingFeatures.autoBookmark,
      offlineDownloads: readingSettings.readingFeatures.offlineDownloads,
    });
  }, [readingSettings]);

  const backgroundOptions: BackgroundOption[] = [
    { id: "none", name: "None", pattern: "", preview: "bg-transparent" },
    {
      id: "notebook-paper",
      name: "Notebook Paper",
      pattern:
        "repeating-linear-gradient(transparent, transparent 23px, #3b82f6 24px, #3b82f6 25px), linear-gradient(90deg, #ef4444 0px, #ef4444 1px, transparent 1px, transparent 80px)",
      preview: "bg-white",
    },
    {
      id: "graph-paper",
      name: "Graph Paper",
      pattern:
        "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
      preview: "bg-blue-50",
    },
    {
      id: "parchment",
      name: "Parchment",
      pattern:
        "radial-gradient(circle at 30% 20%, rgba(139, 69, 19, 0.06) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(160, 82, 45, 0.08) 0%, transparent 50%), radial-gradient(circle at 20% 70%, rgba(205, 133, 63, 0.04) 0%, transparent 50%)",
      preview: "bg-amber-100",
    },
    {
      id: "aged-paper",
      name: "Aged Paper",
      pattern:
        "radial-gradient(circle at 10% 10%, rgba(139, 69, 19, 0.1) 0%, transparent 30%), radial-gradient(circle at 90% 20%, rgba(160, 82, 45, 0.08) 0%, transparent 40%), radial-gradient(circle at 30% 90%, rgba(205, 133, 63, 0.09) 0%, transparent 35%), radial-gradient(circle at 80% 80%, rgba(222, 184, 135, 0.06) 0%, transparent 45%)",
      preview: "bg-yellow-100",
    },
    {
      id: "watermark",
      name: "Watermark",
      pattern:
        "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.04) 0%, transparent 70%)",
      preview: "bg-gray-50",
    },
    {
      id: "rice-paper",
      name: "Rice Paper",
      pattern:
        "radial-gradient(circle at 2px 2px, rgba(0,0,0,0.08) 1px, transparent 1px), radial-gradient(circle at 6px 14px, rgba(0,0,0,0.06) 1px, transparent 1px), radial-gradient(circle at 14px 6px, rgba(0,0,0,0.07) 1px, transparent 1px)",
      preview: "bg-stone-50",
    },
    {
      id: "canvas",
      name: "Canvas",
      pattern:
        "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.06) 1px, rgba(0,0,0,0.06) 2px), repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0,0,0,0.06) 1px, rgba(0,0,0,0.06) 2px)",
      preview: "bg-neutral-50",
    },
    {
      id: "linen",
      name: "Linen",
      pattern:
        "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px), repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
      preview: "bg-slate-50",
    },
    {
      id: "fabric",
      name: "Fabric",
      pattern:
        "repeating-linear-gradient(0deg, rgba(0,0,0,0.04), rgba(0,0,0,0.04) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(90deg, rgba(0,0,0,0.04), rgba(0,0,0,0.04) 1px, transparent 1px, transparent 4px)",
      preview: "bg-gray-100",
    },
    {
      id: "vintage-dots",
      name: "Vintage Dots",
      pattern:
        "radial-gradient(circle at 2px 2px, rgba(139, 69, 19, 0.15) 1px, transparent 1px), radial-gradient(circle at 12px 12px, rgba(160, 82, 45, 0.12) 1px, transparent 1px)",
      preview: "bg-amber-50",
    },
    {
      id: "crosshatch",
      name: "Crosshatch",
      pattern:
        "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.06) 8px, rgba(0,0,0,0.06) 10px), repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(0,0,0,0.06) 8px, rgba(0,0,0,0.06) 10px)",
      preview: "bg-slate-100",
    },
    {
      id: "manuscript",
      name: "Manuscript",
      pattern:
        "linear-gradient(90deg, rgba(139, 69, 19, 0.15) 0px, rgba(139, 69, 19, 0.15) 2px, transparent 2px, transparent 100%), repeating-linear-gradient(transparent, transparent 19px, rgba(139, 69, 19, 0.3) 20px, rgba(139, 69, 19, 0.3) 21px)",
      preview: "bg-orange-50",
    },
    {
      id: "stipple",
      name: "Stipple",
      pattern:
        "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 0.5px, transparent 0.5px), radial-gradient(circle at 5px 3px, rgba(0,0,0,0.08) 0.5px, transparent 0.5px), radial-gradient(circle at 3px 7px, rgba(0,0,0,0.09) 0.5px, transparent 0.5px), radial-gradient(circle at 8px 6px, rgba(0,0,0,0.07) 0.5px, transparent 0.5px)",
      preview: "bg-stone-100",
    },
    {
      id: "zen-waves",
      name: "Zen Waves",
      pattern:
        "repeating-radial-gradient(ellipse at 50% 0%, transparent 0%, transparent 40%, rgba(0,0,0,0.04) 41%, rgba(0,0,0,0.04) 43%, transparent 44%)",
      preview: "bg-blue-50",
    },
    {
      id: "organic",
      name: "Organic",
      pattern:
        "radial-gradient(ellipse at 20% 30%, rgba(34, 197, 94, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(16, 185, 129, 0.08) 0%, transparent 60%), radial-gradient(ellipse at 60% 20%, rgba(52, 211, 153, 0.04) 0%, transparent 40%)",
      preview: "bg-emerald-50",
    },
    {
      id: "minimalist-lines",
      name: "Minimalist Lines",
      pattern:
        "repeating-linear-gradient(180deg, transparent, transparent 40px, rgba(0,0,0,0.04) 40px, rgba(0,0,0,0.04) 42px)",
      preview: "bg-neutral-50",
    },
    {
      id: "dots",
      name: "Simple Dots",
      pattern:
        "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)",
      preview: "bg-white",
    },
    {
      id: "diagonal-stripes",
      name: "Diagonal Stripes",
      pattern:
        "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)",
      preview: "bg-gray-50",
    },
  ];

  const themeOptions = [
    {
      id: "light",
      name: "Light",
      bg: "bg-white",
      text: "text-gray-900",
      hex: { bg: "#FFFFFF", text: "#111827" }, // gray-900 hex
    },
    {
      id: "sepia",
      name: "Sepia",
      bg: "bg-amber-50",
      text: "text-amber-900",
      hex: { bg: "#FFFBEB", text: "#78350F" }, // amber-50 & amber-900
    },
    {
      id: "dark",
      name: "Dark",
      bg: "bg-slate-800",
      text: "text-white",
      hex: { bg: "#1E293B", text: "#FFFFFF" }, 
    },
    {
      id: "forest",
      name: "Forest",
      bg: "bg-green-50",
      text: "text-green-800",
      hex: { bg: "#ECFDF5", text: "#065F46" }, 
    },
    {
      id: "ocean",
      name: "Ocean",
      bg: "bg-blue-50",
      text: "text-blue-800",
      hex: { bg: "#EFF6FF", text: "#1E40AF" }, 
    },
    {
      id: "lavender",
      name: "Lavender",
      bg: "bg-purple-50",
      text: "text-purple-800",
      hex: { bg: "#FAF5FF", text: "#5B21B6" },
    },
  ];

  const fontFamilyOptions = ["Serif", "Sans Serif", "Monospace", "Dyslexic"];
  const fontSizeOptions = ["Small", "Medium", "Large", "Extra Large"];
  const lineSpacingOptions = ["Tight", "Normal", "Relaxed", "Double"];

  const handleSelectChange = (key: string, value: string) => {
    if (key === "readingTheme") {
      const selectedTheme = themeOptions.find((theme) => theme.id === value);
      if (selectedTheme) {
        setPreferences((prev) => ({
          ...prev,
          [key]: selectedTheme,
        }));
      }
    } else if (key === "background") {
      const selectedBackground = backgroundOptions.find(
        (bg) => bg.id === value
      );
      if (selectedBackground) {
        setPreferences((prev) => ({
          ...prev,
          [key]: selectedBackground,
        }));
      }
    } else {
      setPreferences((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  const handleToggle = (key: "autoBookmark" | "offlineDownloads") => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const SelectField = ({
    label,
    value,
    options,
    onChange,
  }: SelectFieldProps<string>) => (
    <motion.div
      className="flex-1"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label}
      </label>
      <div className="relative">
        <motion.select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3.5 pr-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.15 }}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </motion.select>
        <motion.div
          className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
          animate={{ rotate: 0 }}
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="text-gray-400" size={18} />
        </motion.div>
      </div>
    </motion.div>
  );

  const BackgroundSelectField = ({
    label,
    value,
    options,
    onChange,
  }: SelectFieldProps<BackgroundOption>) => (
    <motion.div
      className="flex-1"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
    >
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label}
      </label>
      <div className="relative">
        <motion.select
          value={value?.id || ""}
          onChange={(e) =>
            onChange(
              options.find((opt) => opt.id === e.target.value) || options[0]
            )
          }
          className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3.5 pr-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.15 }}
        >
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </motion.select>
        <motion.div
          className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
          animate={{ rotate: 0 }}
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="text-gray-400" size={18} />
        </motion.div>
      </div>
    </motion.div>
  );

  const ThemeSelectField = ({
    label,
    value,
    options,
    onChange,
  }: SelectFieldProps<ThemeOption>) => (
    <motion.div
      className="flex-1"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label}
      </label>
      <div className="relative">
        <motion.select
          value={value?.id || ""}
          onChange={(e) =>
            onChange(
              options.find((opt) => opt.id === e.target.value) || options[0]
            )
          }
          className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3.5 pr-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.15 }}
        >
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </motion.select>
        <motion.div
          className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
          animate={{ rotate: 0 }}
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="text-gray-400" size={18} />
        </motion.div>
      </div>
    </motion.div>
  );

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("Please login to save preferences");
        return;
      }

      const data = {
        user_id: user.id,
        theme: preferences.readingTheme.id,
        background: preferences.background.id,
        font_family: preferences.fontFamily,
        font_size: preferences.fontSize,
        line_spacing: preferences.lineSpacing,
        auto_bookmark: preferences.autoBookmark,
        offline_downloads: preferences.offlineDownloads,
      };

      const { error } = await supabase
        .from("reading_preferances")
        .upsert([data], {
          onConflict: "user_id",
        });

      if (error) {
        console.error("Save error:", error);
        toast.error(`Error saving preferences: ${error.message}`);
        return;
      }

      dispatch(updateReadingTheme(preferences.readingTheme));
      dispatch(updateBackgroundPattern(preferences.background));
      dispatch(
        updateTypographySettings({
          fontSize: preferences.fontSize,
          fontFamily: preferences.fontFamily,
          lineSpacing: preferences.lineSpacing,
        })
      );
      dispatch(updateAutoBookmark(preferences.autoBookmark));
      dispatch(updateOfflineDownloads(preferences.offlineDownloads));

      toast.success("Preferences saved successfully!");
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const getThemeClasses = () => {
    const theme = preferences.readingTheme;
    return `${theme.bg} ${theme.text}`;
  };

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        ease: "easeOut",
      },
    },
  };

  const sectionVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const hasValidData =
    preferences.readingTheme.id !== "" || preferences.background.id !== "";

  return (
    <AnimatePresence>
      {!hasValidData ? (
        <LoadingSkeleton />
      ) : (
        <motion.div
          className="space-y-8 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex items-center gap-4 pb-2"
            variants={sectionVariants}
          >
            <motion.div
              className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm"
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <BookOpen className="text-blue-600" size={28} />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Reading Preferences
              </h2>
              <p className="text-gray-500 mt-1">
                Customize your reading experience
              </p>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
            variants={sectionVariants}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Appearance Settings
            </h3>

            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <ThemeSelectField
                  label="Reading Theme"
                  value={preferences.readingTheme}
                  options={themeOptions}
                  onChange={(selectedTheme: ThemeOption) =>
                    setPreferences((prev) => ({
                      ...prev,
                      readingTheme: selectedTheme,
                    }))
                  }
                />

                <BackgroundSelectField
                  label="Background Pattern"
                  value={preferences.background}
                  options={backgroundOptions}
                  onChange={(selectedBackground: BackgroundOption) =>
                    setPreferences((prev) => ({
                      ...prev,
                      background: selectedBackground,
                    }))
                  }
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
            variants={sectionVariants}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Typography Settings
            </h3>

            <div className="flex flex-col lg:flex-row gap-6">
              <SelectField
                label="Font Size"
                value={preferences.fontSize}
                options={fontSizeOptions}
                onChange={(value: string) =>
                  handleSelectChange("fontSize", value)
                }
              />

              <SelectField
                label="Font Family"
                value={preferences.fontFamily}
                options={fontFamilyOptions}
                onChange={(value: string) =>
                  handleSelectChange("fontFamily", value)
                }
              />

              <SelectField
                label="Line Spacing"
                value={preferences.lineSpacing}
                options={lineSpacingOptions}
                onChange={(value: string) =>
                  handleSelectChange("lineSpacing", value)
                }
              />
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
            variants={sectionVariants}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Reading Features
            </h3>

            <div className="space-y-6">
              <motion.div
                className="flex items-center justify-between py-2"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex-1">
                  <h4 className="text-base font-medium text-gray-900">
                    Auto Bookmark
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Automatically save your reading position
                  </p>
                </div>

                <motion.button
                  onClick={() => handleToggle("autoBookmark")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    preferences.autoBookmark ? "bg-blue-600" : "bg-gray-200"
                  }`}
                  whileTap={{ scale: 0.95 }}
                  role="switch"
                  aria-checked={preferences.autoBookmark}
                >
                  <motion.span
                    className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm"
                    animate={{
                      x: preferences.autoBookmark ? 24 : 4,
                    }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  />
                </motion.button>
              </motion.div>

              <motion.div
                className="flex items-center justify-between py-2"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex-1">
                  <h4 className="text-base font-medium text-gray-900">
                    Offline Downloads
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Allow downloading books for offline reading
                  </p>
                </div>

                <motion.button
                  onClick={() => handleToggle("offlineDownloads")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    preferences.offlineDownloads ? "bg-blue-600" : "bg-gray-200"
                  }`}
                  whileTap={{ scale: 0.95 }}
                  role="switch"
                  aria-checked={preferences.offlineDownloads}
                >
                  <motion.span
                    className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm"
                    animate={{
                      x: preferences.offlineDownloads ? 24 : 4,
                    }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  />
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
            <div
              className={`p-6 rounded-lg border-2 border-gray-200 ${getThemeClasses()}`}
              style={{
                backgroundImage: preferences.background.pattern || "none",
                backgroundSize:
                  preferences.background.id === "graph-paper"
                    ? "20px 20px"
                    : preferences.background.id === "notebook-paper"
                    ? "80px 25px"
                    : preferences.background.id === "canvas"
                    ? "4px 4px"
                    : preferences.background.id === "fabric"
                    ? "4px 4px"
                    : preferences.background.id === "crosshatch"
                    ? "16px 16px"
                    : preferences.background.id === "vintage-dots"
                    ? "14px 14px"
                    : preferences.background.id === "stipple"
                    ? "10px 10px"
                    : preferences.background.id === "zen-waves"
                    ? "100px 50px"
                    : preferences.background.id === "minimalist-lines"
                    ? "100% 42px"
                    : preferences.background.id === "dots"
                    ? "10px 10px"
                    : preferences.background.id === "diagonal-stripes"
                    ? "30px 30"
                    : preferences.background.id === "rice-paper"
                    ? "16px 16px"
                    : "auto",
                backgroundRepeat: "repeat",
              }}
            >
              <p
                className="text-base leading-relaxed"
                style={{
                  fontFamily: preferences.fontFamily,
                  fontSize:
                    preferences.fontSize === "Small"
                      ? "0.875rem"
                      : preferences.fontSize === "Medium"
                      ? "1rem"
                      : preferences.fontSize === "Large"
                      ? "1.25rem"
                      : "1.5rem",
                  lineHeight:
                    preferences.lineSpacing === "Tight"
                      ? "1.2"
                      : preferences.lineSpacing === "Normal"
                      ? "1.5"
                      : preferences.lineSpacing === "Relaxed"
                      ? "1.75"
                      : "2",
                }}
              >
                This is how your reading experience will look. Adjust the
                settings to match your style
              </p>
            </div>
            <div className="flex justify-start pt-6 border-t border-gray-200">
              <motion.button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className={`flex items-center gap-2 px-5 py-2 rounded-md font-medium transition-all duration-200 ${
                  isSaving
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
                whileTap={{ scale: isSaving ? 1 : 0.97 }}
              >
                {isSaving ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Settings className="w-4 h-4" />
                    </motion.div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Preferences
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
