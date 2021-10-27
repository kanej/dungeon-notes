import { defaultNameArchive } from './defaultNameArchive'
import { NameGenerationConfig, NameGenerationResult, Race } from './domain'
import { pickRandomGender } from './utils/pickRandomGender'
import { randomPick } from './utils/randomPick'

export function generate(
  { gender: givenGender, race: givenRace }: NameGenerationConfig = {
    gender: null,
    race: null,
  },
): NameGenerationResult {
  const gender = givenGender ?? pickRandomGender()
  const race = givenRace ?? Race.Human

  const perRaceArchive = defaultNameArchive[race]

  const firstNamesByGender = perRaceArchive.first[gender]

  const firstName = randomPick(firstNamesByGender)
  const lastName = randomPick(perRaceArchive.last)

  return { gender, race, firstName, lastName }
}
