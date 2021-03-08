type GUID = string & { isGuid: true }

export function guid(guid: string): GUID {
  return guid as GUID
}

export enum LoadingStates {
  'LOADING' = 'LOADING',
  'COMPLETE' = 'COMPLETE',
}

export type Adventure = {
  name: string
  edition: string
  levels: string
  description: string
  chapters: Array<GUID>
}
