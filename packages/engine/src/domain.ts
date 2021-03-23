export enum RepoState {
  UNINITIALISED = 'UNINITIALISED',
  EMPTY = 'EMPTY',
  VALID = 'VALID',
  INVALID = 'INVALID',
}

type GUID = string & { isGuid: true }

export type AdventureInfo = {
  name: string
  version: '0.1'
  edition: number
  levels: string
  description: string
}

export interface Adventure extends AdventureInfo {
  chapters: Array<GUID>
}

// eslint-disable-next-line import/no-unused-modules
export type Chapter = {
  name: string
  slug: string
  description: string
  body: string
}

// eslint-disable-next-line import/no-unused-modules
export type ChapterDescriptor = {
  name: string
  slug: string
}
