
import React from 'react';

interface SignCharacteristicsProps {
  sign: string;
}

const SignCharacteristics: React.FC<SignCharacteristicsProps> = ({ sign }) => {
  // Helper function to determine element based on zodiac sign
  const getElement = (sign: string): string => {
    if (["Aries", "Leo", "Sagittarius"].includes(sign)) {
      return "Fire";
    } else if (["Taurus", "Virgo", "Capricorn"].includes(sign)) {
      return "Earth";
    } else if (["Gemini", "Libra", "Aquarius"].includes(sign)) {
      return "Air";
    } else {
      return "Water";
    }
  };

  // Helper function to determine quality based on zodiac sign
  const getQuality = (sign: string): string => {
    if (["Aries", "Cancer", "Libra", "Capricorn"].includes(sign)) {
      return "Cardinal";
    } else if (["Taurus", "Leo", "Scorpio", "Aquarius"].includes(sign)) {
      return "Fixed";
    } else {
      return "Mutable";
    }
  };

  // Helper function to determine ruling planet based on zodiac sign
  const getRulingPlanet = (sign: string): string => {
    const rulingPlanets: Record<string, string> = {
      "Aries": "Mars",
      "Taurus": "Venus",
      "Gemini": "Mercury",
      "Cancer": "Moon",
      "Leo": "Sun",
      "Virgo": "Mercury",
      "Libra": "Venus",
      "Scorpio": "Pluto",
      "Sagittarius": "Jupiter",
      "Capricorn": "Saturn",
      "Aquarius": "Uranus",
      "Pisces": "Neptune"
    };
    
    return rulingPlanets[sign] || "Unknown";
  };

  return (
    <div className="bg-white/5 rounded-lg p-4">
      <h4 className="text-lg font-medium mb-3">Sign Characteristics</h4>
      
      <div className="space-y-2">
        <p className="text-sm"><strong>Element:</strong> {getElement(sign)}</p>
        <p className="text-sm"><strong>Quality:</strong> {getQuality(sign)}</p>
        <p className="text-sm"><strong>Ruling Planet:</strong> {getRulingPlanet(sign)}</p>
      </div>
    </div>
  );
};

export default SignCharacteristics;
