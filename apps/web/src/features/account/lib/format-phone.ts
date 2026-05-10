import { parsePhoneNumberFromString } from "libphonenumber-js/min";

export const formatPhoneForDisplay = (value: string) =>
  parsePhoneNumberFromString(value)?.formatInternational() ?? value;

export const normalizePhoneForInput = (value: string) =>
  parsePhoneNumberFromString(value, "US")?.number ?? value;
