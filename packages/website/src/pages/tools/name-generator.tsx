import { generate, Gender, Race } from '@dungeon-notes/name-generator'
import { Female } from '@styled-icons/ionicons-sharp/Female'
import { Male } from '@styled-icons/ionicons-sharp/Male'
import { ContentCopy } from '@styled-icons/material/ContentCopy'
import { Refresh } from '@styled-icons/material/Refresh'
import { PageProps, graphql } from 'gatsby'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components'

import Cowled from '../../components/icons/cowled'
import DwarfHelmet from '../../components/icons/dwarf-helmet'
import ElfHelmet from '../../components/icons/elf-helmet'
import VisoredHelm from '../../components/icons/visored-helm'
import Layout from '../../components/layout'
import Seo from '../../components/seo'
import SummoningCircle from '../../components/summoning-circle/summoning-circle'
import SummoningCircleBtn from '../../components/summoning-circle/summoning-circle-btn'
import {
  ButtonLabel,
  CircleConfig,
  CircleOptions,
  CircleSizes,
  ButtonState,
} from '../../components/summoning-circle/types'
import { assertNever } from '../../utils/assertNever'

const SETTINGS_TOKEN = 'dungeon-notes::name-generator'

const isBrowser = typeof window !== 'undefined'

type DataProps = {
  site: {
    siteMetadata?: {
      title: string
    }
  }
}

const saveSettingsToLocalstorage = ({
  gender,
  race,
}: {
  gender: Gender | null
  race: Race | null
}) => {
  localStorage.setItem(SETTINGS_TOKEN, JSON.stringify({ gender, race }))
}

