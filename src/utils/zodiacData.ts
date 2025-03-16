
export interface ZodiacSign {
  name: string;
  symbol: string;
  element: string;
  planet: string;
  dateRange: string;
  traits: string[];
  color: string;
  symbolImage: string;
  description: string;
  dailyHoroscope: string;
  compatibility: string[];
}

export const zodiacSigns: ZodiacSign[] = [
  {
    name: "Aries",
    symbol: "♈",
    element: "Fire",
    planet: "Mars",
    dateRange: "March 21 - April 19",
    traits: ["Confident", "Determined", "Enthusiastic", "Passionate", "Impulsive"],
    color: "rgb(255, 75, 75)",
    symbolImage: "/zodiac/aries.png",
    description: "Aries is the first sign of the zodiac, and those born under this sign are known for their pioneering spirit. Bold and ambitious, Aries dives headfirst into even the most challenging situations.",
    dailyHoroscope: "Today is a day for initiating new projects or ideas. Your energy levels are high, and your determination is unstoppable. Trust your instincts, but be careful not to come across as too aggressive in group settings.",
    compatibility: ["Leo", "Sagittarius", "Gemini", "Aquarius"],
  },
  {
    name: "Taurus",
    symbol: "♉",
    element: "Earth",
    planet: "Venus",
    dateRange: "April 20 - May 20",
    traits: ["Reliable", "Patient", "Practical", "Devoted", "Stubborn"],
    color: "rgb(76, 187, 23)",
    symbolImage: "/zodiac/taurus.png",
    description: "Taurus is known for their strong determination and practicality. Those born under this sign value stability and are often recognized for their loyalty and dependability.",
    dailyHoroscope: "Financial matters take center stage today. Your practical approach will serve you well in making important decisions. Take time to appreciate the simple pleasures in life, and don't rush into commitments.",
    compatibility: ["Virgo", "Capricorn", "Cancer", "Pisces"],
  },
  {
    name: "Gemini",
    symbol: "♊",
    element: "Air",
    planet: "Mercury",
    dateRange: "May 21 - June 20",
    traits: ["Adaptable", "Outgoing", "Intelligent", "Curious", "Inconsistent"],
    color: "rgb(255, 233, 0)",
    symbolImage: "/zodiac/gemini.png",
    description: "Gemini is represented by the twins, symbolizing duality. Those born under this sign are adaptable, outgoing, and intellectually curious, with a remarkable ability to communicate.",
    dailyHoroscope: "Communication flows effortlessly for you today. It's an excellent time for networking or having meaningful conversations. Your quick wit will help you navigate social situations with ease.",
    compatibility: ["Libra", "Aquarius", "Aries", "Leo"],
  },
  {
    name: "Cancer",
    symbol: "♋",
    element: "Water",
    planet: "Moon",
    dateRange: "June 21 - July 22",
    traits: ["Intuitive", "Emotional", "Protective", "Nurturing", "Moody"],
    color: "rgb(160, 160, 160)",
    symbolImage: "/zodiac/cancer.png",
    description: "Cancer is deeply intuitive and sentimental. Those born under this sign place a high value on family and home, creating a secure and nurturing environment for themselves and loved ones.",
    dailyHoroscope: "Emotional intuition is your guide today. You may feel more sensitive than usual, so create boundaries when necessary. Focus on self-care and nurturing the connections that truly matter to you.",
    compatibility: ["Scorpio", "Pisces", "Taurus", "Virgo"],
  },
  {
    name: "Leo",
    symbol: "♌",
    element: "Fire",
    planet: "Sun",
    dateRange: "July 23 - August 22",
    traits: ["Creative", "Passionate", "Generous", "Warm-hearted", "Dramatic"],
    color: "rgb(255, 152, 0)",
    symbolImage: "/zodiac/leo.png",
    description: "Leo is represented by the lion, and those born under this sign are known for their natural leadership and royal-like presence. They have a flair for drama and creativity.",
    dailyHoroscope: "Your creativity is at a peak today, making it ideal for artistic pursuits or innovative thinking at work. Your natural charisma draws people to you, but remember to let others shine too.",
    compatibility: ["Aries", "Sagittarius", "Gemini", "Libra"],
  },
  {
    name: "Virgo",
    symbol: "♍",
    element: "Earth",
    planet: "Mercury",
    dateRange: "August 23 - September 22",
    traits: ["Analytical", "Practical", "Hardworking", "Detail-oriented", "Critical"],
    color: "rgb(27, 94, 32)",
    symbolImage: "/zodiac/virgo.png",
    description: "Virgo is known for their attention to detail and practical approach to life. Those born under this sign are logical, precise, and have a deep sense of humanity.",
    dailyHoroscope: "Your analytical skills are especially sharp today. It's a good time to problem-solve or organize. Don't be too critical of yourself or others—perfection isn't always attainable.",
    compatibility: ["Taurus", "Capricorn", "Cancer", "Scorpio"],
  },
  {
    name: "Libra",
    symbol: "♎",
    element: "Air",
    planet: "Venus",
    dateRange: "September 23 - October 22",
    traits: ["Diplomatic", "Fair-minded", "Social", "Harmonious", "Indecisive"],
    color: "rgb(156, 39, 176)",
    symbolImage: "/zodiac/libra.png",
    description: "Libra is represented by the scales, symbolizing balance and harmony. Those born under this sign are fair-minded, diplomatic, and seek balance in all areas of life.",
    dailyHoroscope: "Finding harmony in relationships is your focus today. You excel at mediating conflicts and creating peaceful environments. Take time to make decisions—rushing will only lead to imbalance.",
    compatibility: ["Gemini", "Aquarius", "Leo", "Sagittarius"],
  },
  {
    name: "Scorpio",
    symbol: "♏",
    element: "Water",
    planet: "Pluto, Mars",
    dateRange: "October 23 - November 21",
    traits: ["Resourceful", "Powerful", "Passionate", "Mysterious", "Intense"],
    color: "rgb(183, 28, 28)",
    symbolImage: "/zodiac/scorpio.png",
    description: "Scorpio is known for their intense passion and power. Those born under this sign are determined and decisive, researching until they discover the truth.",
    dailyHoroscope: "Your intuition runs deep today, helping you uncover hidden truths. It's a powerful time for transformation and letting go of what no longer serves you. Trust your instincts in all matters.",
    compatibility: ["Cancer", "Pisces", "Virgo", "Capricorn"],
  },
  {
    name: "Sagittarius",
    symbol: "♐",
    element: "Fire",
    planet: "Jupiter",
    dateRange: "November 22 - December 21",
    traits: ["Generous", "Idealistic", "Adventurous", "Optimistic", "Restless"],
    color: "rgb(21, 101, 192)",
    symbolImage: "/zodiac/sagittarius.png",
    description: "Sagittarius is represented by the archer, symbolizing their quest for knowledge and truth. Those born under this sign are curious, energetic, and have a philosophical outlook.",
    dailyHoroscope: "Adventure calls to you today. Your optimistic outlook brings opportunities for growth and exploration. Share your wisdom with others, but be tactful—not everyone appreciates brutal honesty.",
    compatibility: ["Aries", "Leo", "Libra", "Aquarius"],
  },
  {
    name: "Capricorn",
    symbol: "♑",
    element: "Earth",
    planet: "Saturn",
    dateRange: "December 22 - January 19",
    traits: ["Responsible", "Disciplined", "Self-controlled", "Practical", "Reserved"],
    color: "rgb(62, 39, 35)",
    symbolImage: "/zodiac/capricorn.png",
    description: "Capricorn is known for their ambition and disciplined approach to life. Those born under this sign are responsible, practical, and excel at managing time and resources.",
    dailyHoroscope: "Professional achievements are highlighted today. Your disciplined approach impresses those in positions of authority. Remember to balance work with personal time—your well-being matters too.",
    compatibility: ["Taurus", "Virgo", "Scorpio", "Pisces"],
  },
  {
    name: "Aquarius",
    symbol: "♒",
    element: "Air",
    planet: "Uranus, Saturn",
    dateRange: "January 20 - February 18",
    traits: ["Progressive", "Original", "Independent", "Humanitarian", "Detached"],
    color: "rgb(0, 176, 255)",
    symbolImage: "/zodiac/aquarius.png",
    description: "Aquarius is known for their progressive thinking and originality. Those born under this sign are visionaries, valuing freedom and independence in thought and action.",
    dailyHoroscope: "Innovative ideas flow freely today. Your unique perspective offers solutions others might miss. Connect with communities that share your humanitarian values and vision for the future.",
    compatibility: ["Gemini", "Libra", "Aries", "Sagittarius"],
  },
  {
    name: "Pisces",
    symbol: "♓",
    element: "Water",
    planet: "Neptune, Jupiter",
    dateRange: "February 19 - March 20",
    traits: ["Compassionate", "Artistic", "Intuitive", "Gentle", "Escapist"],
    color: "rgb(48, 63, 159)",
    symbolImage: "/zodiac/pisces.png",
    description: "Pisces is known for their compassion and artistic nature. Those born under this sign are gentle, wise, and in tune with their emotions and the feelings of others.",
    dailyHoroscope: "Your creative and spiritual energies are heightened today. Trust your intuition in all matters. Setting boundaries is important—your compassion is a strength, but don't let others take advantage of it.",
    compatibility: ["Cancer", "Scorpio", "Taurus", "Capricorn"],
  },
];

