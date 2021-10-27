import { generate, Gender } from '@dungeon-notes/name-generator'
import Tooltip from '@mui/material/Tooltip'
import { Female } from '@styled-icons/ionicons-sharp/Female'
import { Male } from '@styled-icons/ionicons-sharp/Male'
import { ContentCopy } from '@styled-icons/material/ContentCopy'
import { Refresh } from '@styled-icons/material/Refresh'
import { PageProps, graphql } from 'gatsby'
import { lighten } from 'polished'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components'

import Layout from '../../components/layout'
import Seo from '../../components/seo'
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
  const [gender, setGender] = useState<Gender | null>()
  const [
    genderSelectionState,
    setGenderSelectionState,
  ] = useState<Gender | null>()
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

  const maleButtonClasses = useMemo(() => {
    const active = genderSelectionState === Gender.Male ? 'active' : ''
    const current = gender === Gender.Male ? 'current' : 'uncurrent'

    return `${current} ${active}`.trim()
  }, [gender, genderSelectionState])

  const femaleButtonClasses = useMemo(() => {
    const active = genderSelectionState === Gender.Female ? 'active' : ''
    const current = gender === Gender.Female ? 'current' : 'uncurrent'

    return `${current} ${active}`.trim()
  }, [gender, genderSelectionState])

  const refresh = useCallback((pinnedGender: Gender | null = null) => {
    const { gender, firstName, lastName } = generate({
      gender: pinnedGender,
    })
    setName(`${firstName} ${lastName}`)
    setGender(gender)
    setLoading(false)
  }, [])

  const handleRefresh = useCallback(() => {
    refresh(genderSelectionState)
  }, [genderSelectionState, refresh])

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
        refresh(updatedGenderSelectionState)
      }
    },
    [gender, genderSelectionState, refresh],
  )

  const handleToggleMale = useCallback(() => {
    handleGenderToggle(Gender.Male)
  }, [handleGenderToggle])

  const handleToggleFemale = useCallback(() => {
    handleGenderToggle(Gender.Female)
  }, [handleGenderToggle])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Name Generator" />

      <Wrap>
        {!loading && (
          <Panel>
            <ActionRow>
              <div />
              <Tooltip
                arrow
                title="Roll again"
                enterDelay={500}
                placement="right"
              >
                <ActionButton
                  type="reset"
                  data-state="ready"
                  onClick={handleRefresh}
                >
                  <Refresh />
                </ActionButton>
              </Tooltip>
            </ActionRow>
            <Name>{name}</Name>
            <ActionRow>
              <GenderPanel>
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
                    <Male />
                  </ActionButton>
                </Tooltip>

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
                    <Female />
                  </ActionButton>
                </Tooltip>
              </GenderPanel>
              <Tooltip
                arrow
                title={copyTooltip}
                enterDelay={500}
                placement="right"
              >
                <ActionButton
                  type="button"
                  data-state={copyState}
                  onClick={handleCopy}
                >
                  <ContentCopy />
                </ActionButton>
              </Tooltip>
            </ActionRow>
          </Panel>
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

const Panel = styled.div`
  display: grid;
`

const ActionRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
`

const GenderPanel = styled.div`
  display: grid;
  grid-template-columns: auto auto 1fr;
  grid-column-gap: 0.5rem;
`

const Name = styled.p`
  font-size: 4rem;
  color: ${({ theme }) => theme.text.color};
  padding: 0rem 2rem;
  text-align: center;
`

const ActionButton = styled.button`
  background: none;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;

  color: ${({ theme }) => theme.text.primary};

  &.active {
    border: ${({ theme }) => `1px solid ${lighten(0, theme.text.primary)}`};
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
