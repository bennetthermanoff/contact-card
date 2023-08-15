import { VcardJson } from '../types/Vcard';
import { QR } from './QR';

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
					height={size}
				/>
			);
		} else {
			return null;
		}
	}
};
