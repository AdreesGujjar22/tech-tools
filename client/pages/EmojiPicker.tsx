"use client";

import { useState, useMemo } from "react";
import SEO from "@/components/SEO";
import { Copy, Search, Sparkles, Check, Heart, Smile, TrendingUp, Activity, Utensils, Lightbulb, Trophy, Rocket, Flag } from "lucide-react";

// Emoji name mapping for search functionality
const EMOJI_NAMES: Record<string, string[]> = {
  "😀": ["smile", "grin", "happy", "face"],
  "😃": ["smile", "happy", "grinning"],
  "😄": ["smile", "happy", "joy", "laugh"],
  "😆": ["laugh", "joy", "happy"],
  "😅": ["smile", "laugh", "sweat"],
  "🤣": ["laugh", "lol", "joy"],
  "😂": ["joy", "happy", "cry", "laugh"],
  "❤️": ["heart", "love", "red"],
  "🧡": ["heart", "orange", "love"],
  "💛": ["heart", "yellow", "love"],
  "💚": ["heart", "green", "love"],
  "💙": ["heart", "blue", "love"],
  "💜": ["heart", "purple", "love"],
  "👋": ["wave", "hand", "goodbye", "hello"],
  "🤚": ["hand", "wave"],
  "👍": ["thumbs", "up", "good", "yes"],
  "👎": ["thumbs", "down", "bad", "no"],
  "🇺🇸": ["usa", "united states", "america"],
  "🇬🇧": ["uk", "united kingdom", "britain"],
  "🇮🇳": ["india"],
  "🇵🇰": ["pakistan"],
  "🇧🇩": ["bangladesh"],
  "🇯🇵": ["japan"],
  "🇨🇳": ["china"],
  "🇦🇺": ["australia"],
  "🇨🇦": ["canada"],
  "🇫🇷": ["france"],
  "🇩🇪": ["germany"],
  "🇮🇹": ["italy"],
  "🇪🇸": ["spain"],
  "🇷🇺": ["russia"],
  "🇧🇷": ["brazil"],
  "🇲🇽": ["mexico"],
  "🍕": ["pizza", "food"],
  "🍔": ["burger", "food"],
  "🍟": ["fries", "food"],
  "🍗": ["chicken", "food"],
  "🥗": ["salad", "food"],
  "🐶": ["dog", "puppy", "animal"],
  "🐱": ["cat", "kitten", "animal"],
  "🐭": ["mouse", "animal"],
  "🦁": ["lion", "animal"],
  "🐻": ["bear", "animal"],
  "🚀": ["rocket", "space"],
  "✈️": ["airplane", "plane"],
  "🚗": ["car", "vehicle"],
  "🏠": ["house", "home"],
  "⭐": ["star", "bright"],
  "🎄": ["tree", "christmas"],
  "⚽": ["football", "soccer", "sports"],
  "🏀": ["basketball", "sports"],
  "🎾": ["tennis", "sports"],
};

