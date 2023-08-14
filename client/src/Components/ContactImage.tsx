import { VcardJson } from "../types/Vcard";

export const ContactImage = ({contact}: {contact: VcardJson}) => {
    if (contact.PHOTO) {
      return (
        <img
          src={`data:image/png;base64,${contact.PHOTO.value}`}
          alt="profile"
          width="100"
          height="100"
        />
      );
    }
    else {return null;}
  };