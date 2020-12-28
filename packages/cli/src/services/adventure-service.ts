import { Adventure, AdventureDescriptor } from '../domain'
import toSlug from '../utils/to-slug'
import FileStore from './file-store'

export default class AdventureService {
  private fileStore: FileStore

  private adventures: { [key: string]: Adventure }

  constructor(fileStore: FileStore, adventures: { [key: string]: Adventure }) {
    this.fileStore = fileStore
    this.adventures = adventures
  }

  async add(name: string): Promise<AdventureDescriptor> {
    const adventure: Adventure = {
      name,
      slug: toSlug(name),
      description: '',
      body: '',
    }

    this.adventures[adventure.slug] = adventure

    this.fileStore.writeAdventure(adventure)

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
