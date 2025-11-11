import { Inter , Dancing_Script} from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', 
  display: 'swap',
  // weight: ['300', '400', '600', '700'],
});

export const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing-script', 
  display: 'swap',
  // weight: ['400', '500', '600', '700'],
});