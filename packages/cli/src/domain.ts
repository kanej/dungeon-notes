type GUID = string & { isGuid: true }

export function guid(guid: string): GUID {
  return guid as GUID
}

export type AdventureInfo = {
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

export type ChapterDescriptor = {
  name: string
  slug: string
}
