
import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles, ChevronDown, ChevronUp, Moon, Sun, Star } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface DailyHoroscopeProps {
  horoscope: string | null;
  mood?: string;
}

// Different horoscope format templates
const horoscopeFormats = [
  // Format 1: Classic with gold accents
  {
    containerClasses: "bg-white/5 rounded-lg p-5",
    headerClasses: "flex items-center gap-2 text-sm text-white/70 mb-4",
    titleClasses: "text-zodiac-stardust-gold flex items-center",
    titleIcon: <Sparkles size={16} className="text-zodiac-stardust-gold mr-1" />,
    titleText: "Daily Cosmic Insights",
    contentClasses: "space-y-3",
    paragraphClasses: "text-white/90",
  },
  // Format 2: Modern with purple glow
  {
    containerClasses: "bg-zodiac-twilight-purple/20 rounded-lg p-5 shadow-[0_0_15px_rgba(103,58,183,0.2)]",
    headerClasses: "flex items-center gap-2 text-sm text-white/70 mb-4",
    titleClasses: "text-zodiac-mystic-purple flex items-center",
    titleIcon: <Star size={16} className="text-zodiac-mystic-purple mr-1" />,
    titleText: "Celestial Guidance",
    contentClasses: "space-y-3",
    paragraphClasses: "text-white/90",
  },
  // Format 3: Minimalist with border
  {
    containerClasses: "bg-transparent border border-white/20 rounded-lg p-5",
    headerClasses: "flex items-center gap-2 text-sm text-white/70 mb-4",
    titleClasses: "text-white/90 flex items-center",
    titleIcon: <Moon size={16} className="text-white/90 mr-1" />,
    titleText: "Astral Whispers",
    contentClasses: "space-y-3",
    paragraphClasses: "text-white/80",
  },
  // Format 4: Card with top accent
  {
    containerClasses: "bg-white/5 rounded-lg p-5 border-t-4 border-zodiac-celestial-blue",
    headerClasses: "flex items-center gap-2 text-sm text-white/70 mb-4",
    titleClasses: "text-zodiac-celestial-blue flex items-center",
    titleIcon: <Sun size={16} className="text-zodiac-celestial-blue mr-1" />,
    titleText: "Daily Stellar Forecast",
    contentClasses: "space-y-3",
    paragraphClasses: "text-white/90",
  },
  // Format 5: Dark with gradient border
  {
    containerClasses: "bg-zodiac-deep-blue/70 rounded-lg p-5 border border-[#6366f1] border-opacity-50 shadow-[0_0_15px_rgba(99,102,241,0.2)]",
    headerClasses: "flex items-center gap-2 text-sm text-white/70 mb-4",
    titleClasses: "text-[#6366f1] flex items-center",
    titleIcon: <Sparkles size={16} className="text-[#6366f1] mr-1" />,
    titleText: "Cosmic Revelations",
    contentClasses: "space-y-3",
    paragraphClasses: "text-white/90",
  },
  // Format 6: Elegant with golden border
  {
    containerClasses: "bg-[#1a1a2e]/50 rounded-lg p-5 border border-zodiac-stardust-gold/30",
    headerClasses: "flex items-center gap-2 text-sm text-white/70 mb-4",
    titleClasses: "text-zodiac-stardust-gold flex items-center",
    titleIcon: <Star size={16} className="text-zodiac-stardust-gold mr-1" />,
    titleText: "Mystic Guidance",
    contentClasses: "space-y-3",
    paragraphClasses: "text-white/90",
  },
  // Format 7: Nebula-inspired
  {
    containerClasses: "bg-[#2e1065]/50 rounded-lg p-5 shadow-[0_0_15px_rgba(139,92,246,0.15)]",
    headerClasses: "flex items-center gap-2 text-sm text-white/70 mb-4",
    titleClasses: "text-[#d8b4fe] flex items-center",
    titleIcon: <Moon size={16} className="text-[#d8b4fe] mr-1" />,
    titleText: "Nebula Insights",
    contentClasses: "space-y-3",
    paragraphClasses: "text-white/90",
  },
  // Format 8: Cosmic with top and bottom borders
  {
    containerClasses: "bg-white/5 rounded-lg p-5 border-t-2 border-b-2 border-[#38bdf8]",
    headerClasses: "flex items-center gap-2 text-sm text-white/70 mb-4",
    titleClasses: "text-[#38bdf8] flex items-center",
    titleIcon: <Sparkles size={16} className="text-[#38bdf8] mr-1" />,
    titleText: "Celestial Currents",
    contentClasses: "space-y-3",
    paragraphClasses: "text-white/90",
  },
  // Format 9: Constellation style
  {
    containerClasses: "bg-[#0f172a]/80 rounded-lg p-5 border border-white/10",
    headerClasses: "flex items-center gap-2 text-sm text-white/70 mb-4",
    titleClasses: "text-[#93c5fd] flex items-center",
    titleIcon: <Star size={16} className="text-[#93c5fd] mr-1" />,
    titleText: "Star Alignment",
    contentClasses: "space-y-3",
    paragraphClasses: "text-white/90",
  },
  // Format 10: Ethereal glow
  {
    containerClasses: "bg-gradient-to-r from-[#0f172a]/80 to-[#1e293b]/80 rounded-lg p-5 shadow-[0_0_20px_rgba(255,255,255,0.05)]",
    headerClasses: "flex items-center gap-2 text-sm text-white/70 mb-4",
    titleClasses: "text-[#e2e8f0] flex items-center",
    titleIcon: <Sun size={16} className="text-[#e2e8f0] mr-1" />,
    titleText: "Ethereal Guidance",
    contentClasses: "space-y-3",
    paragraphClasses: "text-white/90",
  },
  // Format 11: Crystal ball style
  {
    containerClasses: "bg-[#312e81]/40 rounded-lg p-5 border border-[#a5b4fc]/30",
    headerClasses: "flex items-center gap-2 text-sm text-white/70 mb-4",
    titleClasses: "text-[#a5b4fc] flex items-center",
    titleIcon: <Sparkles size={16} className="text-[#a5b4fc] mr-1" />,
    titleText: "Crystal Visions",
    contentClasses: "space-y-3",
    paragraphClasses: "text-white/90",
  },
  // Format 12: Cosmic dark
  {
    containerClasses: "bg-black/30 rounded-lg p-5 border border-zodiac-nebula-pink/30",
    headerClasses: "flex items-center gap-2 text-sm text-white/70 mb-4",
    titleClasses: "text-zodiac-nebula-pink flex items-center",
    titleIcon: <Moon size={16} className="text-zodiac-nebula-pink mr-1" />,
    titleText: "Astral Prophecy",
    contentClasses: "space-y-3",
    paragraphClasses: "text-white/90",
  },
];

