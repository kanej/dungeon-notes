export enum Gender {
  Male = 'Male',
  Female = 'Female',
}

export type NameGenerationResult = {
  gender: Gender
  firstName: string
  lastName: string
}

const defaultNameArchive = {
  first: {
    [Gender.Male]: [
      'Andris',
      'Arnould',
      'Balan',
      'Bertie',
      'Cannute',
      'Clovis',
      'Damian',
      'Dorian',
      'Elmar',
      'Epicurus',
      'Fawkes',
      'Franz',
    ],
    [Gender.Female]: [
      'Maeve',
      'Maub',
      'Fiona',
      'Grain',
      'Isolde',
      'Eos',
      'Mary',
    ],
  },
  last: [
    'Tiberius',
    'Vespasian',
    'Octavius',
    'Titus',
    'Valerian',
    'Numerian',
    'Maximus',
    'Jovian',
    'Niell',
    'Ollain',
    'Ri',
    'Slanuill',
    'Labrainne',
    'Lardonn',
    'Fail',
  ],
}

const randomGender = (): Gender => {
  return Math.random() < 0.5 ? Gender.Male : Gender.Female
}

const randomPick = (arr: Array<string>) =>
  arr[Math.floor(Math.random() * arr.length)]

export function generate(
  { gender: givenGender }: { gender: Gender | null } = { gender: null },
): NameGenerationResult {
  const gender = givenGender ?? randomGender()

  const firstNamesByGender = defaultNameArchive.first[gender]

  const firstName = randomPick(firstNamesByGender)
  const lastName = randomPick(defaultNameArchive.last)

  return { gender, firstName, lastName }
}
