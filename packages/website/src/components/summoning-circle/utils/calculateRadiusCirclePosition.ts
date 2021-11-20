import { CircleOptions, Point } from '../types'

const calculateRadiusCirclePosition = (
  degrees: number,
  { radius, centerX, centerY }: CircleOptions,
): Point => {
  const radians = degrees * (Math.PI / 180)

  const x = Math.cos(radians) * radius
  const y = Math.sin(radians) * radius

  return [x + centerX, y + centerY]
}

export default calculateRadiusCirclePosition
