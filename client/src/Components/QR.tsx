import { QRCodeSVG } from 'qrcode.react';

export const QR = ({ size, pdf, overrideURL }: { size: number, pdf?:boolean, overrideURL?:string }) => {
    const url = window.location.href;
    return <QRCodeSVG value={!pdf ? url : overrideURL as string} size={size} includeMargin={!pdf} />;
};
