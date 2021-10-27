export enum Gender {
  Male = 'Male',
  Female = 'Female',
}

export enum Race {
  Human = 'Human',
  Dwarf = 'Dwarf',
  Elf = 'Elf',
  Halfling = 'Halfling',
}

export type NameGenerationConfig = { gender: Gender | null; race: Race | null }

export type NameGenerationResult = {
  gender: Gender
  race: Race
  firstName: string
  lastName: string
}

type RaceNameEntry = {
  first: {
    [Gender.Male]: string[]
    [Gender.Female]: string[]
  }
  last: string[]
}

export type NameGenerationTable = {
  [Race.Human]: RaceNameEntry
  [Race.Dwarf]: RaceNameEntry
  [Race.Elf]: RaceNameEntry
  [Race.Halfling]: RaceNameEntry
}
