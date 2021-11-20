import { CircleOptions, Line } from '../types'
import calculateRadiusCirclePosition from './calculateRadiusCirclePosition'

const resolveCircleSquare = (
  startingDegree: number,
  options: CircleOptions,
): Line[] => {
  const point1 = calculateRadiusCirclePosition(startingDegree, options)
  const point2 = calculateRadiusCirclePosition(startingDegree + 90, options)
  const point3 = calculateRadiusCirclePosition(startingDegree + 180, options)
  const point4 = calculateRadiusCirclePosition(startingDegree + 270, options)

  return [
    [point1, point2],
    [point2, point3],
    [point3, point4],
    [point4, point1],
  ]
}

export default resolveCircleSquare
