import DOMPurify from "dompurify";

export const createMarkup = (html: string | null) => {
  if (typeof html === "string") {
    return {
      __html: DOMPurify.sanitize(html),
    };
  }
  return;
};
