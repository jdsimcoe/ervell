import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { isEmpty, debounce, pick, omit } from 'underscore'

import compactObject from 'v2/util/compactObject'

import Box, { BoxProps } from 'v2/components/UI/Box'
import Icons from 'v2/components/UI/Icons'
import { Input } from 'v2/components/UI/Inputs'

const OUTER_PROPS_KEYS = ['m', 'mt', 'mr', 'mb', 'ml', 'mx', 'my', 'flex']

export const ICON_OFFSET = '3.125em'

const Container = styled(Box)`
  position: relative;
`

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: ${ICON_OFFSET};
  cursor: pointer;
`

interface IconMap {
  resting: string
  focus: string
  hover: string
  active: string
}

interface Props extends BoxProps {
  query?: string
  onFocus?: () => any
  onBlur?: () => any
  onQueryChange?: (props: any) => any
  onDebouncedQueryChange?: (props: any) => any
  debounceWait?: number
  forwardedRef?: any
  iconMap?: IconMap
  placeholder?: string
}

interface State {
  mode: string
  query: string
}

class SearchInput extends PureComponent<Props, State> {
  static defaultProps = {
    query: '',
    onFocus: () => {},
    onBlur: () => {},
    onQueryChange: () => {},
    onDebouncedQueryChange: () => {},
    debounceWait: 250,
    forwardedRef: null,
    iconMap: {
      resting: 'MagnifyingGlass',
      hover: 'MagnifyingGlass',
      focus: 'MagnifyingGlass',
      active: 'X',
    },
  }

  handleDebouncedQueryChange: (props: any) => any
  input: any

  constructor(props: Props) {
    super(props)

    const { debounceWait, onDebouncedQueryChange } = props

    this.handleDebouncedQueryChange = debounce(
      onDebouncedQueryChange,
      debounceWait
    )

    this.state = {
      mode: props.query && props.query !== '' ? 'active' : 'resting',
      query: props.query,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (isEmpty(nextProps.query) && !isEmpty(this.state.query)) {
      this.resetState()
    }
  }

  resetState = () => {
    this.setState({ query: '', mode: 'focus' })
    this.input.value = ''
    this.input.focus()
  }

  handleMouseEnter = () => {
    if (this.state.mode === 'focus') return
    if (this.state.mode === 'active') return
    this.setState({ mode: 'hover' })
  }

  handleMouseLeave = () => {
    if (this.state.mode === 'focus') return
    if (this.state.mode === 'active') return
    this.setState({ mode: 'resting' })
  }

  handleFocus = () => {
    this.props.onFocus()
    if (this.state.mode === 'active') return
    this.setState({ mode: 'focus' })
  }

  handleBlur = () => {
    this.props.onBlur()
    if (this.state.mode === 'active') return
    this.setState({ mode: 'resting' })
  }

  handleChange = ({ target: { value: query } }) => {
    const currentState = { query, mode: 'active' }

    if (isEmpty(query)) {
      currentState.mode = 'focus'
    }

    this.setState(currentState)
    this.props.onQueryChange(query)
    this.handleDebouncedQueryChange(query)
  }

  handleReset = () => {
    this.resetState()
    this.props.onQueryChange('')
    this.props.onDebouncedQueryChange('')
  }

  render() {
    const {
      query: _query,
      onFocus,
      onBlur,
      onQueryChange: _onQueryChange,
      onDebouncedQueryChange: _onDebouncedQueryChange,
      debounceWait: _debounceWait,
      forwardedRef,
      iconMap,
      ...rest
    } = this.props

    const { mode, query } = this.state

    const outerProps = compactObject(pick(rest, ...OUTER_PROPS_KEYS))
    const innerProps = omit(rest, ...OUTER_PROPS_KEYS)

    return (
      <Container
        ref={forwardedRef}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        {...outerProps}
      >
        {iconMap[mode] && (
          <Icon onClick={this.handleReset}>
            <Icons
              width="1.5em"
              height="0.88em"
              color="gray.medium"
              name={iconMap[mode]}
            />
          </Icon>
        )}

        <Input
          width="100%"
          px={ICON_OFFSET}
          borderColor="gray.regular"
          {...innerProps}
          ref={input => {
            this.input = input
          }}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          defaultValue={query}
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </Container>
    )
  }
}

export default React.forwardRef((props: Props, ref) => (
  // @ts-ignore
  <SearchInput forwardedRef={ref} {...props} />
))
