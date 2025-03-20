
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { validateDate } from '@/utils/dateUtils';

interface BirthDateFormProps {
  onSubmit: (day: string, month: string) => void;
  isLoading: boolean;
}

const BirthDateForm: React.FC<BirthDateFormProps> = ({ onSubmit, isLoading }) => {
  const [day, setDay] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    
    if (!day || !month) {
      setError('Please enter your birth day and month');
      return;
    }
    
    if (!validateDate(dayNum, monthNum)) {
      setError('Please enter a valid date');
      return;
    }
    
    localStorage.setItem('zodiac_birth_day', day);
    localStorage.setItem('zodiac_birth_month', month);
    
    onSubmit(day, month);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-white/70">Enter your birth date to discover your zodiac sign and personal horoscope.</p>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="month" className="block text-sm font-medium text-white/80 mb-1">
            Birth Month
          </label>
          <select
            id="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-zodiac-mystic-purple"
          >
            <option value="">Select Month</option>
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="day" className="block text-sm font-medium text-white/80 mb-1">
            Birth Day
          </label>
          <input
            id="day"
            type="number"
            min="1"
            max="31"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            placeholder="Day"
            className="w-full bg-white/10 border border-white/20 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-zodiac-mystic-purple"
          />
        </div>
      </div>
      
      {error && <p className="text-red-400 text-sm">{error}</p>}
      
      <Button 
        type="submit" 
        className="w-full bg-zodiac-mystic-purple hover:bg-zodiac-mystic-purple/80"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Reveal My Horoscope"}
      </Button>
    </form>
  );
};

export default BirthDateForm;
