import { Race } from '../domain'

function randomEnum<T>(anEnum: T): T[keyof T] {
  const enumValues = Object.values(anEnum)

  const randomIndex = Math.floor(Math.random() * enumValues.length)

  return enumValues[randomIndex]
}

export const pickRandomRace = (): Race => {
  return randomEnum(Race)
}
