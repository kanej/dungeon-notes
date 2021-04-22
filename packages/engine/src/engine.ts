import {
  readFile as readFileRaw,
  writeFile as writeFileRaw,
  writeFileSync,
  mkdirSync,
} from 'fs'
import { join } from 'path'
import { promisify } from 'util'
import {
  Adventure,
  AdventureInfo,
  Chapter,
  GUID,
  setAdventure,
} from '@dungeon-notes/types'
import rootReducer, { RootState } from './redux/rootReducer'
import { initialise, RepoState } from './redux/slices/repoSlice'
import FileStore from './stores/file-store'

const readFile = promisify(readFileRaw)
const writeFile = promisify(writeFileRaw)

const ADVENTURE_FILE = 'adventure.json'

// eslint-disable-next-line import/no-unused-modules
export type EngineInitialisationResult = {
  success: boolean
  error?: string
}

export default class Engine {
  private state: RootState
  private basePath: string
  private store: FileStore

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
        chapterMap: {},
      },
    }
    this.store = new FileStore(this.basePath)
  }

  public async init(): Promise<EngineInitialisationResult> {
    const { success, state, adventure, error } = await this._readAdventureFile()
    const chapters = await this.store.readAllChapters()

    if (!success) {
      this.state = rootReducer(this.state, initialise(state))

      return {
        success: false,
        error,
      }
    }

    if (adventure) {
      this.state = rootReducer(
        this.state,
        setAdventure({ adventure, chapters }),
      )
    }

    this.state = rootReducer(this.state, initialise(state))

    return {
      success: true,
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  public async apply(action: any): Promise<void> {
    if (action.type === 'repo/setup') {
      await this._setupRepo(action.payload.name)
    }

    const previousState = this.state

    this.state = rootReducer(this.state, action)

    if (action.type.startsWith('adventure')) {
      await this._flush()
    }

    if (
      action.type === 'adventure/addChapter' ||
      action.type === 'adventure/updateChapterBody'
    ) {
      const {
        payload: { id: chapterId },
      } = action

      const chapter = this.state.adventure.chapterMap[chapterId]
      const index = this.state.adventure.chapters.indexOf(chapterId)

      await this.store.writeChapter(index + 1, chapter)
    }

    if (action.type === 'adventure/updateChapterName') {
      const {
        payload: { id: chapterId },
      } = action

      const chapter = this.state.adventure.chapterMap[chapterId]
      const index = this.state.adventure.chapters.indexOf(chapterId)

      const previousChapter = previousState.adventure.chapterMap[chapterId]

      await this.store.renameChapter(index + 1, previousChapter, chapter)
    }

    if (action.type === 'adventure/updateChapterOrder') {
      const previousMapping: {
        [key: string]: number
      } = previousState.adventure.chapters.reduce(
        (acc, item, index) => ({ ...acc, [item]: index }),
        {},
      )

      for (const {
        id: chapterId,
        index,
      } of this.state.adventure.chapters.map((id, index) => ({ id, index }))) {
        if (previousMapping[chapterId] === index) {
          continue
        }

        const chapter = this.state.adventure.chapterMap[chapterId]
        const previousChapter = previousState.adventure.chapterMap[chapterId]

        // eslint-disable-next-line no-await-in-loop
        await this.store.renameChapter(index + 1, previousChapter, chapter)
      }
    }
  }

  public getState(): RepoState {
    return this.state.repo.state
  }

  public getAdventure(): Adventure {
    if (!this.state.adventure) {
      throw new Error('Adventure not loaded')
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { chapterMap, ...withoutChapterMap } = this.state.adventure

    return withoutChapterMap
  }

  public getChapters(): Chapter[] {
    const chapters = this.state.adventure.chapters

    return chapters.map(
      (chapterId) => this.state.adventure.chapterMap[chapterId],
    )
  }

  public getChapter(chapterId: GUID): Chapter | null {
    const chapter = this.state.adventure.chapterMap[chapterId]

    return chapter || null
  }

  private async _setupRepo(adventureName: string): Promise<void> {
    const adventureFilePath = join(this.basePath, ADVENTURE_FILE)
    const chaptersDirectoryPath = join(this.basePath, './chapters')

    const adventure: AdventureInfo = {
      name: adventureName,
      version: '0.1',
      edition: 5,
      levels: '1-5',
      description: '',
    }

    writeFileSync(adventureFilePath, JSON.stringify(adventure, undefined, 2))

    mkdirSync(chaptersDirectoryPath)
  }

  private async _readAdventureFile(): Promise<{
    success: boolean
    state: RepoState
    adventure?: Adventure
    error?: string
  }> {
    const adventureFilePath = join(this.basePath, ADVENTURE_FILE)

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

  private async _writeAdventureFile(adventure: Adventure) {
    const adventureFilePath = join(this.basePath, ADVENTURE_FILE)

    try {
      const adventureInfo: AdventureInfo = {
        name: adventure.name,
        version: adventure.version,
        edition: adventure.edition,
        levels: adventure.levels,
        description: adventure.description,
      }

      return writeFile(
        adventureFilePath,
        JSON.stringify(adventureInfo, undefined, 2),
      )
    } catch {
      throw new Error("Unable to write to 'adventure.json' file")
    }
  }

  private async _flush() {
    const adventure = this.state.adventure

    return this._writeAdventureFile(adventure)
  }
}
