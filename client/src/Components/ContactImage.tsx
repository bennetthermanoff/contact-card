import { VcardJson } from '../types/Vcard';
import { QR } from './QR';
import tempImage from '../assets/circle-help.png';

export const ContactImage = ({
    contact,
    isQrDisplayed,
    size,
    pdf,
    id,
    eventIcon
}: {
  contact: VcardJson;
  isQrDisplayed: boolean;
  size: number;
  pdf?: boolean;
  id?:string;
  eventIcon?:string;
}) => {
    if (isQrDisplayed) {
        return <QR size={size} pdf={pdf} overrideURL={!pdf ? undefined : 'https://contacts.hermanoff.dev/contact/' + id} />;
    } else {
        if (contact.PHOTO) {
            return (
                <img
                    src={`data:image/png;base64,${contact.PHOTO?.value }`}
                    alt="profile"
                    width={size}

                />
            );
        } else if (eventIcon){
            return (
                <img
                    src={eventIcon}
                    alt="profile"
                    height={size}
                />
            );
        } 
        else {
            return (<img src={tempImage} alt="profile" height={size} />);
        }
    }
};
