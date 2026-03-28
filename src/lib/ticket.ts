import QRCode from "qrcode";

export async function generateQRCodeDataUrl(payload: string) {
  return QRCode.toDataURL(payload, {
    color: {
      dark: "#0f3d2e",
      light: "#f3e9d2"
    },
    margin: 1,
    width: 240
  });
}
