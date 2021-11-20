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

export type Point = [x: number, y: number]
export type Line = [Point, Point]

export type CircleGrouping = [
  name: string,
  start: CircleConfig,
  end: CircleConfig,
]

export type CircleConfig = { label: string; degrees: number; size: CircleSizes }
