export type CircleOptions = {
  radius: number
  centerX: number
  centerY: number
  outerRadius: number
  height: number
  width: number
  fontSize: number
  smallButtonCircleSize: number
  largeButtonCircleSize: number
}

export enum CircleSizes {
  LARGE = 'LARGE',
  SMALL = 'SMALL',
}

export type ButtonState = 'ready' | 'error' | 'success'

export type ButtonLabel =
  | 'refresh'
  | 'copy'
  | 'halfling'
  | 'elf'
  | 'dwarf'
  | 'human'
  | 'male'
  | 'female'

export type Point = [x: number, y: number]
export type Line = [Point, Point]

export type CircleGrouping = [
  name: string,
  start: CircleConfig,
  end: CircleConfig,
]

export type CircleConfig = {
  label: ButtonLabel
  degrees: number
  size: CircleSizes
  tooltipText: string
  tooltipPlacement: 'right' | 'bottom' | 'left' | 'top'
  state: ButtonState
  highlighted: boolean
}
