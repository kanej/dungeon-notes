import toSlug from '../utils/toSlug'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)

type Adventure = {
  name: string
  slug: string
  description: string
  body: string
}

export default class AdventureService {
  private basePath: string
  private adventures: { [key: string]: Adventure }

  constructor(basePath: string, adventures: { [key: string]: Adventure }) {
    this.basePath = basePath
    this.adventures = adventures
  }

  async add(name: string) {
    const adventure = {
      name,
      slug: toSlug(name),
      description: '',
      body: '',
    }

    this.adventures[adventure.slug] = adventure

    // write to file
    await mkdir(path.join(this.basePath, adventure.slug))

    return {
      name,
      slug: adventure.slug,
    }
  }

  listNames() {
    return Object.values(this.adventures).map(({ slug, name }) => ({
      slug,
      name,
    }))
  }
}
