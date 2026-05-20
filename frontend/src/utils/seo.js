export function setPageMetadata({ title, description }) {
  if (title) {
    document.title = title;
  }

  const descriptionTag = document.querySelector('meta[name="description"]');
  if (descriptionTag && description) {
    descriptionTag.setAttribute("content", description);
  }
}
