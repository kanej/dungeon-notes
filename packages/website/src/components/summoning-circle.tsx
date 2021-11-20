import flatten from '@flatten-js/core'
import { lighten } from 'polished'
import * as React from 'react'
import { useMemo } from 'react'
import { useTheme } from 'styled-components'
import { theme as styledTheme } from '../theme'

export type CircleOptions = {
  radius: number
  centerX: number
  centerY: number
  outerRadius: number
}

export enum CircleSizes {
  LARGE = 'LARGE',
  SMALL = 'SMALL',
}

type Point = [x: number, y: number]
type Line = [Point, Point]

export type CircleGrouping = [
  name: string,
  start: CircleConfig,
  end: CircleConfig,
]

export type CircleConfig = { label: string; degrees: number; size: CircleSizes }

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

const GroupingCircle = ({
  start,
  end,
  circleOptions,
  stroke,
  strokeWidth,
}: {
  start: CircleConfig
  end: CircleConfig
  circleOptions: CircleOptions
  stroke: string
  strokeWidth: number
}): JSX.Element => {
  const [x, y] = calculateRadiusCirclePosition(
    (start.degrees + end.degrees) / 2,
    {
      ...circleOptions,
    },
  )

  const [sx, sy] = calculateRadiusCirclePosition(start.degrees, circleOptions)

  const [r] = new flatten.Point(x, y).distanceTo(new flatten.Point(sx, sy))

  return (
    <circle
      cx={x}
      cy={y}
      r={r}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      mask="url(#Inner)"
    />
  )
}

const OptionMarker = ({
  option,
  circleOptions,
  fill,
}: {
  option: CircleConfig
  circleOptions: CircleOptions
  fill: string
}): JSX.Element => {
  const width = 3

  const [x1, y1] = calculateRadiusCirclePosition(option.degrees - width, {
    ...circleOptions,
    radius: circleOptions.outerRadius,
  })

  const [x2, y2] = calculateRadiusCirclePosition(option.degrees + width, {
    ...circleOptions,
    radius: circleOptions.outerRadius,
  })

  const [x3, y3] = calculateRadiusCirclePosition(option.degrees, {
    ...circleOptions,
    radius: circleOptions.radius + 15,
  })

  return <polygon fill={fill} points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`} />
}

const SummoningCircle = (
  props: React.SVGProps<SVGSVGElement> & {
    circleOptions: CircleOptions
    radiusCircles: Array<CircleConfig>
    groupings: [string, number, number][]
    markers: number[]
  },
): JSX.Element => {
  const {
    circleOptions,
    radiusCircles,
    groupings: groupingNums,
    markers: markerNums,
  } = props

  const theme = useTheme() as typeof styledTheme

  const stroke = theme.text.primary

  const { groupings, markers } = useMemo(() => {
    return {
      groupings: groupingNums.map(([name, start, end]) => [
        name,
        radiusCircles[start],
        radiusCircles[end],
      ]),
      markers: markerNums.map((ind) => radiusCircles[ind]),
    } as { groupings: Array<CircleGrouping>; markers: Array<CircleConfig> }
  }, [groupingNums, markerNums, radiusCircles])

  const circles = useMemo(
    () =>
      radiusCircles.map(({ label, degrees, size }) => ({
        label,
        size,
        point: calculateRadiusCirclePosition(degrees, circleOptions),
      })),
    [circleOptions, radiusCircles],
  )

  const lines = useMemo(
    () =>
      resolveCircleTriangle(30, circleOptions)
        .concat(resolveCircleTriangle(90, circleOptions))
        .concat(resolveCircleSquare(45, circleOptions))
        .concat(resolveCircleSquare(90, circleOptions)),
    [circleOptions],
  )

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
        <mask id="Inner">
          <circle
            cx={circleOptions.centerX}
            cy={circleOptions.centerY}
            r={circleOptions.radius}
            fill="white"
          />

          {circles.map(({ label, size, point: [x, y] }) => (
            <circle
              key={label}
              cx={x}
              cy={y}
              r={size === CircleSizes.LARGE ? 26 : 21}
              fill="black"
            />
          ))}
        </mask>

        <mask id="Outer">
          <circle
            cx={circleOptions.centerX}
            cy={circleOptions.centerY}
            r={circleOptions.outerRadius}
            fill="white"
          />

          {circles.map(({ label, size, point: [x, y] }) => (
            <circle
              key={label}
              cx={x}
              cy={y}
              r={size === CircleSizes.LARGE ? 26 : 21}
              fill="black"
            />
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
          mask="url(#Outer)"
        />
      ))}

      <circle
        cx={circleOptions.centerX}
        cy={circleOptions.centerY}
        r={circleOptions.outerRadius}
        fill="none"
        stroke={lighten(0.5, stroke)}
        strokeWidth={1}
        mask="url(#Outer)"
      />

      {groupings.map(([name, start, end]) => (
        <GroupingCircle
          key={name}
          start={start}
          end={end}
          circleOptions={circleOptions}
          stroke={lighten(0.5, stroke)}
          strokeWidth={2}
        />
      ))}

      <circle
        cx={circleOptions.centerX}
        cy={circleOptions.centerY}
        r={circleOptions.radius}
        fill="none"
        stroke={lighten(0.5, stroke)}
        strokeWidth={4}
        mask="url(#Outer)"
      />

      {circles.map(({ label, size, point: [x, y] }) => (
        <circle
          key={label}
          cx={x}
          cy={y}
          r={size === CircleSizes.LARGE ? 26 : 21}
          fill="none"
          stroke={lighten(0.5, stroke)}
          strokeWidth={4}
        />
      ))}

      {markers.map((marker) => (
        <OptionMarker
          key={marker.label}
          option={marker}
          circleOptions={circleOptions}
          fill={lighten(0.45, stroke)}
        />
      ))}
    </svg>
  )
}

export default SummoningCircle
