import { Adventure } from '../domain'

export async function convertAdventureToMarkdown(
  adventure: Adventure,
): Promise<string> {
  return `example - adventure: ${adventure.name}`
}
