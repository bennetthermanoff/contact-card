export type VcardJson = {
  REV?: VcardEntry;
  FN?: VcardEntry;
  N?: VcardEntry;
  PHOTO?: {
    value: string;
    type: string;
  };
  TEL?: VcardEntry;
  EMAIL?: VcardEntry;
  URL?: VcardEntry;
  ADR?: VcardEntry;
  ORG?: VcardEntry;
  TITLE?: VcardEntry;
  NOTE?: VcardEntry;
  BDAY?: VcardEntry;
  IMPP?: VcardEntry;
  'X-PHONETIC-FIRST-NAME'?: VcardEntry;
  'X-PHONETIC-LAST-NAME'?: VcardEntry;
  //More of these entries can be added, idk what every vcard entry is
};
export type VcardEntry = VcardEntryTypeValue | string;

export type VcardEntryTypeValue = {
  value: string;
  type: string;
};

export const getEntry = (json: VcardJson, entry: keyof VcardJson) => {
    if (json[entry]) {
        if (typeof json[entry] === 'string') {
            return json[entry];
        } else {
            return (json[entry] as VcardEntryTypeValue)?.value;
        }
    } else {
        return '';
    }
};