const useSummoningCircle = (props: {
  gender: Gender
  race: Race
  genderSelectionState: Gender
  raceSelectionState: Race
  copyState: ButtonState
}) => {
  const height = 512
  const width = 512
  const centerX = width / 2
  const centerY = height / 2
  const radius = 450 / 2
  const outerRadius = radius + 30

  const circleOptions: CircleOptions = useMemo(
    () => ({
      radius,
      centerX,
      centerY,
      outerRadius,
    }),
    [centerX, centerY, outerRadius, radius],
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

  const bottomIncrement = (150 - 30) / 6

  const radiusCircles: CircleConfig[] = useMemo(
    () => [
      {
        label: 'copy',
        degrees: 0,
        size: CircleSizes.LARGE,
        tooltipText: copyTooltip,
        tooltipPlacement: 'right',
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
        tooltipPlacement: 'right',
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

const NameGenerator: React.FC<PageProps<DataProps>> = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`

  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')

  const [gender, setGender] = useState<Gender | null>(null)
  const [race, setRace] = useState<Race | null>(null)

  const [copyState, setCopyState] = useState<ButtonState>('ready')

  const {
    gender: initialGenderSelectionState,
    race: initialRaceSelectionState,
  } = useMemo(() => {
    if (!isBrowser) {
      return {
        gender: null,
        race: Race.Human,
      }
    }

    const savedSettings = localStorage.getItem(SETTINGS_TOKEN)

    return savedSettings
      ? JSON.parse(savedSettings)
      : {
          gender: null,
          race: Race.Human,
        }
  }, [])

  const [
    genderSelectionState,
    setGenderSelectionState,
  ] = useState<Gender | null>(initialGenderSelectionState)

  const [raceSelectionState, setRaceSelectionState] = useState<Race | null>(
    initialRaceSelectionState,
  )

  const refresh = useCallback(
    (pinnedGender: Gender | null = null, pinnedRace: Race | null = null) => {
      const { gender, race, firstName, lastName } = generate({
        gender: pinnedGender,
        race: pinnedRace,
      })

      setName(`${firstName} ${lastName}`)
      setGender(gender)
      setRace(race)
      setLoading(false)
    },
    [],
  )

  const handleRefresh = useCallback(() => {
    refresh(genderSelectionState, raceSelectionState)
  }, [genderSelectionState, raceSelectionState, refresh])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(name)

      setCopyState('success')
    } catch (error) {
      setCopyState('error')
    } finally {
      setTimeout(() => setCopyState('ready'), 1500)
    }
  }, [name])

  const handleGenderToggle = useCallback(
    (buttonGender: Gender) => {
      const updatedGenderSelectionState =
        genderSelectionState === buttonGender ? null : buttonGender

      setGenderSelectionState(updatedGenderSelectionState)

      if (gender !== buttonGender) {
        refresh(updatedGenderSelectionState, raceSelectionState)
      }
    },
    [gender, genderSelectionState, raceSelectionState, refresh],
  )

  const handleRaceToggle = useCallback(
    (buttonRace: Race) => {
      const updatedRaceSelectionState =
        raceSelectionState === buttonRace ? null : buttonRace

      setRaceSelectionState(updatedRaceSelectionState)

      if (race !== buttonRace) {
        refresh(genderSelectionState, updatedRaceSelectionState)
      }
    },
    [genderSelectionState, race, raceSelectionState, refresh],
  )

  const handleButtonClick = useCallback(
    (label: ButtonLabel) => {
      switch (label) {
        case 'refresh':
          return handleRefresh()
        case 'copy':
          return handleCopy()
        case 'male':
          return handleGenderToggle(Gender.Male)
        case 'female':
          return handleGenderToggle(Gender.Female)
        case 'human':
          return handleRaceToggle(Race.Human)
        case 'elf':
          return handleRaceToggle(Race.Elf)
        case 'dwarf':
          return handleRaceToggle(Race.Dwarf)
        case 'halfling':
          return handleRaceToggle(Race.Halfling)
        default:
          assertNever(label)
      }
    },
    [handleCopy, handleGenderToggle, handleRaceToggle, handleRefresh],
  )

  const {
    circleOptions,
    radiusCircles,
    groupings,
    markers,
  } = useSummoningCircle({
    gender: gender,
    race: race,
    genderSelectionState: genderSelectionState,
    raceSelectionState: raceSelectionState,
    copyState,
  })

  useEffect(() => {
    if (!isBrowser) {
      return
    }

    saveSettingsToLocalstorage({
      gender: genderSelectionState,
      race: raceSelectionState,
    })
  }, [genderSelectionState, raceSelectionState])

  useEffect(() => {
    if (name) {
      return
    }

    refresh(genderSelectionState, raceSelectionState)
  }, [genderSelectionState, name, raceSelectionState, refresh])

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Name Generator" />

      <Wrap>
        {!loading && (
          <MainPanel>
            <SummoningCircle
              circleoptions={circleOptions}
              radiuscircles={radiusCircles}
              groupings={groupings}
              markers={markers}
            />

            <NameWrap>
              <Name>{name}</Name>
            </NameWrap>

            {radiusCircles.map((circle) => (
              <SummoningCircleBtn
                key={`summon-btn-${circle.label}`}
                config={circle}
                circleOptions={circleOptions}
                onClick={handleButtonClick}
              >
                <ButtonIcon label={circle.label} />
              </SummoningCircleBtn>
            ))}
          </MainPanel>
        )}
      </Wrap>
    </Layout>
  )
}

const ButtonIcon = ({ label }: { label: ButtonLabel }) => {
  switch (label) {
    case 'refresh':
      return <Refresh width="34px" />
    case 'copy':
      return <ContentCopy width="28px" />
    case 'male':
      return <Male width="28px" />
    case 'female':
      return <Female width="28px" />
    case 'halfling':
      return <Cowled />
    case 'elf':
      return <ElfHelmet />
    case 'dwarf':
      return <DwarfHelmet />
    case 'human':
      return <VisoredHelm />
    default:
      assertNever(label)
  }
}

const Wrap = styled.div`
  display: grid;
  height: 100%;
  place-items: center;
`

const MainPanel = styled.div`
  height: 512;
  width: 512;
  position: relative;

  color: ${({ theme }) => theme.text.color};
`

const NameWrap = styled.div`
  width: 512px;
  height: 512px;
  display: grid;
  place-items: center;
  position: absolute;
  top: 0;
  left: 0;
`

const Name = styled.p`
  font-size: 3rem;
  color: ${({ theme }) => theme.text.color};
  padding: 0rem 6rem;
  margin-bottom: 0;
  text-align: center;
`

export default NameGenerator

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
