import * as fs from 'fs'
import * as path from 'path'
import { promisify } from 'util'
import { Adventure, AdventureInfo, RepoState } from './domain'
import rootReducer, { RootState } from './redux/rootReducer'
import { initialise } from './redux/slices/repoSlice'

const readFile = promisify(fs.readFile)

const ADVENTURE_FILE = 'adventure.json'

// eslint-disable-next-line import/no-unused-modules
export type EngineInitialisationResult = {
  success: boolean
  error?: string
}

export default class Engine {
  private state: RootState
  private basePath: string
  private adventure?: Adventure

  constructor(basePath: string) {
    this.basePath = basePath
    this.state = {
      repo: { state: RepoState.UNINITIALISED, adventureName: null },
      adventure: {
        name: '',
        version: '0.1',
        edition: 5,
        levels: '1-10',
        description: '',
        chapters: [],
      },
    }
  }

  public async init(): Promise<EngineInitialisationResult> {
    const { success, state, adventure, error } = await this._readAdventureFile()
    this.state = rootReducer(this.state, initialise(state))

    if (!success) {
      return {
        success: false,
        error,
      }
    }

    this.adventure = adventure

    return {
      success: true,
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  public async apply(action: any): Promise<void> {
    if (action.type === 'repo/setup') {
      await this._setupRepo(action.payload.name)
    }

    this.state = rootReducer(this.state, action)
  }

  public getState(): RepoState {
    return this.state.repo.state
  }

  public getAdventure(): Adventure {
    if (!this.adventure) {
      throw new Error('Adventure not loaded')
    }

    return this.adventure
  }

  private async _setupRepo(adventureName: string): Promise<void> {
    const adventureFilePath = path.join(this.basePath, ADVENTURE_FILE)
    const chaptersDirectoryPath = path.join(this.basePath, './chapters')

    const adventure: AdventureInfo = {
      name: adventureName,
      version: '0.1',
      edition: 5,
      levels: '1-5',
      description: '',
    }

    fs.writeFileSync(adventureFilePath, JSON.stringify(adventure, undefined, 2))

    fs.mkdirSync(chaptersDirectoryPath)
  }

  private async _readAdventureFile(): Promise<{
    success: boolean
    state: RepoState
    adventure?: Adventure
    error?: string
  }> {
    const adventureFilePath = path.join(this.basePath, ADVENTURE_FILE)

    try {
      const content = await readFile(adventureFilePath)

      const json: AdventureInfo = JSON.parse(content.toString())

      return {
        success: true,
        state: RepoState.VALID,
        adventure: {
          ...json,
          chapters: [],
        },
      }
    } catch (err) {
      if (err.code === 'ENOENT') {
        return {
          success: true,
          state: RepoState.EMPTY,
        }
      }

      return {
        success: false,
        state: RepoState.INVALID,
        error: 'Unable to read `adventure.json` file',
      }
    }
  }
}
