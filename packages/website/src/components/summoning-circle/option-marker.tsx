import React, { memo } from 'react'
import { CircleConfig, CircleOptions } from './types'
import calculateRadiusCirclePosition from './utils/calculateRadiusCirclePosition'

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

export default memo(OptionMarker)
