declare module 'qrcode-react' {
  import { SVGProps } from 'react';

  export interface QRCodeSVGProps extends SVGProps<SVGSVGElement> {
    value: string;
    size?: number;
    bgColor?: string;
    fgColor?: string;
    level?: 'L' | 'M' | 'Q' | 'H';
    includeMargin?: boolean;
    imageSettings?: {
      src: string;
      height: number;
      width: number;
      excavate?: boolean;
    };
  }

  export const QRCodeSVG: React.FC<QRCodeSVGProps>;
  export const QRCodeCanvas: React.FC<QRCodeSVGProps>;
  export default QRCodeSVG;
}