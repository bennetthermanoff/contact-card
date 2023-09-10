import { QRCodeSVG } from 'qrcode.react';

export const QR = ({ size, pdf }: { size: number, pdf?:boolean }) => {
    const url = window.location.href;
    return <QRCodeSVG value={url} size={size} includeMargin={!pdf} />;
};
