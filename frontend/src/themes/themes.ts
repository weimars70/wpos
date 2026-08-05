export interface WposTheme {
  id: string;
  name: string;
  category: 'business' | 'fashion' | 'vibrant' | 'dark' | 'minimal';
  primary: string;
  secondary: string;
  accent: string;
  positive: string;
  negative: string;
  warning: string;
  info: string;
  dark?: boolean;
}

export const WPOS_THEMES: WposTheme[] = [
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    category: 'business',
    primary: '#1E3A8A',
    secondary: '#3B82F6',
    accent: '#06B6D4',
    positive: '#10B981',
    negative: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6'
  },
  {
    id: 'midnight',
    name: 'Midnight',
    category: 'dark',
    primary: '#0F172A',
    secondary: '#334155',
    accent: '#6366F1',
    positive: '#10B981',
    negative: '#F43F5E',
    warning: '#F59E0B',
    info: '#38BDF8',
    dark: true
  },
  {
    id: 'luxury-gold',
    name: 'Luxury Gold',
    category: 'fashion',
    primary: '#1C1917',
    secondary: '#D97706',
    accent: '#F59E0B',
    positive: '#059669',
    negative: '#DC2626',
    warning: '#F59E0B',
    info: '#2563EB'
  },
  {
    id: 'fashion-black',
    name: 'Fashion Black',
    category: 'fashion',
    primary: '#18181B',
    secondary: '#71717A',
    accent: '#EC4899',
    positive: '#10B981',
    negative: '#EF4444',
    warning: '#F59E0B',
    info: '#06B6D4'
  },
  {
    id: 'sneaker',
    name: 'Sneaker',
    category: 'vibrant',
    primary: '#DC2626',
    secondary: '#1F2937',
    accent: '#F97316',
    positive: '#10B981',
    negative: '#B91C1C',
    warning: '#F59E0B',
    info: '#2563EB'
  },
  {
    id: 'boutique',
    name: 'Boutique',
    category: 'fashion',
    primary: '#BE185D',
    secondary: '#F472B6',
    accent: '#F43F5E',
    positive: '#10B981',
    negative: '#E11D48',
    warning: '#F59E0B',
    info: '#8B5CF6'
  },
  {
    id: 'ocean',
    name: 'Ocean',
    category: 'vibrant',
    primary: '#0288D1',
    secondary: '#00BCD4',
    accent: '#00E5FF',
    positive: '#00E676',
    negative: '#FF1744',
    warning: '#FFC400',
    info: '#29B6F6'
  },
  {
    id: 'forest',
    name: 'Forest',
    category: 'business',
    primary: '#14532D',
    secondary: '#16A34A',
    accent: '#84CC16',
    positive: '#22C55E',
    negative: '#EF4444',
    warning: '#EAB308',
    info: '#06B6D4'
  },
  {
    id: 'sunset',
    name: 'Sunset',
    category: 'vibrant',
    primary: '#C2410C',
    secondary: '#F97316',
    accent: '#FBBF24',
    positive: '#10B981',
    negative: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6'
  },
  {
    id: 'sapphire',
    name: 'Sapphire',
    category: 'business',
    primary: '#1D4ED8',
    secondary: '#60A5FA',
    accent: '#38BDF8',
    positive: '#10B981',
    negative: '#EF4444',
    warning: '#F59E0B',
    info: '#0288D1'
  },
  {
    id: 'emerald',
    name: 'Emerald',
    category: 'business',
    primary: '#047857',
    secondary: '#34D399',
    accent: '#10B981',
    positive: '#059669',
    negative: '#E11D48',
    warning: '#F59E0B',
    info: '#0288D1'
  },
  {
    id: 'ruby',
    name: 'Ruby',
    category: 'vibrant',
    primary: '#9F1239',
    secondary: '#FB7185',
    accent: '#E11D48',
    positive: '#10B981',
    negative: '#BE123C',
    warning: '#F59E0B',
    info: '#3B82F6'
  },
  {
    id: 'coffee',
    name: 'Coffee',
    category: 'minimal',
    primary: '#78350F',
    secondary: '#B45309',
    accent: '#D97706',
    positive: '#059669',
    negative: '#DC2626',
    warning: '#F59E0B',
    info: '#2563EB'
  },
  {
    id: 'wine',
    name: 'Wine',
    category: 'fashion',
    primary: '#581C87',
    secondary: '#A855F7',
    accent: '#E879F9',
    positive: '#10B981',
    negative: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6'
  },
  {
    id: 'arctic',
    name: 'Arctic',
    category: 'vibrant',
    primary: '#0891B2',
    secondary: '#22D3EE',
    accent: '#67E8F9',
    positive: '#10B981',
    negative: '#EF4444',
    warning: '#F59E0B',
    info: '#0288D1'
  },
  {
    id: 'neon',
    name: 'Neon',
    category: 'vibrant',
    primary: '#7C3AED',
    secondary: '#06B6D4',
    accent: '#F43F5E',
    positive: '#10B981',
    negative: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6'
  },
  {
    id: 'apple',
    name: 'Apple',
    category: 'minimal',
    primary: '#111827',
    secondary: '#6B7280',
    accent: '#0070F3',
    positive: '#34C759',
    negative: '#FF3B30',
    warning: '#FF9500',
    info: '#5856D6'
  },
  {
    id: 'shopify',
    name: 'Shopify',
    category: 'business',
    primary: '#008060',
    secondary: '#5C6AC4',
    accent: '#47C1BF',
    positive: '#50B83C',
    negative: '#DE3618',
    warning: '#EEC200',
    info: '#007ACE'
  },
  {
    id: 'carbon',
    name: 'Carbon',
    category: 'dark',
    primary: '#262626',
    secondary: '#525252',
    accent: '#0284C7',
    positive: '#16A34A',
    negative: '#DC2626',
    warning: '#CA8A04',
    info: '#0284C7',
    dark: true
  },
  {
    id: 'business',
    name: 'Business',
    category: 'business',
    primary: '#2563EB',
    secondary: '#475569',
    accent: '#0D9488',
    positive: '#16A34A',
    negative: '#DC2626',
    warning: '#D97706',
    info: '#2563EB'
  },
  {
    id: 'graphite',
    name: 'Graphite',
    category: 'minimal',
    primary: '#374151',
    secondary: '#9CA3AF',
    accent: '#6366F1',
    positive: '#10B981',
    negative: '#EF4444',
    warning: '#F59E0B',
    info: '#38BDF8'
  },
  {
    id: 'lavender',
    name: 'Lavender',
    category: 'fashion',
    primary: '#6D28D9',
    secondary: '#A78BFA',
    accent: '#F472B6',
    positive: '#10B981',
    negative: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6'
  },
  {
    id: 'royal',
    name: 'Royal',
    category: 'fashion',
    primary: '#4338CA',
    secondary: '#818CF8',
    accent: '#C084FC',
    positive: '#10B981',
    negative: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6'
  },
  {
    id: 'gold',
    name: 'Gold',
    category: 'vibrant',
    primary: '#B45309',
    secondary: '#FBBF24',
    accent: '#F59E0B',
    positive: '#10B981',
    negative: '#EF4444',
    warning: '#F59E0B',
    info: '#2563EB'
  },
  {
    id: 'aqua',
    name: 'Aqua',
    category: 'vibrant',
    primary: '#0D9488',
    secondary: '#2DD4BF',
    accent: '#38BDF8',
    positive: '#10B981',
    negative: '#EF4444',
    warning: '#F59E0B',
    info: '#0288D1'
  }
];
