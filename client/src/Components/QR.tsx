import { QRCodeSVG } from 'qrcode.react';

export const QR = ({ size }: { size: number }) => {
	const url = window.location.href;
	return <QRCodeSVG value={url} size={size} includeMargin={true} />;
};
