/**
 * Indian festival calendar for ParentAssist.
 * Dates are approximate and shift each year by the Hindu/Sikh lunisolar calendar.
 * The app fetches authoritative dates from the backend; this file is for
 * static config and category metadata only.
 */

export type FestivalId =
  | 'diwali'
  | 'holi'
  | 'navratri'
  | 'dussehra'
  | 'ganesh_chaturthi'
  | 'raksha_bandhan'
  | 'janmashtami'
  | 'baisakhi'
  | 'eid_al_fitr'
  | 'eid_al_adha'
  | 'christmas'
  | 'new_year'
  | 'pongal'
  | 'onam'
  | 'ugadi';

export interface FestivalMeta {
  id: FestivalId;
  name: string;
  emoji: string;
  primaryColor: string;   // hex — used for card gradient
  accentColor: string;    // hex
  approximate_month: number; // 1–12, for sorting when API unavailable
  description: string;
  tags: string[];
}

export const FESTIVALS: Record<FestivalId, FestivalMeta> = {
  diwali: {
    id: 'diwali',
    name: 'Diwali',
    emoji: '🪔',
    primaryColor: '#FF8200',
    accentColor: '#FFC940',
    approximate_month: 10,
    description: 'Festival of lights — sweets, diyas, fireworks and family.',
    tags: ['lights', 'sweets', 'family', 'prayer'],
  },
  holi: {
    id: 'holi',
    name: 'Holi',
    emoji: '🎨',
    primaryColor: '#E91E63',
    accentColor: '#FF9800',
    approximate_month: 3,
    description: 'Festival of colours — spring celebration of love and renewal.',
    tags: ['colours', 'spring', 'outdoor', 'family'],
  },
  navratri: {
    id: 'navratri',
    name: 'Navratri',
    emoji: '💃',
    primaryColor: '#9C27B0',
    accentColor: '#FF8200',
    approximate_month: 10,
    description: 'Nine nights of the goddess — garba, fasting, and colour dressing.',
    tags: ['dance', 'fasting', 'music', 'prayer'],
  },
  dussehra: {
    id: 'dussehra',
    name: 'Dussehra',
    emoji: '🏹',
    primaryColor: '#FF5722',
    accentColor: '#FFC107',
    approximate_month: 10,
    description: 'Triumph of good over evil — Ramlila, effigies, and celebration.',
    tags: ['mythology', 'crafts', 'storytelling'],
  },
  ganesh_chaturthi: {
    id: 'ganesh_chaturthi',
    name: 'Ganesh Chaturthi',
    emoji: '🐘',
    primaryColor: '#FF9800',
    accentColor: '#4CAF50',
    approximate_month: 8,
    description: 'Birthday of Lord Ganesha — modaks, processions, and prayer.',
    tags: ['sweets', 'crafts', 'prayer', 'family'],
  },
  raksha_bandhan: {
    id: 'raksha_bandhan',
    name: 'Raksha Bandhan',
    emoji: '🧵',
    primaryColor: '#E91E63',
    accentColor: '#FFC940',
    approximate_month: 8,
    description: 'Bond between siblings — rakhi tying and sweets.',
    tags: ['family', 'crafts', 'sweets', 'siblings'],
  },
  janmashtami: {
    id: 'janmashtami',
    name: 'Janmashtami',
    emoji: '🦚',
    primaryColor: '#3F51B5',
    accentColor: '#FFC940',
    approximate_month: 8,
    description: "Krishna's birthday — fasting, bhajans, dahi handi.",
    tags: ['devotion', 'fasting', 'music', 'storytelling'],
  },
  baisakhi: {
    id: 'baisakhi',
    name: 'Baisakhi',
    emoji: '🌾',
    primaryColor: '#FFEB3B',
    accentColor: '#FF9800',
    approximate_month: 4,
    description: 'Punjabi harvest festival — bhangra, langar, and gratitude.',
    tags: ['harvest', 'dance', 'food', 'community'],
  },
  eid_al_fitr: {
    id: 'eid_al_fitr',
    name: 'Eid al-Fitr',
    emoji: '🌙',
    primaryColor: '#4CAF50',
    accentColor: '#FFC940',
    approximate_month: 4,
    description: 'End of Ramadan — feasting, gifts, and family visits.',
    tags: ['prayer', 'food', 'family', 'gifts'],
  },
  eid_al_adha: {
    id: 'eid_al_adha',
    name: 'Eid al-Adha',
    emoji: '🕌',
    primaryColor: '#009688',
    accentColor: '#FFC940',
    approximate_month: 6,
    description: 'Festival of sacrifice — prayer, feasting, charity.',
    tags: ['prayer', 'family', 'charity', 'food'],
  },
  christmas: {
    id: 'christmas',
    name: 'Christmas',
    emoji: '🎄',
    primaryColor: '#C62828',
    accentColor: '#388E3C',
    approximate_month: 12,
    description: 'Celebrated by many Indian families — carols, gifts, and cake.',
    tags: ['family', 'gifts', 'crafts', 'baking'],
  },
  new_year: {
    id: 'new_year',
    name: "New Year's Day",
    emoji: '🎆',
    primaryColor: '#1A237E',
    accentColor: '#FFC940',
    approximate_month: 1,
    description: 'Rang in with fireworks, resolutions, and family gatherings.',
    tags: ['family', 'celebration', 'reflection'],
  },
  pongal: {
    id: 'pongal',
    name: 'Pongal',
    emoji: '🍚',
    primaryColor: '#FF8F00',
    accentColor: '#4CAF50',
    approximate_month: 1,
    description: 'South Indian harvest festival — sweet rice, kolam, and gratitude.',
    tags: ['harvest', 'cooking', 'family', 'south-indian'],
  },
  onam: {
    id: 'onam',
    name: 'Onam',
    emoji: '🌸',
    primaryColor: '#FF9800',
    accentColor: '#4CAF50',
    approximate_month: 8,
    description: 'Kerala harvest festival — sadya feast, pookalam flower art, boat races.',
    tags: ['harvest', 'cooking', 'art', 'kerala'],
  },
  ugadi: {
    id: 'ugadi',
    name: 'Ugadi',
    emoji: '🥭',
    primaryColor: '#8BC34A',
    accentColor: '#FF9800',
    approximate_month: 3,
    description: 'Telugu/Kannada New Year — pachadi (six-taste chutney) and new beginnings.',
    tags: ['new-year', 'cooking', 'south-indian'],
  },
};

export const FESTIVAL_IDS = Object.keys(FESTIVALS) as FestivalId[];
