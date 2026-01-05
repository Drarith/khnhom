import * as path from 'path';

// This file tells next-i18next where to find your translations
export const i18n = {
  locales: ['en', 'kh'],
  defaultLocale: 'en',
  localePath: path.resolve('./public/locales'),
};