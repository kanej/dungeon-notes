export default function toSlug(text: string): string {
  return text.toLowerCase().trim().replace(/ /g, '-')
}
