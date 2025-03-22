
import React, { useState } from 'react';
import { Calendar, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface DailyHoroscopeProps {
  horoscope: string | null;
  mood?: string;
}

const DailyHoroscope: React.FC<DailyHoroscopeProps> = ({ horoscope, mood }) => {
  const [isOpen, setIsOpen] = useState(false);
  
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
    <div className="bg-white/5 rounded-lg p-5">
      <div className="flex items-center gap-2 text-sm text-white/70 mb-4">
        <Calendar size={16} />
        <span>{formatDate(new Date())}</span>
        
        <div className="flex-1 flex justify-end">
          <Sparkles size={16} className="text-zodiac-stardust-gold mr-1" />
          <span className="text-zodiac-stardust-gold">Daily Cosmic Insights</span>
        </div>
      </div>
      
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-3">
        <div className="space-y-3">
          {previewParagraphs.map((paragraph, index) => (
            <p key={`preview-${index}`} className="text-white/90">{paragraph}</p>
          ))}
        </div>
        
        {hiddenParagraphs.length > 0 && (
          <>
            <CollapsibleContent className="space-y-3 mt-2">
              {hiddenParagraphs.map((paragraph, index) => (
                <p key={`hidden-${index}`} className="text-white/90">{paragraph}</p>
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
    </div>
  );
};

export default DailyHoroscope;
