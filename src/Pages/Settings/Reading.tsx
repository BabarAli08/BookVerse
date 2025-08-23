import { useEffect, useState } from "react";
import { BookOpen, ChevronDown, Save } from "lucide-react";
import { useDispatch } from "react-redux";
import supabase from "../../supabase-client";
import { toast } from "sonner";

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

export default function ReadingPreferences() {
  const [loading,setLoading]=useState<boolean>(false)
  const[preferancesLoading,setPreferancesLoading]=useState<boolean>(false)
  const [preferences, setPreferences] = useState({
    readingTheme: {
      id: "light",
      name: "Light",
      bg: "bg-white",
      text: "text-gray-900",
    },
    background: {
      id: "none",
      name: "None",
      pattern: "",
      preview: "bg-transparent",
    },
    fontFamily: "Serif",
    fontSize: "Medium",
    lineSpacing: "Normal",
    autoBookmark: true,
    offlineDownloads: true,
  });

  const dispatch = useDispatch();

  const [isSaving, setIsSaving] = useState(false);


  useEffect(()=>{
    setPreferancesLoading(true)
    const handlePreferances=async()=>{

      const {data:{user},error:userError}=await supabase.auth.getUser()
      if(userError||!user)return
      
      const {data:userSettings,error:settingsError}=await supabase.from('reading_preferances').select('*').eq('user_id',user.id).single()

      if(settingsError){
        toast.warning("could not loading your preferances")
        return
      }
      if(!userSettings)return

      const supabaseSettings={
        readingTheme:themeOptions.find(theme=>theme.id===userSettings.theme) || themeOptions[0],
        background:backgroundOptions.find(background=>background.id===userSettings.background) || backgroundOptions[0],
        fontFamily:userSettings.font_family || "Serif",
        fontSize:userSettings.font_size || "Medium",
        lineSpacing:userSettings.line_spacing || "Normal",
        autoBookmark:userSettings.auto_bookmark || false,
        offlineDownloads:userSettings.offline_downloads || false, 
      
      }
      setPreferences(supabaseSettings)
      setPreferancesLoading(false)
    } 
    handlePreferances()
  },[])
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

  const themeOptions: ThemeOption[] = [
    { id: "light", name: "Light", bg: "bg-white", text: "text-gray-900" },
    { id: "sepia", name: "Sepia", bg: "bg-amber-50", text: "text-amber-900" },
    { id: "dark", name: "Dark", bg: "bg-slate-800", text: "text-white" },
    { id: "forest", name: "Forest", bg: "bg-green-50", text: "text-green-800" },
    { id: "ocean", name: "Ocean", bg: "bg-blue-50", text: "text-blue-800" },
    {
      id: "lavender",
      name: "Lavender",
      bg: "bg-purple-50",
      text: "text-purple-800",
    },
  ];

  const fontFamilyOptions = ["Serif", "Sans Serif", "Monospace", "Dyslexic"];
  const fontSizeOptions = ["Small", "Medium", "Large", "Extra Large"];
  const lineSpacingOptions = ["Tight", "Normal", "Relaxed", "Double"];

  const handleSelectChange = (key: string, value: string) => {
    if (key === "readingTheme") {
      const selectedTheme = themeOptions.find((theme) => theme.id === value);
      setPreferences((prev) => ({
        ...prev,
        [key]: selectedTheme || prev.readingTheme,
      }));
    } else if (key === "background") {
      const selectedBackground = backgroundOptions.find(
        (bg) => bg.id === value
      );
      setPreferences((prev) => ({
        ...prev,
        [key]: selectedBackground || prev.background,
      }));
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
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-900 mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
          size={20}
        />
      </div>
    </div>
  );

  const BackgroundSelectField = ({
    label,
    value,
    options,
    onChange,
  }: SelectFieldProps<BackgroundOption>) => (
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-900 mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          value={value?.id}
          onChange={(e) =>
            onChange(
              options.find((opt) => opt.id === e.target.value) || options[0]
            )
          }
          className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
          size={20}
        />
      </div>
    </div>
  );

  const ThemeSelectField = ({
    label,
    value,
    options,
    onChange,
  }: SelectFieldProps<ThemeOption>) => (
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-900 mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          value={value?.id}
          onChange={(e) =>
            onChange(
              options.find((opt) => opt.id === e.target.value) || options[0]
            )
          }
          className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
          size={20}
        />
      </div>
    </div>
  );

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setLoading(true)
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("kindly login to save preferances");
        setIsSaving(false);
        setLoading(false)
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
        toast.warning(`Error saving your data: ${error.message}`);
        setIsSaving(false);
        setLoading(false)
        return;
      }

      toast.success("Data saved successfully!");
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.warning("An unexpected error occurred");
      setLoading(false)
    } finally {
      setIsSaving(false);
      setLoading(false)
    }
  };
  const getThemeClasses = () => {
    const theme = preferences.readingTheme;
    return `${theme.bg} ${theme.text}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="text-gray-700" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">
          Reading Preferences
        </h2>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
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

        <div className="flex flex-col md:flex-row gap-6">
          <SelectField
            label="Font Size"
            value={preferences.fontSize}
            options={fontSizeOptions}
            onChange={(value: string) => handleSelectChange("fontSize", value)}
          />

          <SelectField
            label="Font Family"
            value={preferences.fontFamily}
            options={fontFamilyOptions}
            onChange={(value: string) =>
              handleSelectChange("fontFamily", value)
            }
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <SelectField
            label="Line Spacing"
            value={preferences.lineSpacing}
            options={lineSpacingOptions}
            onChange={(value: string) =>
              handleSelectChange("lineSpacing", value)
            }
          />
          <div className="flex-1"></div> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Reading Features */}
      <div className="pt-6 border-t border-gray-200">
        <div className="space-y-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex-1">
              <h3 className="text-base font-medium text-gray-900 mb-1">
                Auto Bookmark
              </h3>
              <p className="text-sm text-gray-500">
                Automatically save your reading position
              </p>
            </div>

            <button
              onClick={() => handleToggle("autoBookmark")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                preferences.autoBookmark ? "bg-purple-600" : "bg-gray-200"
              }`}
              role="switch"
              aria-checked={preferences.autoBookmark}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.autoBookmark ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="flex-1">
              <h3 className="text-base font-medium text-gray-900 mb-1">
                Offline Downloads
              </h3>
              <p className="text-sm text-gray-500">
                Allow downloading books for offline reading
              </p>
            </div>

            <button
              onClick={() => handleToggle("offlineDownloads")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                preferences.offlineDownloads ? "bg-purple-600" : "bg-gray-200"
              }`}
              role="switch"
              aria-checked={preferences.offlineDownloads}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.offlineDownloads
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Reading Preview */}
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
                ? "30px 30px"
                : preferences.background.id === "rice-paper"
                ? "16px 16px"
                : "auto",
            backgroundRepeat: "repeat",
          }}
        >
          <p
            className={`${
              preferences.fontFamily === "Sans Serif"
                ? "font-sans"
                : preferences.fontFamily === "Monospace"
                ? "font-mono"
                : preferences.fontFamily === "Dyslexic"
                ? "font-sans"
                : "font-serif"
            } ${
              preferences.fontSize === "Small"
                ? "text-sm"
                : preferences.fontSize === "Large"
                ? "text-lg"
                : preferences.fontSize === "Extra Large"
                ? "text-xl"
                : "text-base"
            } ${
              preferences.lineSpacing === "Tight"
                ? "leading-tight"
                : preferences.lineSpacing === "Relaxed"
                ? "leading-relaxed"
                : preferences.lineSpacing === "Double"
                ? "leading-loose"
                : "leading-normal"
            }`}
          >
            The quick brown fox jumps over the lazy dog. This is a sample of how
            your reading experience will look with the current settings. You can
            adjust the theme, font, and spacing to match your preferences.
          </p>
        </div>
        <button
          onClick={handleSaveSettings}
          disabled={loading}

          className={`px-5 mt-5 py-2 rounded-md transition-all duration-200 flex items-center gap-2 ${loading ? 'bg-gray-700' : "bg-black"} font-medium  text-white hover:bg-gray-800`}
        >
          <Save className="w-4 h-4" />
          {loading?"Saving...": "Save Changes"}
        </button>
      </div>
    </div>
  );
}
