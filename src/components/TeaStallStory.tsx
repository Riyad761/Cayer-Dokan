import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Flame, Sparkles, Heart, Disc, Radio } from 'lucide-react';

interface TeaItem {
  id: string;
  name: string;
  tag: string;
  price: string;
  vibe: string;
  icon: string;
}

const TEA_MENU: TeaItem[] = [
  {
    id: 'doodh-cha',
    name: 'কড়া দুধ চা',
    tag: 'সবচেয়ে জনপ্রিয়',
    price: '১০ ৳',
    vibe: 'ঘন দুধের মিষ্টতায় আড্ডার জ্বালানি',
    icon: '🥛',
  },
  {
    id: 'rong-cha',
    name: 'আদা-লেবু রং চা',
    tag: 'বৃষ্টির সঙ্গী',
    price: '৬ ৳',
    vibe: 'তাজা আদা আর কাগজি লেবুর চনমনে ঝাঁজ',
    icon: '🍋',
  },
  {
    id: 'malai-cha',
    name: 'শাহী মালাই চা',
    tag: 'স্পেশাল মালাই',
    price: '২০ ৳',
    vibe: 'ঘন ক্ষীরের মতো পুরু মালাইয়ের পরত',
    icon: '🍶',
  },
  {
    id: 'toast-biscuit',
    name: 'টংয়ের টোস্ট ও বাকরখানি',
    tag: 'চায়ের ডুবাডুবি',
    price: '৫ ৳',
    vibe: 'কাঁচের বৈয়ামের খাস্তা টোস্ট বিস্কুট',
    icon: '🍪',
  },
];

export const TeaStallStory: React.FC = () => {
  const [orderedCha, setOrderedCha] = useState<string | null>(null);
  const [totalCups, setTotalCups] = useState(148);

  const handleOrder = (name: string) => {
    setOrderedCha(name);
    setTotalCups((prev) => prev + 1);
    setTimeout(() => setOrderedCha(null), 3000);
  };

  return (
    <section id="tea-stall-story-section" className="relative py-12 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Narrative Story Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative bg-gradient-to-b from-[#220e06]/90 to-[#180903]/90 border border-amber-800/40 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xl overflow-hidden"
      >
        {/* Background Vintage Texture Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-700/10 rounded-full blur-2xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
            <Radio className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-xs sm:text-sm font-mono tracking-widest text-amber-400 uppercase font-semibold">
            টংয়ের গল্প ও নস্টালজিয়া
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-anek text-amber-100 tracking-tight mb-4 leading-snug">
          টংয়ের ধোঁয়া ওঠা এক কাপ চা আর ট্রানজিস্টারের সুর
        </h2>

        <p className="text-stone-300 text-sm sm:text-base md:text-lg leading-relaxed font-siliguri mb-6">
          রাস্তার ধারের টিনের চাল, কেরোসিন আর চা-পাতার সোঁদা সুবাস, কাঁচের বৈয়ামে রাখা খাস্তা বিস্কুট আর কাঠের নড়বড়ে বেঞ্চে বসে রাজনীতি থেকে ক্রিকেট নিয়ে জমাট আড্ডা — এটাই বাঙালির আসল প্রাণ। আর পটভূমিতে অনবরত বাজা পুরানো ট্রানজিস্টারের নস্টালজিক গান সেই আড্ডাকে দিয়ে যায় অমর এক আবহ।
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-black/30 border border-amber-900/30">
            <Flame className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold font-anek text-amber-200">সারারাত বিরতিহীন স্ট্রিম</h4>
              <p className="text-xs text-stone-400 font-siliguri mt-0.5">
                দূরপাল্লার নাইট কোচ কিংবা অলস দুপুর — গান বাজবে নন-স্টপ।
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-black/30 border border-amber-900/30">
            <Disc className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold font-anek text-amber-200">অরিজিনাল ইউটিউব অডিও</h4>
              <p className="text-xs text-stone-400 font-siliguri mt-0.5">
                আইয়ুব বাচ্চু, জেমস, অর্ণব ও ব্যান্ডের সেরা সব কালজয়ী ট্র্যাক।
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Virtual Tea Stall Counter */}
        <div className="mt-8 pt-6 border-t border-amber-800/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm font-semibold text-amber-300 font-anek flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              টংয়ের মেনু থেকে অর্ডার করুন:
            </span>
            <span className="text-xs text-amber-400/80 font-mono">
              মোট চা পরিবেশন: {totalCups} কাপ
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {TEA_MENU.map((tea) => (
              <button
                key={tea.id}
                id={`tea-order-${tea.id}`}
                onClick={() => handleOrder(tea.name)}
                className="group relative flex flex-col p-3 rounded-2xl bg-[#1c0c05] hover:bg-[#2c1308] border border-amber-900/50 hover:border-amber-500/60 transition-all duration-200 active:scale-95 text-left cursor-pointer shadow-sm"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-2xl group-hover:scale-110 transition-transform">{tea.icon}</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-700/40">
                    {tea.price}
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-bold font-anek text-amber-100 group-hover:text-amber-300">
                  {tea.name}
                </span>
                <span className="text-[10px] text-stone-400 font-siliguri line-clamp-1 mt-0.5">
                  {tea.vibe}
                </span>
              </button>
            ))}
          </div>

          {orderedCha && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 p-2.5 rounded-xl bg-amber-600/20 border border-amber-500/50 text-amber-200 text-xs font-siliguri text-center flex items-center justify-center gap-2"
            >
              <span>☕</span>
              <span>
                মামা <strong>{orderedCha}</strong> বানাচ্ছেন... ধোঁয়া উঠতেছে! আড্ডা চলতে থাকুক।
              </span>
              <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 inline" />
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
};
