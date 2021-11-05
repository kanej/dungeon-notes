import { generate, Gender, Race } from '@dungeon-notes/name-generator'
import Tooltip from '@mui/material/Tooltip'
import { Female } from '@styled-icons/ionicons-sharp/Female'
import { Male } from '@styled-icons/ionicons-sharp/Male'
import { ContentCopy } from '@styled-icons/material/ContentCopy'
import { Refresh } from '@styled-icons/material/Refresh'
import { PageProps, graphql } from 'gatsby'
import { lighten } from 'polished'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import Cowled from '../../components/icons/cowled'
import DwarfHelmet from '../../components/icons/dwarf-helmet'
import ElfHelmet from '../../components/icons/elf-helmet'
import VisoredHelm from '../../components/icons/visored-helm'

import Layout from '../../components/layout'
import Seo from '../../components/seo'
import SummoningCircle from '../../components/summoning-circle'
import { theme as styleTheme } from '../../theme'
import { assertNever } from '../../utils/assertNever'

type DataProps = {
  site: {
    siteMetadata?: {
      title: string
    }
  }
}

type CopyState = 'ready' | 'error' | 'success'

const NameGenerator: React.FC<PageProps<DataProps>> = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`

  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')

  const [gender, setGender] = useState<Gender | null>(null)
  const [
    genderSelectionState,
    setGenderSelectionState,
  ] = useState<Gender | null>(null)

  const [race, setRace] = useState<Race | null>(null)
  const [raceSelectionState, setRaceSelectionState] = useState<Race | null>(
    null,
  )

  const [copyState, setCopyState] = useState<CopyState>('ready')

  const copyTooltip = useMemo(() => {
    switch (copyState) {
      case 'ready':
        return 'Copy name to clipboard'
      case 'success':
        return 'Copied!'
      case 'error':
        return 'Copy failed!'
      default:
        assertNever(copyState)
    }
  }, [copyState])

  const resolveGenderButtonClasses = useCallback(
    (
      buttonGender: Gender,
      gender: Gender | null,
      selectionState: Gender | null,
    ) => {
      const active = selectionState === buttonGender ? 'active' : ''
      const current = gender === buttonGender ? 'current' : 'uncurrent'

      return `${current} ${active}`.trim()
    },
    [],
  )

  const resolveRaceButtonClasses = useCallback(
    (buttonRace: Race, race: Race | null, selectionState: Race | null) => {
      const active = selectionState === buttonRace ? 'active' : ''
      const current = race === buttonRace ? 'current' : 'uncurrent'

      return `${current} ${active}`.trim()
    },
    [],
  )

  const {
    maleButtonClasses,
    femaleButtonClasses,
    humanButtonClasses,
    dwarfButtonClasses,
    elfButtonClasses,
    halflingButtonClasses,
  } = useMemo(
    () => ({
      maleButtonClasses: resolveGenderButtonClasses(
        Gender.Male,
        gender,
        genderSelectionState,
      ),
      femaleButtonClasses: resolveGenderButtonClasses(
        Gender.Female,
        gender,
        genderSelectionState,
      ),
      humanButtonClasses: resolveRaceButtonClasses(
        Race.Human,
        race,
        raceSelectionState,
      ),
      dwarfButtonClasses: resolveRaceButtonClasses(
        Race.Dwarf,
        race,
        raceSelectionState,
      ),
      elfButtonClasses: resolveRaceButtonClasses(
        Race.Elf,
        race,
        raceSelectionState,
      ),
      halflingButtonClasses: resolveRaceButtonClasses(
        Race.Halfling,
        race,
        raceSelectionState,
      ),
    }),
    [
      gender,
      genderSelectionState,
      race,
      raceSelectionState,
      resolveGenderButtonClasses,
      resolveRaceButtonClasses,
    ],
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
      setTimeout(() => setCopyState('ready'), 3000)
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

  const handleToggleMale = useCallback(() => {
    handleGenderToggle(Gender.Male)
  }, [handleGenderToggle])

  const handleToggleFemale = useCallback(() => {
    handleGenderToggle(Gender.Female)
  }, [handleGenderToggle])

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

  const handleToggleHuman = useCallback(() => {
    handleRaceToggle(Race.Human)
  }, [handleRaceToggle])

  const handleToggleDwarf = useCallback(() => {
    handleRaceToggle(Race.Dwarf)
  }, [handleRaceToggle])

  const handleToggleElf = useCallback(() => {
    handleRaceToggle(Race.Elf)
  }, [handleRaceToggle])

  const handleToggleHalfling = useCallback(() => {
    handleRaceToggle(Race.Halfling)
  }, [handleRaceToggle])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Name Generator" />

      <Wrap>
        {!loading && (
          <CirclePlacer>
            <SummoningCircle />

            <RefreshPlacer>
              <Tooltip
                arrow
                title="Roll again"
                enterDelay={500}
                placement="right"
              >
                <LargeActionButton
                  type="reset"
                  data-state="ready"
                  onClick={handleRefresh}
                >
                  <Refresh width="34px" />
                </LargeActionButton>
              </Tooltip>
            </RefreshPlacer>

            <CopyPlacer>
              <Tooltip
                arrow
                title={copyTooltip}
                enterDelay={500}
                placement="right"
              >
                <LargeActionButton
                  type="button"
                  data-state={copyState}
                  onClick={handleCopy}
                >
                  <ContentCopy width="28px" />
                </LargeActionButton>
              </Tooltip>
            </CopyPlacer>

            <NameWrap>
              <Name>{name}</Name>
            </NameWrap>

            <MalePlacer>
              <Tooltip
                arrow
                title="Pin to male names"
                enterDelay={500}
                placement="bottom"
              >
                <ActionButton
                  type="button"
                  data-state="ready"
                  className={maleButtonClasses}
                  onClick={handleToggleMale}
                >
                  <Male width="28px" />
                </ActionButton>
              </Tooltip>
            </MalePlacer>
            <FemalePlacer>
              <Tooltip
                arrow
                title="Pin to female names"
                enterDelay={500}
                placement="bottom"
              >
                <ActionButton
                  data-tip
                  type="button"
                  data-state="ready"
                  className={femaleButtonClasses}
                  onClick={handleToggleFemale}
                >
                  <Female width="28px" />
                </ActionButton>
              </Tooltip>
            </FemalePlacer>

            <HalflingPlacer>
              <Tooltip
                arrow
                title="Pin to halfling names"
                enterDelay={500}
                placement="bottom"
              >
                <ActionButton
                  type="button"
                  data-state="ready"
                  className={halflingButtonClasses}
                  onClick={handleToggleHalfling}
                >
                  <Cowled />
                </ActionButton>
              </Tooltip>
            </HalflingPlacer>
            <ElfPlacer>
              <Tooltip
                arrow
                title="Pin to elven names"
                enterDelay={500}
                placement="bottom"
              >
                <ActionButton
                  type="button"
                  data-state="ready"
                  className={elfButtonClasses}
                  onClick={handleToggleElf}
                >
                  <ElfHelmet />
                </ActionButton>
              </Tooltip>
            </ElfPlacer>
            <DwarfPlacer>
              <Tooltip
                arrow
                title="Pin to dwarven names"
                enterDelay={500}
                placement="bottom"
              >
                <ActionButton
                  type="button"
                  data-state="ready"
                  className={dwarfButtonClasses}
                  onClick={handleToggleDwarf}
                >
                  <DwarfHelmet />
                </ActionButton>
              </Tooltip>
            </DwarfPlacer>
            <HumanPlacer>
              <Tooltip
                arrow
                title="Pin to human names"
                enterDelay={500}
                placement="bottom"
              >
                <ActionButton
                  type="button"
                  data-state="ready"
                  className={humanButtonClasses}
                  onClick={handleToggleHuman}
                >
                  <VisoredHelm />
                </ActionButton>
              </Tooltip>
            </HumanPlacer>
          </CirclePlacer>
        )}
      </Wrap>
    </Layout>
  )
}

const Wrap = styled.div`
  display: grid;
  height: 100%;
  place-items: center;
