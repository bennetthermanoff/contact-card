import { VcardJson } from '../types/Vcard';
import { QR } from './QR';
import tempImage from '../assets/tempImage.jpg';

export const ContactImage = ({
    contact,
    isQrDisplayed,
    size,
    pdf
}: {
  contact: VcardJson;
  isQrDisplayed: boolean;
  size: number;
  pdf?: boolean;
}) => {
    if (isQrDisplayed) {
        return <QR size={size} pdf={pdf} />;
    } else {
        if (contact.PHOTO) {
            return (
                <img
                    src={`data:image/png;base64,${contact.PHOTO.value}`}
                    alt="profile"
                    width={size}

                />
            );
        } else {
            return (<img src={tempImage} alt="profile" height={size} />);
        }
    }
};
