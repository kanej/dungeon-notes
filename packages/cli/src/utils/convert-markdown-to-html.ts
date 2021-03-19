import html from 'rehype-stringify'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import unified from 'unified'
// import format from 'rehype-format'

const convertor = unified()
  .use(markdown)
  .use(remark2rehype)
  // .use(format)
  .use(html)

async function convertMarkdownToHtml(markdown: string): Promise<string> {
  const vfile = await convertor.process(markdown)

  return String(vfile)
}

export default convertMarkdownToHtml
