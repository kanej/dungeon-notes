import * as React from 'react'
import { useTheme } from 'styled-components'
import { theme as styledTheme } from '../theme'

const calculateRadiusCirclePosition = (
  degrees: number,
  {
    radius,
    centerX,
    centerY,
  }: { radius: number; centerX: number; centerY: number },
) => {
  const radians = degrees * (Math.PI / 180)

  const x = Math.cos(radians) * radius
  const y = Math.sin(radians) * radius

  return { x: x + centerX, y: y + centerY }
}

const SummoningCircle = (props: React.SVGProps<SVGSVGElement>): JSX.Element => {
  const theme = useTheme() as typeof styledTheme

  const stroke = theme.text.primary

  const height = 512
  const width = 512
  const centerX = width / 2
  const centerY = height / 2
  const radius = 450 / 2

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
    ...calculateRadiusCirclePosition(degrees, {
      radius,
      centerX,
      centerY,
    }),
  }))

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

          {circles.map(({ label, x, y }) => (
            <circle key={label} cx={x} cy={y} r={22} fill="black" />
          ))}
        </mask>
      </defs>

      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke={stroke}
        strokeWidth={4}
        mask="url(#Mask)"
      />

      {circles.map(({ label, x, y }) => (
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
