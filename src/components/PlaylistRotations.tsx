import React from 'react';
import { CategoryFilter } from '../types';
import { Disc3, Moon, Coffee, HeartCrack, Users } from 'lucide-react';

interface PlaylistRotationsProps {
  selectedCategory: CategoryFilter;
  onSelectCategory: (category: CategoryFilter) => void;
  categoryCounts: Record<CategoryFilter, number>;
}

const CATEGORY_ITEMS: {
  id: CategoryFilter;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'সব গান',
    label: 'সব গান',
    sublabel: 'সম্পূর্ণ সংগ্রহ',
    icon: <Disc3 className="w-3.5 h-3.5" />,
  },
  {
    id: 'রাতের হাইওয়ে',
    label: 'রাতের হাইওয়ে',
    sublabel: 'লং ড্রাইভ ও কুয়াশা',
    icon: <Moon className="w-3.5 h-3.5" />,
  },
  {
    id: 'চায়ের ক্লাসিক',
    label: 'চায়ের ক্লাসিক',
    sublabel: 'টংয়ের সেরা সুর',
    icon: <Coffee className="w-3.5 h-3.5" />,
  },
  {
    id: '৯০ দশকের কষ্ট',
    label: '৯০ দশকের কষ্ট',
    sublabel: 'ব্যান্ড নস্টালজিয়া',
    icon: <HeartCrack className="w-3.5 h-3.5" />,
  },
  {
    id: 'শুক্রবারের আড্ডা',
    label: 'শুক্রবারের আড্ডা',
    sublabel: 'আরামদায়ক বিকেল',
    icon: <Users className="w-3.5 h-3.5" />,
  },
];

export const PlaylistRotations: React.FC<PlaylistRotationsProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  return (
    <div id="playlist-rotations-container" className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <h3 className="text-sm sm:text-base font-bold font-anek text-amber-200 tracking-wide uppercase">
            Rotations • গানের মেজাজ
          </h3>
        </div>
        <span className="text-xs text-stone-400 font-mono">
          {categoryCounts[selectedCategory] || 0} টি গান
        </span>
      </div>

      {/* Horizontal Scrollable Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {CATEGORY_ITEMS.map((item) => {
          const isSelected = selectedCategory === item.id;
          return (
            <button
              key={item.id}
              id={`rotation-pill-${item.id}`}
              onClick={() => onSelectCategory(item.id)}
              className={`group flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 cursor-pointer active:scale-95 ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-lg shadow-amber-900/50 border border-amber-300 scale-102'
                  : 'bg-[#220f06]/80 hover:bg-[#2d1408] text-stone-300 hover:text-amber-100 border border-amber-900/40 hover:border-amber-700/50'
              }`}
            >
              <span className={isSelected ? 'text-stone-950' : 'text-amber-400 group-hover:text-amber-300'}>
                {item.icon}
              </span>
              <span className="font-anek">{item.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                  isSelected
                    ? 'bg-stone-950/20 text-stone-950 font-bold'
                    : 'bg-black/40 text-stone-400'
                }`}
              >
                {categoryCounts[item.id] || 0}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