const DailyHoroscope: React.FC<DailyHoroscopeProps> = ({ horoscope, mood }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formatIndex, setFormatIndex] = useState(0);
  
  // Choose a semi-random format based on the day of month, but allow user to toggle
  useEffect(() => {
    const day = new Date().getDate();
    setFormatIndex(day % horoscopeFormats.length);
  }, []);
  
  const format = horoscopeFormats[formatIndex];
  
  if (!horoscope) {
    return (
      <div className="bg-white/5 rounded-lg p-4">
        <div className="flex items-center gap-2 text-sm text-white/70 mb-4">
          <Calendar size={16} />
          <span>{formatDate(new Date())}</span>
          
          <div className="flex-1 flex justify-end">
            <Sparkles size={16} className="text-zodiac-stardust-gold mr-1" />
            <span className="text-zodiac-stardust-gold">Daily Cosmic Insights</span>
          </div>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-white/5 rounded-md w-3/4"></div>
          <div className="h-4 bg-white/5 rounded-md w-full"></div>
          <div className="h-4 bg-white/5 rounded-md w-5/6"></div>
          <div className="h-4 bg-white/5 rounded-md w-4/5"></div>
          <div className="h-4 bg-white/5 rounded-md w-3/4"></div>
        </div>
      </div>
    );
  }
  
  // Split the horoscope into multiple paragraphs to improve readability
  // Make paragraphs smaller for better reading experience
  const paragraphs = horoscope.match(/(.{1,100})(?:\s|$)/g) || [];
  
  // For the preview, only show first half of paragraphs, or max 2
  const previewParagraphs = paragraphs.slice(0, Math.min(2, Math.ceil(paragraphs.length / 2)));
  const hiddenParagraphs = paragraphs.slice(previewParagraphs.length);
  
  return (
    <div className={format.containerClasses}>
      <div className={format.headerClasses}>
        <Calendar size={16} />
        <span>{formatDate(new Date())}</span>
        
        <div className="flex-1 flex justify-end">
          {format.titleIcon}
          <span className={format.titleClasses}>{format.titleText}</span>
        </div>
      </div>
      
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className={format.contentClasses}>
        <div className="space-y-3">
          {previewParagraphs.map((paragraph, index) => (
            <p key={`preview-${index}`} className={format.paragraphClasses}>{paragraph}</p>
          ))}
        </div>
        
        {hiddenParagraphs.length > 0 && (
          <>
            <CollapsibleContent className="space-y-3 mt-2">
              {hiddenParagraphs.map((paragraph, index) => (
                <p key={`hidden-${index}`} className={format.paragraphClasses}>{paragraph}</p>
              ))}
            </CollapsibleContent>
            
            <CollapsibleTrigger asChild>
              <button 
                className="flex items-center gap-1 text-sm text-zodiac-stardust-gold mt-2 hover:text-zodiac-stardust-gold/80 transition-colors"
              >
                {isOpen ? (
                  <>
                    <ChevronUp size={16} />
                    <span>See Less</span>
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} />
                    <span>See More</span>
                  </>
                )}
              </button>
            </CollapsibleTrigger>
          </>
        )}
      </Collapsible>
      
      {mood && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="text-white/70">Today's Mood:</span>
          <span className="bg-zodiac-mystic-purple/30 text-white px-3 py-1 rounded-full text-sm">
            {mood}
          </span>
        </div>
      )}
      
      <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
        <button 
          onClick={() => setFormatIndex((prev) => (prev + 1) % horoscopeFormats.length)}
          className="text-xs text-white/50 hover:text-white/70 transition-colors"
        >
          Change style
        </button>
      </div>
    </div>
  );
};

export default DailyHoroscope;
