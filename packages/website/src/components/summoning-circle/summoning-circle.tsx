import { lighten } from 'polished'
import * as React from 'react'
import { useMemo } from 'react'
import { useTheme } from 'styled-components'
import { theme as styledTheme } from '../../theme'
import GroupingCircle from './grouping-circle'
import OptionMarker from './option-marker'
import {
  CircleOptions,
  CircleConfig,
  CircleGrouping,
  CircleSizes,
} from './types'
import calculateRadiusCirclePosition from './utils/calculateRadiusCirclePosition'
import resolveCircleSquare from './utils/resolveCircleSquare'
import resolveCircleTriangle from './utils/resolveCircleTriangle'

const SummoningCircle = (
  props: React.SVGProps<SVGSVGElement> & {
    circleoptions: CircleOptions
    radiuscircles: Array<CircleConfig>
    groupings: [string, number, number][]
    markers: number[]
  },
): JSX.Element => {
  const {
    circleoptions: circleOptions,
    radiuscircles: radiusCircles,
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
        height: circleOptions.height,
        width: circleOptions.width,
      }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${circleOptions.height} ${circleOptions.width}`}
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
