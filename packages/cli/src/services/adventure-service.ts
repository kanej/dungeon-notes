import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { Adventure, AdventureDescriptor } from '../domain'
import toSlug from '../utils/to-slug'

const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)

export default class AdventureService {
  private basePath: string

  private adventures: { [key: string]: Adventure }

  constructor(basePath: string, adventures: { [key: string]: Adventure }) {
    this.basePath = basePath
    this.adventures = adventures
  }

  async add(name: string): Promise<AdventureDescriptor> {
    const adventure = {
      name,
      slug: toSlug(name),
      description: '',
      body: '',
    }

    this.adventures[adventure.slug] = adventure

    // write to file
    await mkdir(path.join(this.basePath, 'adventures'))
    await mkdir(path.join(this.basePath, 'adventures', adventure.slug))
    await writeFile(
      path.join(this.basePath, 'adventures', adventure.slug, 'intro.md'),
      'example',
    )

    return {
      name,
      slug: adventure.slug,
    }
  }

  listNames(): Array<AdventureDescriptor> {
    return Object.values(this.adventures).map(({ slug, name }) => ({
      slug,
      name,
    }))
  }
}
