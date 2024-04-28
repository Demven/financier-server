export enum Language {
  ENGLISH = 'en',
}
const LANGUAGES = [Language.ENGLISH];

export enum CurrencyType {
  US_DOLLAR = 'USD',
  EURO = 'EUR',
  JAPANESE_YEN = 'JPU',
  POUND_STERLING = 'GPB',
  AUSTRALIAN_DOLLAR = 'AUD',
  CANADIAN_DOLLAR = 'CAD',
  SWISS_FRANC = 'CHF',
}
const CURRENCY_TYPES = [
  CurrencyType.US_DOLLAR,
  CurrencyType.EURO,
  CurrencyType.JAPANESE_YEN,
  CurrencyType.POUND_STERLING,
  CurrencyType.AUSTRALIAN_DOLLAR,
  CurrencyType.CANADIAN_DOLLAR,
  CurrencyType.SWISS_FRANC,
];

export enum CurrencySymbol {
  US_DOLLAR = '$',
  EURO = '€',
  JAPANESE_YEN = '¥',
  POUND_STERLING = '£',
  AUSTRALIAN_DOLLAR = '$',
  CANADIAN_DOLLAR = '$',
  SWISS_FRANC = '',
}
const CURRENCY_SYMBOLS = [
  CurrencySymbol.US_DOLLAR,
  CurrencySymbol.EURO,
  CurrencySymbol.JAPANESE_YEN,
  CurrencySymbol.POUND_STERLING,
  CurrencySymbol.AUSTRALIAN_DOLLAR,
  CurrencySymbol.CANADIAN_DOLLAR,
  CurrencySymbol.SWISS_FRANC,
];

export default interface Account {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  language: Language;
  currencyType: CurrencyType;
  currencySymbol: CurrencySymbol;
  createdAt: string;
  updatedAt: string;
}

export function validateAccount (account:Account):{ valid:boolean; error:string; } {
  const {
    firstName,
    lastName,
    email,
    language,
    currencyType,
    currencySymbol,
  } = account;

  let error = '';

  if (!firstName?.length) {
    error = '"firstName" is empty';
  }

  if (!lastName?.length) {
    error = '"lastName" is empty';
  }

  if (!email?.length) {
    error = '"email" is empty';
  } else if (email?.length < 6) {
    error = '"email" is too short';
  } else if (!email.includes('@')) {
    error = '"email" is invalid';
  }

  if (!language?.length || !LANGUAGES.includes(language)) {
    error = '"language" is invalid';
  }

  if (!currencyType?.length || !CURRENCY_TYPES.includes(currencyType)) {
    error = '"currencyType" is invalid';
  }

  if (!currencySymbol?.length || !CURRENCY_SYMBOLS.includes(currencySymbol)) {
    error = '"currencySymbol" is invalid';
  }

  return {
    valid: !error,
    error,
  };
}
