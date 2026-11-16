export function getImageUrl(imageurl: unknown): string | undefined {
  if (typeof imageurl !== "string" || !imageurl.trim()) {
    return undefined;
  }

  if (imageurl.startsWith("/asset")) {
    const baseUrl = (
      process.env.IMAGE_BASE_URL ||
      process.env.NEXT_PUBLIC_IMAGE_BASE_URL ||
      "http://31.97.58.125:5005"
    ).replace("/files", "");

    return `${baseUrl}${imageurl}`;
  }

  if (imageurl.startsWith("http") || imageurl.startsWith("blob:")) {
    return imageurl;
  }

  const baseUrl =
    process.env.IMAGE_BASE_URL ||
    process.env.NEXT_PUBLIC_IMAGE_BASE_URL ||
    "http://31.97.58.125:5005/files";

  return `${baseUrl}${imageurl}`;
}
