export function getImageUrl(imageurl: string | null | undefined) {
  if (!imageurl) return undefined;
  if (imageurl.startsWith("/asset")) {
    const baseUrl = (
      process.env.IMAGE_BASE_URL ||
      process.env.NEXT_PUBLIC_IMAGE_BASE_URL ||
      "https://api.ifundayiti.org"
    )?.replace("/files", "");

    return `${baseUrl}${imageurl}`;
  }
  if (imageurl.startsWith("http") || imageurl.startsWith("blob:"))
    return imageurl;
  return (
    (process.env.IMAGE_BASE_URL ||
      process.env.NEXT_PUBLIC_IMAGE_BASE_URL ||
      "https://api.ifundayiti.org/files") + imageurl
  );
}
