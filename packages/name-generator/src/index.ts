enum Gender {
  Male = 'Male',
  Female = 'Female',
}

const defaultNameArchive = {
  [Gender.Male]: {
    first: [
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
    last: [
      'Tiberius',
      'Vespasian',
      'Octavius',
      'Titus',
      'Valerian',
      'Numerian',
      'Maximus',
      'Jovian',
    ],
  },
  [Gender.Female]: {
    first: ['Maeve', 'Maub', 'Fiona', 'Grain', 'Isolde', 'Eos', 'Mary'],
    last: ['Niell', 'Ollain', 'Ri', 'Slanuill', 'Labrainne', 'Lardonn', 'Fail'],
  },
}

const randomGender = (): Gender => {
  return Math.random() < 0.5 ? Gender.Male : Gender.Female
}

const randomPick = (arr: Array<string>) =>
  arr[Math.floor(Math.random() * arr.length)]

// eslint-disable-next-line import/no-unused-modules
export function generate(): string {
  const gender = randomGender()

  const entry = defaultNameArchive[gender]

  const first = randomPick(entry.first)
  const last = randomPick(entry.last)

  return `${first} ${last}`
}