`

const CirclePlacer = styled.div`
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

const RefreshPlacer = styled.div`
  position: absolute;
  top: 70px;
  left: 388px;
  z-index: 100;
  width: 40px;
  height: 40px;
`

const CopyPlacer = styled.div`
  position: absolute;
  top: 229px;
  left: 454px;
  z-index: 100;
  width: 80px;
  height: 80px;
`

const HalflingPlacer = styled.div`
  position: absolute;
  top: 346px;
  left: 429px;
  z-index: 100;
  width: 80px;
  height: 80px;
`

const ElfPlacer = styled.div`
  position: absolute;
  top: 406px;
  left: 379px;
  z-index: 100;
  width: 80px;
  height: 80px;
`

const DwarfPlacer = styled.div`
  position: absolute;
  top: 445px;
  left: 311px;
  z-index: 100;
  width: 80px;
  height: 80px;
`

const HumanPlacer = styled.div`
  position: absolute;
  top: 459px;
  left: 234px;
  z-index: 100;
  width: 80px;
  height: 80px;
`

const FemalePlacer = styled.div`
  position: absolute;
  top: 406px;
  left: 89px;
  z-index: 100;
  width: 80px;
  height: 80px;
`

const MalePlacer = styled.div`
  position: absolute;
  top: 347px;
  left: 39px;
  z-index: 100;
  width: 80px;
  height: 80px;
`

const Name = styled.p`
  font-size: 3rem;
  color: ${({ theme }) => theme.text.color};
  padding: 0rem 6rem;
  margin-bottom: 0;
  text-align: center;
`

const ActionButton = styled.button`
  background: none;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;

  color: ${({ theme }) => theme.text.primary};

  &:active {
    outline: ${({ theme }) => `2px solid ${lighten(0, theme.text.primary)}`};
  }

  &.current {
    color: ${({ theme }) => theme.text.primary};
  }

  &.uncurrent {
    color: ${({ theme }) => lighten(0.4, theme.text.primary)};
  }

  &:hover {
    background-color: ${({
      theme,
      'data-state': state,
    }: {
      theme: typeof styleTheme
      'data-state': CopyState
    }) => (state === 'success' ? 'green' : theme.text.primary)};
    color: ${({ theme }) => theme.background.color};
    transition: all 0.4s;
  }
`

const LargeActionButton = styled(ActionButton)`
  width: 54px;
  height: 54px;
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
