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
  ButtonState,
} from '../../components/summoning-circle/types'
import useSummoningCircle from '../../hooks/useSummoningCircle'
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
