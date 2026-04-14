export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\u0621-\u064A\u0660-\u0669a-zA-Z0-9\s-]/g, '') // Keep Arabic, English, Numbers
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-'); // Replace multiple - with single -
}

export function cleanHtml(html: string): string {
  return html
    .replace(/<[^>]*>?/gm, '') // Remove tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .trim();
}
