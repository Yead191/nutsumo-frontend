export function getImageUrl(imageurl: unknown): string | undefined {
  if (typeof imageurl !== "string" || !imageurl.trim()) {
    return undefined;
  }

  if (imageurl.startsWith("/asset")) {
    const baseUrl = (
      process.env.IMAGE_BASE_URL ||
      process.env.NEXT_PUBLIC_IMAGE_BASE_URL ||
      "https://api.ifundayiti.org"
    ).replace("/files", "");

    return `${baseUrl}${imageurl}`;
  }

  if (imageurl.startsWith("http") || imageurl.startsWith("blob:")) {
    return imageurl;
  }

  const baseUrl =
    process.env.IMAGE_BASE_URL ||
    process.env.NEXT_PUBLIC_IMAGE_BASE_URL ||
    "https://api.ifundayiti.org/files";

  return `${baseUrl}${imageurl}`;
}
