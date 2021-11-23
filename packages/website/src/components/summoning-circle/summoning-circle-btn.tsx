import { Tooltip } from '@mui/material'
import { Female } from '@styled-icons/ionicons-sharp/Female'
import { Male } from '@styled-icons/ionicons-sharp/Male'
import { ContentCopy } from '@styled-icons/material/ContentCopy'
import { Refresh } from '@styled-icons/material/Refresh'
import { lighten } from 'polished'
import React, { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import Cowled from '../../components/icons/cowled'
import DwarfHelmet from '../../components/icons/dwarf-helmet'
import ElfHelmet from '../../components/icons/elf-helmet'
import VisoredHelm from '../../components/icons/visored-helm'
import { theme as styleTheme } from '../../theme'
import { assertNever } from '../../utils/assertNever'
import {
  ButtonLabel,
  CircleConfig,
  CircleOptions,
  ButtonState,
  CircleSizes,
} from './types'
import calculateRadiusCirclePosition from './utils/calculateRadiusCirclePosition'

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

const SummoningCircleBtn = ({
  config: {
    degrees,
    label,
    size,
    tooltipText,
    tooltipPlacement,
    state,
    highlighted,
  },
  circleOptions,
  onClick,
}: {
  config: CircleConfig
  circleOptions: CircleOptions
  onClick: (label: ButtonLabel) => void
}): JSX.Element => {
  const handleClick = useCallback(() => {
    return onClick(label)
  }, [label, onClick])

  const { left, top } = useMemo(() => {
    const modifier = size === CircleSizes.LARGE ? 27 : 22
    const [rawX, rawY] = calculateRadiusCirclePosition(degrees, circleOptions)

    const x = Math.round(rawX)
    const y = Math.round(rawY)

    return { left: x - modifier, top: y - modifier }
  }, [circleOptions, degrees, size])

  return (
    <Placer data-left={left} data-top={top}>
      <Tooltip
        arrow
        title={tooltipText}
        enterDelay={500}
        placement={tooltipPlacement}
      >
        {size === CircleSizes.LARGE ? (
          <LargeActionButton
            type="reset"
            data-state={state}
            className={highlighted ? 'current' : 'uncurrent'}
            onClick={handleClick}
          >
            <ButtonIcon label={label} />
          </LargeActionButton>
        ) : (
          <ActionButton
            type="reset"
            data-state={state}
            className={highlighted ? 'current' : 'uncurrent'}
            onClick={handleClick}
          >
            <ButtonIcon label={label} />
          </ActionButton>
        )}
      </Tooltip>
    </Placer>
  )
}

const Placer = styled.div.attrs((props) => ({
  left: props['data-left'],
  top: props['data-top'],
}))`
  position: absolute;
  top: ${({ top }) => `${top}px`};
  left: ${({ left }) => `${left}px`};

  z-index: 100;
  width: 40px;
  height: 40px;
`

const ActionButton = styled.button`
  background: ${({ 'data-state': state }: { 'data-state': ButtonState }) =>
    state === 'success' ? 'green' : 'none'};
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  transition: all 0.4s;

  color: ${({
    theme,
    'data-state': state,
  }: {
    theme: typeof styleTheme
    'data-state': ButtonState
  }) => (state === 'success' ? theme.background.color : theme.text.primary)};

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
      'data-state': ButtonState
    }) => (state === 'success' ? 'green' : theme.text.primary)};
    color: ${({ theme }) => theme.background.color};
    transition: all 0.4s;
  }
`

const LargeActionButton = styled(ActionButton)`
  width: 54px;
  height: 54px;
`

export default memo(SummoningCircleBtn)
