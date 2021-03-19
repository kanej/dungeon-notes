type GUID = string & { isGuid: true }

// eslint-disable-next-line import/no-unused-modules
export function guid(guid: string): GUID {
  return guid as GUID
}

type AdventureInfo = {
  name: string
  version: string
  edition: number
  levels: string
  description: string
}

export interface Adventure extends AdventureInfo {
  chapters: Array<GUID>
}

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

// UI Only

export enum LoadingStates {
  'LOADING' = 'LOADING',
  'COMPLETE' = 'COMPLETE',
}
