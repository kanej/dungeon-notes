import yaml from 'js-yaml'
// eslint-disable-next-line import/no-unresolved
import { Root } from 'mdast'
import frontmatter from 'remark-frontmatter'
import parse from 'remark-parse'
import stringify from 'remark-stringify'
import unified from 'unified'
import find from 'unist-util-find'
import is from 'unist-util-is'
import remove from 'unist-util-remove'
import { Chapter } from '../domain'
import toSlug from './to-slug'

const processor = unified().use(parse).use(stringify).use(frontmatter, ['yaml'])

export async function convertChapterToMarkdown({
  name,
  description,
  body,
}: Chapter): Promise<string> {
  const ast = await processor.parse(body)

  if (!is<Root>(ast, 'root')) {
    throw new Error('Not a root node')
  }

  const frontmatter = yaml.safeDump({ name, description })

  ast.children = [
    { type: 'yaml', value: frontmatter.slice(0, -1) },
    ...ast.children,
  ]

  const adventureMarkdown = await processor.stringify(ast)
  return String(adventureMarkdown)
}

export async function convertMarkdownToChapter(
  markdown: string,
): Promise<Chapter> {
  const ast = await processor.parse(markdown)

  const yamlNode = find(ast, { type: 'yaml' })

  if (!yamlNode) {
    throw new Error('Invalid intro file')
  }

  const { name, description } = yaml.safeLoad(yamlNode.value) as {
    name: string
    description: string
  }

  const astWithoutFrontmatter = remove(ast, 'yaml')

  const withoutFrontmatter = await processor.stringify(astWithoutFrontmatter)

  return {
    name: name,
    slug: toSlug(name),
    description: description,
    body: withoutFrontmatter.slice(0, -1),
  }
}
