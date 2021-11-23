import { Tooltip } from '@mui/material'
import { lighten } from 'polished'
import React, { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { theme as styleTheme } from '../../theme'
import {
  ButtonLabel,
  CircleConfig,
  ButtonState,
  CircleSizes,
  CircleOptions,
} from './types'
import calculateRadiusCirclePosition from './utils/calculateRadiusCirclePosition'

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
  children,
}: React.PropsWithChildren<{
  config: CircleConfig
  circleOptions: CircleOptions
  onClick: (label: ButtonLabel) => void
}>): JSX.Element => {
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
            {children}
          </LargeActionButton>
        ) : (
          <ActionButton
            type="reset"
            data-state={state}
            className={highlighted ? 'current' : 'uncurrent'}
            onClick={handleClick}
          >
            {children}
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
