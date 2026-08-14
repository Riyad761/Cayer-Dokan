import React from 'react';
import { Mail, ShieldCheck, Heart, Radio, ExternalLink } from 'lucide-react';

export const ProfileCredit: React.FC = () => {
  return (
    <section id="creator-credit-section" className="relative py-12 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="relative bg-gradient-to-b from-[#1f0d05]/95 via-[#180903]/95 to-[#120602]/95 border border-amber-800/35 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xl">
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left">
          {/* Creator Photo - Exact User Uploaded Image */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl p-1 bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-800 shadow-xl shrink-0 overflow-hidden">
            <img
              src="file_000000006c987207b2b5744c10bd640a.png"
              alt="Riyad Hasan"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-xl"
              onError={(e) => {
                // Fallback to /banner.jpg or root path if relative path differs
                const target = e.target as HTMLImageElement;
                if (!target.src.endsWith('/file_000000006c987207b2b5744c10bd640a.png')) {
                  target.src = '/file_000000006c987207b2b5744c10bd640a.png';
                }
              }}
            />
            <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-amber-500 border-2 border-stone-950 flex items-center justify-center text-stone-950 shadow-md">
              <Radio className="w-3 h-3" />
            </div>
          </div>

          {/* Name & Bio */}
          <div className="flex flex-col">
            <div className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-xs font-mono uppercase tracking-widest text-amber-400 mb-1">
              <span>CURATOR & CREATOR</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-anek text-amber-100 tracking-tight">
              Riyad Hasan
            </h3>
            <p className="text-sm text-stone-300 font-siliguri mt-1 max-w-lg leading-relaxed">
              নস্টালজিক বাংলা ব্যান্ড আর চায়ের টংয়ের সুর ভালোবাসেন এমন প্রতিটি সংগীতপ্রেমীর জন্য ভালোবাসা থেকে তৈরি <strong>buswala.online</strong>।
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4">
              <a
                href="mailto:trancetube.info@gmail.com?subject=Inquiry%20from%20buswala.online"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-950/80 hover:bg-amber-900 border border-amber-600/50 text-amber-200 text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-95 shadow-sm"
              >
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>trancetube.info@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Takedown Notice Box */}
        <div className="mt-8 pt-6 border-t border-amber-900/40">
          <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-amber-900/30 flex flex-col sm:flex-row items-start gap-3.5">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex flex-col text-xs sm:text-sm text-stone-400 font-siliguri leading-relaxed space-y-2">
              <p>
                <strong className="text-amber-200 font-anek">কপিরাইট ও স্বত্বাধিকার বিজ্ঞপ্তি:</strong>{' '}
                এখানে প্রচারিত সকল অডিও সরাসরি ইউটিউবের অফিশিয়াল <em>YouTube Embedded IFrame API</em> এর মাধ্যমে সম্প্রচারিত হয়। এই সার্ভারে কোনো ধরনের অডিও ফাইল হোস্ট বা সংরক্ষণ করা হয় না। সমস্ত গানের ট্রেডমার্ক, রয়্যালটি ও বৌদ্ধিক স্বত্ব সংশ্লিষ্ট মূল শিল্পী, গীতিকার, সুরকার ও রেকর্ড লেবেলের সংরক্ষিত।
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <span className="text-stone-300">যেকোনো আপত্তি বা কনটেন্ট অপসারণের অনুরোধের জন্য:</span>
                <a
                  id="takedown-request-link"
                  href="mailto:trancetube.info@gmail.com?subject=Takedown%20Request%20-%20buswala.online&body=Please%20specify%20the%20song%20title,%20artist,%20and%20YouTube%20link%20for%20removal."
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-800/40 text-xs font-semibold transition-colors"
                >
                  <Mail className="w-3 h-3" />
                  <span>Takedown Request (ইমেইল করুন)</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Copyright */}
        <div className="mt-8 text-center sm:flex sm:items-center sm:justify-between text-xs text-stone-500 font-siliguri pt-4 border-t border-amber-950/60">
          <p className="flex items-center justify-center sm:justify-start gap-1">
            <span>© {new Date().getFullYear()} buswala.online</span>
            <span>•</span>
            <span className="text-amber-400/80 font-anek">চায়ের দোকান রেডিও</span>
          </p>
          <p className="mt-2 sm:mt-0 flex items-center justify-center gap-1 text-[11px]">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            <span>for Bangla Music Lovers</span>
          </p>
        </div>
      </div>
    </section>
  );
};
