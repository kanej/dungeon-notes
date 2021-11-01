import { lighten } from 'polished'
import * as React from 'react'
import { useTheme } from 'styled-components'
import { theme as styledTheme } from '../theme'

type CircleOptions = { radius: number; centerX: number; centerY: number }
type Point = [x: number, y: number]
type Line = [Point, Point]

const calculateRadiusCirclePosition = (
  degrees: number,
  { radius, centerX, centerY }: CircleOptions,
): Point => {
  const radians = degrees * (Math.PI / 180)

  const x = Math.cos(radians) * radius
  const y = Math.sin(radians) * radius

  return [x + centerX, y + centerY]
}

const resolveCircleTriangle = (
  startingDegree,
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

const resolveCircleSquare = (
  startingDegree,
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

const SummoningCircle = (props: React.SVGProps<SVGSVGElement>): JSX.Element => {
  const theme = useTheme() as typeof styledTheme

  const stroke = theme.text.primary

  const height = 512
  const width = 512
  const centerX = width / 2
  const centerY = height / 2
  const radius = 450 / 2

  const circleOptions = {
    radius,
    centerX,
    centerY,
  }

  const bottomIncrement = (150 - 30) / 6

  const radiusCircles = [
    { label: 'refresh', degrees: 360 - 45 },
    { label: 'copy', degrees: 0 },
    { label: 'halfling', degrees: 30 + 0 * bottomIncrement },
    { label: 'elf', degrees: 30 + bottomIncrement },
    { label: 'dwarf', degrees: 30 + 2 * bottomIncrement },
    { label: 'human', degrees: 30 + 3 * bottomIncrement },
    { label: 'female', degrees: 30 + 5 * bottomIncrement },
    { label: 'male', degrees: 30 + 6 * bottomIncrement },
  ]

  const circles = radiusCircles.map(({ label, degrees }) => ({
    label,
    point: calculateRadiusCirclePosition(degrees, circleOptions),
  }))

  const lines = resolveCircleTriangle(30, circleOptions)
    .concat(resolveCircleTriangle(90, circleOptions))
    .concat(resolveCircleSquare(45, circleOptions))
    .concat(resolveCircleSquare(90, circleOptions))

  return (
    <svg
      style={{
        height: 512,
        width: 512,
      }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      {...props}
    >
      <defs>
        <mask id="Mask">
          <rect x={0} y={0} width={width} height={height} fill="white" />

          {circles.map(({ label, point: [x, y] }) => (
            <circle key={label} cx={x} cy={y} r={22} fill="black" />
          ))}
        </mask>
      </defs>

      {lines.map(([[x1, y1], [x2, y2]], i) => (
        <line
          // eslint-disable-next-line react/no-array-index-key
          key={`line-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={lighten(0.5, stroke)}
          mask="url(#Mask)"
        />
      ))}

      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke={stroke}
        strokeWidth={4}
        mask="url(#Mask)"
      />

      {circles.map(({ label, point: [x, y] }) => (
        <circle
          key={label}
          cx={x}
          cy={y}
          r={21}
          fill="none"
          stroke={stroke}
          strokeWidth={4}
        />
      ))}
    </svg>
  )
}

export default SummoningCircle
