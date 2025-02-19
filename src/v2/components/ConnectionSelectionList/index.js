import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { debounce, isEmpty } from 'underscore'

import { __outlineBorder__ } from 'v2/styles/mixins'

import { Input } from 'v2/components/UI/Inputs'
import Text from 'v2/components/UI/Text'
import RecentChannels from 'v2/components/ConnectionSelectionList/components/RecentChannels'
import SearchedChannels from 'v2/components/ConnectionSelectionList/components/SearchedChannels'

const Container = styled.div`
  position: relative;

  ${x =>
    x.mode === 'active' &&
    x.isOutlined &&
    `
    &:after {
      ${__outlineBorder__()}
    }
  `}
`

const SearchInput = styled(Input).attrs({
  f: 1,
  placeholder: 'Type channel name',
  autoFocus: true,
})`
  &,
  &:focus {
    border: 1px solid ${x => x.theme.colors.gray.regular} !important;
  }
`

const OutlinedRecentChannels = styled(RecentChannels)`
  position: relative;

  ${x =>
    x.isOutlined &&
    `
    &:after {
      ${__outlineBorder__()}
    }
  `}
`

export default class ConnectionSelectionList extends Component {
  static propTypes = {
    isOutlined: PropTypes.bool,
    onConnectionSelection: PropTypes.func,
  }

  static defaultProps = {
    isOutlined: true,
    onConnectionSelection: () => {},
  }

  state = {
    query: '',
    debouncedQuery: '',
    mode: 'resting',
  }

  handleChange = ({ target: { value: query } }) => {
    const mode = isEmpty(query) ? 'resting' : 'active'
    this.setState({ mode, query })
    this.debouceQuery(query)
  }

  debouceQuery = debounce(debouncedQuery => {
    this.setState({ debouncedQuery })
  }, 200)

  render() {
    const { debouncedQuery, mode } = this.state
    const { isOutlined, onConnectionSelection } = this.props

    return (
      <Container mode={mode} isOutlined={isOutlined}>
        <SearchInput onChange={this.handleChange} />

        {mode === 'resting' && (
          <>
            <Text f={1} py={4} px={5} textAlign="center" color="gray.medium">
              Recent channels
            </Text>

            <OutlinedRecentChannels
              isOutlined={isOutlined}
              onConnectionSelection={onConnectionSelection}
            />
          </>
        )}
        {mode === 'active' && (
          <>
            <SearchedChannels
              query={debouncedQuery}
              onConnectionSelection={onConnectionSelection}
            />
          </>
        )}
      </Container>
    )
  }
}
