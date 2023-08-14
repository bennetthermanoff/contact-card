export type VcardJson = {
    REV?: VcardEntry;
    FN?: VcardEntry;
    N?: VcardEntry;
    PHOTO?: VcardEntry;
    TEL?: VcardEntry;
    EMAIL?: VcardEntry;
    URL?: VcardEntry;
    ADR?: VcardEntry;
    ORG?: VcardEntry;
    TITLE?: VcardEntry;
    NOTE?: VcardEntry;
    BDAY?: VcardEntry;
    IMPP?: VcardEntry;
    //More of these entries can be added, idk what every vcard entry is
  };
  export type VcardEntry = {
    value: string;
    type: string;
  };