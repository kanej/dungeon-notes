export type GUID = string & { isGuid: true }

export function toGuid(guid: string): GUID {
  return guid as GUID
}

export function isGuid(text: string): text is GUID {
  return typeof text === 'string'
}

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

export type Chapter = {
  id: GUID
  name: string
  slug: string
  body: string
}

export type ChapterDescriptor = {
  name: string
  slug: string
}
