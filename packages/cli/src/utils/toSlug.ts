export default function toSlug(text: string): string {
  return text.trim().replaceAll(' ', '-')
}
