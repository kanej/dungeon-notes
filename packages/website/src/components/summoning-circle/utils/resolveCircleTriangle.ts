import { CircleOptions, Line } from '../types'
import calculateRadiusCirclePosition from './calculateRadiusCirclePosition'

const resolveCircleTriangle = (
  startingDegree: number,
  options: CircleOptions,
): Line[] => {
  const point1 = calculateRadiusCirclePosition(startingDegree, options)
  const point2 = calculateRadiusCirclePosition(startingDegree + 120, options)
  const point3 = calculateRadiusCirclePosition(startingDegree + 240, options)

  return [
    [point1, point2],
    [point2, point3],
    [point3, point1],
  ]
}

export default resolveCircleTriangle