const EMOJI_CATEGORIES = {
  smileys: {
    name: "Smileys & Emotion",
    icon: Smile,
    emojis: ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "🥰", "😘", "😗", "😙", "😚", "☺️", "🙂", "🤗", "🤩", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "😴", "😌", "😛", "😜", "😝", "🤤", "😒", "😓", "😔", "😕", "🙃", "🤑", "😲", "☹️", "🙁", "😖", "😞", "😟", "😤", "😢", "😭", "😦", "😧", "😨", "😩", "🤯", "😬", "😰", "😱", "🥵", "🥶", "😳", "🤪", "😵", "😡", "😠", "🤬", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "😇", "🤠", "🤡", "🥳", "🥴", "🥺", "🤥", "🤫", "🤭", "🧐", "🤓", "😈", "👿", "👹", "👺", "💀", "☠️", "👻", "👽", "👾", "🤖", "💩", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾"],
  },
  hearts: {
    name: "Hearts & Love",
    icon: Heart,
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "💌"],
  },
  hands: {
    name: "Hand Gestures",
    icon: TrendingUp,
    emojis: ["👋", "🤚", "🖐", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💅", "🤳", "💪", "🦾", "🦵", "🦿", "🦶", "👣", "👂", "🦻", "👃", "🫀", "🫁", "🧠", "🦷", "🦴", "👀", "👁", "👅", "👄", "💋", "🩸"],
  },
  people: {
    name: "People",
    icon: Activity,
    emojis: ["👶", "👧", "🧒", "👦", "👨", "👩", "👴", "👵", "👱", "👲", "👳", "👮", "👷", "💼", "🎓", "⚕️", "🧑‍⚕️", "🌾", "🍳", "🧑‍🍳", "🚒", "🧑‍🚒", "👨‍✈️", "👩‍✈️", "⚖️", "🧑‍⚖️", "🧑‍🔬", "🧑‍💻", "🧑‍🎨", "🧑‍🎬", "🧑‍🎤", "🧑‍🎧", "🧑‍🏫", "🧑‍🏭", "🧑‍🏗️", "🧑‍🏢", "🧑‍🏥", "🧑‍⚙️", "🧑‍🔧"],
  },
  food: {
    name: "Food & Drink",
    icon: Utensils,
    emojis: ["🍇", "🍈", "🍉", "🍊", "🍋", "🍌", "🍍", "🥭", "🍎", "🍏", "🍐", "🍑", "🍒", "🍓", "🥝", "🍅", "🥥", "🥑", "🍆", "🥔", "🥕", "🌽", "🌶", "🫑", "🥒", "🥬", "🥦", "🧄", "🧅", "🍄", "🥜", "🫘", "🌰", "🍞", "🥐", "🥖", "🫓", "🥨", "🥯", "🥞", "🧇", "🧀", "🍖", "🍗", "🥩", "🥓", "🍔", "🍟", "🍕", "🌭", "🥪", "🌮", "🌯", "🫔", "🥙", "🧆", "🥚", "🍳", "🥘", "🍲", "🫕", "🥣", "🥗", "🍿", "🧈", "🧂", "🥫", "🍱", "🍘", "🍙", "🍚", "🍛", "🍜", "🍝", "🍠", "🍢", "🍣", "🍤", "🍥", "🥮", "🍡", "🥟", "🥠", "🥡", "🍦", "🍧", "🍨", "🍩", "🍪", "🎂", "🍰", "🧁", "🥧", "🍫", "🍬", "🍭", "🍮", "🍯", "🍼", "🥛", "☕", "🫖", "🍵", "🍶", "🍾", "🍷", "🍸", "🍹", "🍺", "🍻", "🥂", "🥃", "🫗", "🥤", "🧋", "🧃", "🧉", "🧊"],
  },
  animals: {
    name: "Animals",
    icon: Rocket,
    emojis: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐻‍❄️", "🐨", "🐯", "🦁", "🐮", "🐷", "🐽", "🐸", "🐵", "🙈", "🙉", "🙊", "🐒", "🐔", "🐧", "🐦", "🦤", "🦩", "🕊", "🦅", "🦆", "🦢", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🪱", "🐛", "🦋", "🐌", "🐞", "🐜", "🪰", "🪲", "🪳", "🐢", "🐍", "🦎", "🦖", "🦕", "🐙", "🦑", "🪸", "🐠", "🐟", "🐡", "🦈", "🐬", "🐳", "🐋", "🦭", "🐊"],
  },
  travel: {
    name: "Travel & Places",
    icon: Trophy,
    emojis: ["🏠", "🏡", "🏢", "🏣", "🏤", "🏥", "🏦", "🏨", "🏪", "🏫", "🏬", "🏭", "🏯", "🏰", "💒", "🗼", "🗽", "⛪", "🕌", "🛕", "🕍", "⛩️", "🛤️", "🛣️", "🗾", "⛲", "⛺", "🌋", "⛰️", "🏔️", "🗻", "🏕️", "⛺", "🚗", "🚕", "🚙", "🚌", "🚎", "🏎", "🚓", "🚑", "🚒", "🚐", "🛻", "🚛", "🚜", "🏍", "🛵", "🦽", "🦼", "🛴", "🚲", "🛹", "🛼", "🚁", "✈️", "🛩", "🛫", "🛬", "🪂", "💺", "🚀", "🛸", "🛶", "⛵", "🚤", "🛥", "🛳", "⛴", "🚢", "🚂", "🚆", "🚇", "🚉", "🚊", "🚝", "🚞", "🚋", "⚓", "⛴️", "🚧"],
  },
  activities: {
    name: "Activities & Sports",
    icon: Lightbulb,
    emojis: ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🎿", "⛷", "🏂", "🪁", "🏄", "🏊", "⛹", "🏋", "🚴", "🚵", "🤸", "🤼", "🤽", "🤾", "🤹", "🎮", "🎯", "🎲", "🎳", "🎪", "🎨", "🎭"],
  },
  objects: {
    name: "Objects",
    icon: Trophy,
    emojis: ["⌚", "📱", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🖲️", "🕹️", "🗜️", "💽", "💾", "💿", "📀", "🧮", "🎥", "🎬", "📺", "📷", "📸", "📹", "🎞️", "📽️", "🎦", "📞", "☎️", "📟", "📠", "📻", "🎙️", "🎚️", "🎛️", "⏱️", "⏲️", "⏰", "🕰️", "📲", "📎", "🖇️", "📐", "📏", "📌", "📍", "✂️", "🖊️", "🖋️", "✒️", "🖌️", "🖍️", "📝", "📁", "📂", "📅", "📆", "📇", "📈", "📉", "📊", "📋", "📑", "🧾", "📜", "📃", "📄", "📕", "📖", "📗", "📘", "📙", "📚", "📓", "📔", "📒", "🧷"],
  },
  flags: {
    name: "Flags",
    icon: Flag,
    emojis: ["🇺🇸", "🇬🇧", "🇨🇦", "🇦🇺", "🇮🇪", "🇿🇦", "🇮🇳", "🇵🇰", "🇧🇩", "🇯🇵", "🇨🇳", "🇮🇷", "🇨🇭", "🇩🇪", "🇫🇷", "🇮🇹", "🇪🇸", "🇸🇪", "🇲🇪", "🇳🇴", "🇳🇱", "🇧🇪", "🇦🇹", "🇵🇹", "🇬🇷", "🇹🇷", "🇰🇷", "🇹🇭", "🇲🇾", "🇸🇬", "🇮🇩", "🇵🇭", "🇻🇳", "🇮🇶", "🇸🇦", "🇦🇪", "🇪🇬", "🇮🇱", "🇯🇴", "🇱🇧", "🇸🇾", "🇴🇲", "🇦🇫", "🇳🇵", "🇱🇰", "🇲🇲", "🇰🇭", "🇱🇦", "🇭🇰", "🇲🇴", "🇹🇼", "🇲🇳", "🇿🇼", "🇳🇬", "🇰🇪", "🇬🇭", "🇪🇹", "🇧🇹", "🇲🇹", "🇦🇱", "🇦🇿", "🇦🇲", "🇧🇬", "🇭🇷", "🇭🇺", "🇷🇴", "🇷🇸", "🇺🇦", "🇧🇾", "🇲🇩", "🇹🇿", "🇺🇬", "🇳🇦", "🇻🇳", "🇱🇾", "🇦🇴", "🇨🇻", "🇰🇿", "🇸🇱", "🇹🇱", "🇱🇹", "🇱🇻", "🇪🇪", "🇬🇪", "🇫🇮", "🇸🇰", "🇨🇿", "🇵🇱", "🇷🇺", "🇺🇿", "🇲🇦", "🇻🇦", "🇦🇩", "🇱🇺", "🇩🇰", "🇮🇸", "🇸🇸", "🇸🇩", "🇲🇱", "🇰🇲", "🇱🇸", "🇧🇳", "🇷🇪", "🇳🇪", "🇹🇯", "🇰🇬", "🇬🇼", "🇻🇨", "🇱🇨", "🇰🇳", "🇩🇲", "🇬🇩", "🇧🇧", "🇲🇺", "🇦🇮", "🇰🇮", "🇵🇼", "🇲🇭", "🇳🇷", "🇲🇶", "🇸🇨", "🇧🇴", "🇵🇾", "🇺🇾", "🇪🇨", "🇵🇪", "🇨🇱", "🇦🇷", "🇨🇴", "🇻🇪", "🇬🇾", "🇸🇷", "🇧🇷", "🇲🇽", "🇭🇳", "🇬🇹", "🇪🇱", "🇳🇮", "🇨🇷", "🇵🇦", "🇧🇿", "🇨🇺", "🇵🇷", "🇹🇹", "🇱🇮", "🇾🇪", "🇨🇾", "🇹🇲", "🇦🇬", "🇧🇦", "🇯🇪", "🇬🇬", "🇮🇲", "🇫🇴", "🇲🇼", "🇿🇲", "🏳️", "🏴", "🏁"],
  },
};

