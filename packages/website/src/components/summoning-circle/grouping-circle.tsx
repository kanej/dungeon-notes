import flatten from '@flatten-js/core'
import React, { memo } from 'react'
import { CircleConfig, CircleOptions } from './types'
import calculateRadiusCirclePosition from './utils/calculateRadiusCirclePosition'

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

export default memo(GroupingCircle)
