import { VcardJson } from '../types/Vcard';
import { QR } from './QR';
import tempImage from '../assets/tempImage.jpg';

export const ContactImage = ({
    contact,
    isQrDisplayed,
    size,
}: {
  contact: VcardJson;
  isQrDisplayed: boolean;
  size: number;
}) => {
    if (isQrDisplayed) {
        return <QR size={size} />;
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
