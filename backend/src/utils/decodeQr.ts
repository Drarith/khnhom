import jsQR from "jsqr";
import Jimp from "jimp";
import { getErrorMessage } from "./getErrorMessage.js";

/**
 * Fetches an image from a URL, decodes the QR code within it,
 * and returns the data encoded in the QR code.
 *
 * @param imageUrl The URL of the image containing the QR code.
 * @returns A promise that resolves with the decoded URL string.
 * @throws An error if the image cannot be fetched, is not a valid image,
 *         or does not contain a readable QR code.
 */
export const decodeQrCodeFromUrl = async (
  imageUrl: string
): Promise<string> => {
  try {
    // Fetch the image and get its buffer
    const image = await Jimp.read(imageUrl);
    const imageBuffer = await new Promise<Buffer>((resolve, reject) =>
      image.getBuffer(Jimp.MIME_PNG, (err, buffer) => (err ? reject(err) : resolve(buffer)))
    );

    // Read the image data for QR decoding
    const jimpImage = await Jimp.read(imageBuffer);
    const { data, width, height } = jimpImage.bitmap;

    // Use jsQR to find and decode the QR code
    const code = (jsQR as any)(data, width, height);

    if (code) {
      return code.data; // This is the URL hidden in the QR code
    } else {
      throw new Error("No QR code found in the provided image.");
    }
  } catch (error) {
    // Re-throw a more specific error
    throw new Error(
      `Failed to decode QR code: ${getErrorMessage(error)}`
    );
  }
};