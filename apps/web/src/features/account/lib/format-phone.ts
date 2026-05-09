import { parsePhoneNumberFromString } from "libphonenumber-js/min";

export const formatPhoneForDisplay = (value: string) =>
  parsePhoneNumberFromString(value)?.formatInternational() ?? value;
