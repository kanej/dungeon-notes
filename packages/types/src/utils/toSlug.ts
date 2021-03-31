export function toSlug(name: string): string {
  return name.toLocaleLowerCase().trim().replace(/\s+/g, '-')
}
