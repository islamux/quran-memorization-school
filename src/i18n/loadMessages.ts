import enMessages from '@/messages/en.json';
import arMessages from '@/messages/ar.json';
import { Locale } from './config';

const messages = {
  en: enMessages,
  ar: arMessages
} as const;

export function getMessages(locale: Locale) {
  return messages[locale];
}
