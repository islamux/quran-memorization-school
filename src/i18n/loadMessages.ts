import enMessages from '@/messages/en.json';
import arMessages from '@/messages/ar.json';
import frMessages from '@/messages/fr.json';
import urMessages from '@/messages/ur.json';
import idMessages from '@/messages/id.json';
import { Locale } from './config';

const messages = {
  en: enMessages,
  ar: arMessages,
  fr: frMessages,
  ur: urMessages,
  id: idMessages
} as const;

export function getMessages(locale: Locale) {
  return messages[locale];
}
