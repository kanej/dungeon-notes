import { Gender, Race } from '@dungeon-notes/name-generator'
import { useMemo } from 'react'
import {
  ButtonState,
  CircleOptions,
  CircleConfig,
  CircleSizes,
} from '../components/summoning-circle/types'
import { assertNever } from '../utils/assertNever'

const useSummoningCircle = (props: {
  gender: Gender
  race: Race
  genderSelectionState: Gender
  raceSelectionState: Race
  copyState: ButtonState
  mobileScreenSize: boolean
}): {
  circleOptions: CircleOptions
  radiusCircles: CircleConfig[]
  groupings: [string, number, number][]
  markers: number[]
} => {
  const {
    height,
    width,
    radius,
    outerRadius,
    fontSize,
    smallButtonCircleSize,
    largeButtonCircleSize,
  } = props.mobileScreenSize
    ? {
        height: 360,
        width: 360,
        radius: 155,
        outerRadius: 179,
        fontSize: 2.5,
        smallButtonCircleSize: 32,
        largeButtonCircleSize: 42,
      }
    : {
        height: 512,
        width: 512,
        radius: 225,
        outerRadius: 255,
        fontSize: 3,
        smallButtonCircleSize: 42,
        largeButtonCircleSize: 52,
      }

  const centerX = width / 2
  const centerY = height / 2
  const bottomIncrement = (150 - 30) / 6

  const circleOptions: CircleOptions = useMemo(
    () => ({
      radius,
      centerX,
      centerY,
      outerRadius,
      height,
      width,
      fontSize,
      smallButtonCircleSize,
      largeButtonCircleSize,
    }),
    [
      centerX,
      centerY,
      fontSize,
      height,
      largeButtonCircleSize,
      outerRadius,
      radius,
      smallButtonCircleSize,
      width,
    ],
  )

  const copyTooltip = useMemo(() => {
    switch (props.copyState) {
      case 'ready':
        return 'Copy name to clipboard'
      case 'success':
        return 'Copied!'
      case 'error':
        return 'Copy failed!'
      default:
        assertNever(props.copyState)
    }
  }, [props.copyState])

  const radiusCircles: CircleConfig[] = useMemo(
    () => [
      {
        label: 'copy',
        degrees: 0,
        size: CircleSizes.LARGE,
        tooltipText: copyTooltip,
        tooltipPlacement: props.mobileScreenSize ? 'left' : 'right',
        state: props.copyState,
        highlighted: true,
      },
      {
        label: 'halfling',
        degrees: 30 + 0 * bottomIncrement,
        size: CircleSizes.SMALL,
        tooltipText:
          props.raceSelectionState === Race.Halfling
            ? 'Unpin from halfling names'
            : 'Pin to halfling names',
        tooltipPlacement: 'bottom',
        state: 'ready',
        highlighted: props.race === Race.Halfling,
      },
      {
        label: 'elf',
        degrees: 30 + bottomIncrement,
        size: CircleSizes.SMALL,
        tooltipText:
          props.raceSelectionState === Race.Elf
            ? 'Unpin from elven names'
            : 'Pin to elven names',
        tooltipPlacement: 'bottom',
        state: 'ready',
        highlighted: props.race === Race.Elf,
      },
      {
        label: 'dwarf',
        degrees: 30 + 2 * bottomIncrement,
        size: CircleSizes.SMALL,
        tooltipText:
          props.raceSelectionState === Race.Dwarf
            ? 'Unpin from dwarven names'
            : 'Pin to dwarven names',
        tooltipPlacement: 'bottom',
        state: 'ready',
        highlighted: props.race === Race.Dwarf,
      },
      {
        label: 'human',
        degrees: 30 + 3 * bottomIncrement,
        size: CircleSizes.SMALL,
        tooltipText:
          props.raceSelectionState === Race.Human
            ? 'Unpin from human names'
            : 'Pin to human names',
        tooltipPlacement: 'bottom',
        state: 'ready',
        highlighted: props.race === Race.Human,
      },
      {
        label: 'female',
        degrees: 30 + 5 * bottomIncrement,
        size: CircleSizes.SMALL,
        tooltipText:
          props.genderSelectionState === Gender.Female
            ? 'Unpin from female names'
            : 'Pin to female names',
        tooltipPlacement: 'bottom',
        state: 'ready',
        highlighted: props.gender === Gender.Female,
      },
      {
        label: 'male',
        degrees: 30 + 6 * bottomIncrement,
        size: CircleSizes.SMALL,
        tooltipText:
          props.genderSelectionState === Gender.Male
            ? 'Unpin from male names'
            : 'Pin to male names',
        tooltipPlacement: 'bottom',
        state: 'ready',
        highlighted: props.gender === Gender.Male,
      },
      {
        label: 'refresh',
        degrees: 360 - 45,
        size: CircleSizes.LARGE,
        tooltipText: 'Roll again',
        tooltipPlacement: props.mobileScreenSize ? 'left' : 'right',
        state: 'ready',
        highlighted: true,
      },
    ],
    [
      bottomIncrement,
      copyTooltip,
      props.copyState,
      props.gender,
      props.genderSelectionState,
      props.mobileScreenSize,
      props.race,
      props.raceSelectionState,
    ],
  )

  const genderMarker = useMemo(() => {
    switch (props.genderSelectionState) {
      case Gender.Male:
        return 6
      case Gender.Female:
        return 5
      default:
        return null
    }
  }, [props.genderSelectionState])

  const raceMarker = useMemo(() => {
    switch (props.raceSelectionState) {
      case Race.Dwarf:
        return 3
      case Race.Elf:
        return 2
      case Race.Halfling:
        return 1
      case Race.Human:
        return 4
      default:
        return null
    }
  }, [props.raceSelectionState])

  const groupings = useMemo(() => {
    return [
      ['gender', 5, 6],
      ['race', 1, 4],
    ] as Array<[string, number, number]>
  }, [])

  const markers = useMemo(() => {
    return [raceMarker, genderMarker].filter((x) => Boolean(x))
  }, [genderMarker, raceMarker])

  return { circleOptions, radiusCircles, groupings, markers }
}

export default useSummoningCircle
