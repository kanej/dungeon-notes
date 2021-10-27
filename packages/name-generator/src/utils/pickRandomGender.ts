import { Gender } from '../domain'

export const pickRandomGender = (): Gender => {
  return Math.random() < 0.5 ? Gender.Male : Gender.Female
}