export default function EmojiPicker() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("smileys");
  const [copied, setCopied] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);

  const filteredEmojis = useMemo(() => {
    if (!searchQuery) {
      return EMOJI_CATEGORIES[selectedCategory as keyof typeof EMOJI_CATEGORIES]?.emojis || [];
    }

    let allEmojis: string[] = [];
    Object.values(EMOJI_CATEGORIES).forEach((cat) => {
      allEmojis = allEmojis.concat(cat.emojis);
    });

    const query = searchQuery.toLowerCase().trim();

    // Search by emoji name or category
    return allEmojis.filter((emoji) => {
      // Check if emoji has names and any match the query
      const names = EMOJI_NAMES[emoji] || [];
      return names.some((name) => name.includes(query));
    });
  }, [searchQuery, selectedCategory]);

  const copyEmoji = async (emoji: string) => {
    try {
      await navigator.clipboard.writeText(emoji);
      setCopied(emoji);
      setToastMessage(`${emoji} Copied!`);
      if (!recentEmojis.includes(emoji)) {
        setRecentEmojis([emoji, ...recentEmojis].slice(0, 8));
      }
      setTimeout(() => setCopied(""), 1500);
      setTimeout(() => setToastMessage(""), 2500);
    } catch (err) {
      if (err instanceof Error && err.name === "NotAllowedError") {
        setToastMessage("Emoji: " + emoji);
        setTimeout(() => setToastMessage(""), 2500);
      } else {
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <SEO
        title="Emoji Picker & Copier"
        description="Browse, search, and copy emojis easily. Find the perfect emoji for your messages and posts."
        keywords="emoji picker, emoji copier, emoji search, emojis, emoticons"
      />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-[1280px] mx-auto">
          {/* Header */}
          <div className="mb-12 text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(76,215,246,0.15)] bg-[#131B2E]">
              <Sparkles className="w-4 h-4 text-[#4CD7F6]" />
              <span className="text-[#4CD7F6] text-xs font-semibold tracking-wider uppercase">Premium Utility</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight gradient-text">
              Emoji Picker & Copier
            </h1>
            <p className="text-base text-[#C7C4D8]">
              Browse and copy emojis instantly. Find the perfect emoji for any occasion.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Search emojis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-[12px] border border-[rgba(70,69,85,0.30)] bg-[#131B2E] text-[#DAE2FD] placeholder-[#6B7280] focus:outline-none focus:border-[#4F46E5] text-sm"
              />
            </div>
          </div>

          {/* Recent Emojis */}
          {recentEmojis.length > 0 && !searchQuery && (
            <div className="max-w-2xl mx-auto mb-8">
              <h2 className="text-sm font-semibold text-[#DAE2FD] mb-3">Recently Copied</h2>
              <div className="glass-card-dark p-4 rounded-[12px] flex gap-2 flex-wrap">
                {recentEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => copyEmoji(emoji)}
                    className="w-12 h-12 rounded-lg bg-[rgba(45,52,73,0.50)] hover:bg-[rgba(45,52,73,0.80)] text-2xl flex items-center justify-center transition-colors"
                    title="Click to copy"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Category Tabs */}
          {!searchQuery && (
            <div className="max-w-full mx-auto mb-8 overflow-x-auto">
              <div className="flex gap-2 pb-2">
                {Object.entries(EMOJI_CATEGORIES).map(([key, category]) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap text-sm font-semibold transition-colors ${
                        selectedCategory === key
                          ? "bg-[#4F46E5] text-white"
                          : "bg-[rgba(45,52,73,0.50)] text-[#DAE2FD] hover:bg-[rgba(45,52,73,0.80)]"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      {category.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Emoji Grid */}
          <div className="max-w-full">
            {filteredEmojis.length > 0 ? (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                {filteredEmojis.map((emoji, index) => (
                  <button
                    key={`${emoji}-${index}`}
                    onClick={() => copyEmoji(emoji)}
                    className={`aspect-square rounded-lg flex items-center justify-center transition-all relative group font-emoji ${
                      copied === emoji
                        ? "bg-green-500/30 scale-110 border border-green-500"
                        : "bg-[rgba(45,52,73,0.50)] hover:bg-[rgba(45,52,73,0.80)] border border-transparent"
                    }`}
                    title="Click to copy"
                    style={{
                      fontSize: "3rem",
                      fontVariantEmoji: "emoji",
                      fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif',
                      lineHeight: "1",
                      padding: "0"
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {emoji}
                    </span>
                    {/* Copy Icon Overlay */}
                    <div className="absolute inset-0 rounded-lg flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      {copied === emoji ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5 text-white" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Sparkles className="w-16 h-16 text-[#6B7280] mx-auto mb-4 opacity-50" />
                <p className="text-[#C7C4D8]">No emojis found</p>
                <p className="text-sm text-[#6B7280] mt-2">Try a different search term</p>
              </div>
            )}
          </div>

          {/* Info Footer */}
          <div className="mt-12 text-center text-sm text-[#C7C4D8]">
            <p>Click any emoji to copy it to your clipboard</p>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg bg-[#131B2E] border border-[#4F46E5] text-[#DAE2FD] font-semibold text-sm flex items-center gap-2 shadow-lg animate-fade-in-scale z-50">
          <Check className="w-4 h-4 text-green-400" />
          {toastMessage}
        </div>
      )}
    </div>
  );
}
