import unified from 'unified'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
// import format from 'rehype-format'
import html from 'rehype-stringify'

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