export function getZodiacSignByBirthday(month: number, day: number): ZodiacSign | null {
  // Month is 1-based (1 = January, 2 = February, etc.)
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return zodiacSigns[0]; // Aries
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return zodiacSigns[1]; // Taurus
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return zodiacSigns[2]; // Gemini
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return zodiacSigns[3]; // Cancer
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return zodiacSigns[4]; // Leo
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return zodiacSigns[5]; // Virgo
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return zodiacSigns[6]; // Libra
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return zodiacSigns[7]; // Scorpio
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return zodiacSigns[8]; // Sagittarius
  } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return zodiacSigns[9]; // Capricorn
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return zodiacSigns[10]; // Aquarius
  } else {
    return zodiacSigns[11]; // Pisces
  }
}

export function getRandomHoroscope(sign: string): string {
  const horoscopes = [
    `Today brings a fresh perspective on a longstanding issue, ${sign}. Trust your intuition when making important decisions.`,
    `Your creative energy is at a peak right now, ${sign}. Channel it into projects that inspire you and others.`,
    `Connections with others take center stage today, ${sign}. A meaningful conversation could lead to unexpected opportunities.`,
    `Take time for self-reflection today, ${sign}. The answers you seek are already within you.`,
    `Financial matters come into focus, ${sign}. Your practical approach will help you make sound decisions.`,
    `Your natural charisma is especially magnetic today, ${sign}. Use it to bring people together for a common cause.`,
    `Balance is key today, ${sign}. Make sure to nourish both your physical and emotional well-being.`,
    `An unexpected message may change your plans, ${sign}. Stay flexible and see where the new path leads.`,
    `Your intellectual curiosity opens doors today, ${sign}. Pursue knowledge that expands your horizons.`,
    `Relationships require attention and care, ${sign}. Small gestures can strengthen important bonds.`,
  ];

  return horoscopes[Math.floor(Math.random() * horoscopes.length)];
}

export function generateWeeklyHoroscope(sign: string): string[] {
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  return weekdays.map(day => {
    return `${day}: ${getRandomHoroscope(sign)}`;
  });
}
