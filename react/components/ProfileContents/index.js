import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

import constants from 'react/styles/constants';

import profileContentsQuery from 'react/components/ProfileContents/queries/profileContents';

import ErrorAlert from 'react/components/UI/ErrorAlert';
import SearchInput from 'react/components/UI/SearchInput';
import BlocksLoadingIndicator from 'react/components/UI/BlocksLoadingIndicator';
import Grid from 'react/components/UI/Grid';
import Cell from 'react/components/Cell';

export default class ProfileContents extends PureComponent {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string,
    sort: PropTypes.oneOf(['UPDATED_AT', 'RANDOM']).isRequired,
    fetchPolicy: PropTypes.oneOf(['cache-first', 'network-only']).isRequired,
    seed: PropTypes.number.isRequired,
  }

  static defaultProps = {
    type: null,
  }

  state = {
    page: 1,
    per: 12,
    hasMore: true,
    q: null,
  }

  resetQuery = (query) => {
    const q = query === '' ? null : query;
    this.setState({ q, page: 1, hasMore: true });
  }

  loadMore = fetchMore => () => {
    const { page, per } = this.state;

    fetchMore({
      variables: { page: page + 1, per },
      updateQuery: (prevResult, { fetchMoreResult }) => ({
        ...prevResult,
        identity: {
          ...prevResult.identity,
          identifiable: {
            ...prevResult.identity.identifiable,
            contents: [
              ...prevResult.identity.identifiable.contents,
              ...fetchMoreResult.identity.identifiable.contents,
            ],
          },
        },
      }),
    }).then(({ errors, data }) => {
      const { identity: { identifiable: { contents: { length } } } } = data;
      const hasMore = !errors && length > 0 && length >= per;

      this.setState({
        page: page + 1,
        hasMore,
      });
    });
  }

  render() {
    const { per, hasMore, q } = this.state;
    const {
      id, type, sort, fetchPolicy, seed,
    } = this.props;

    return (
      <Query
        query={profileContentsQuery}
        variables={{
          id, type, per, sort, q, seed,
        }}
        fetchPolicy={fetchPolicy}
      >
        {({
          loading, error, data, fetchMore,
        }) => {
          if (error) {
            return (
              <ErrorAlert>
                {error.message}
              </ErrorAlert>
            );
          }

          if (!data.identity) {
            return <BlocksLoadingIndicator />;
          }

          const { identity: { identifiable: { name, contents } } } = data;

          return (
            <div>
              <SearchInput
                query={q}
                onDebouncedQueryChange={this.resetQuery}
                placeholder={`Filter ${name}’s ${{ BLOCK: 'blocks' }[type] || 'blocks and channels'}`}
                mb={6}
                mr={[
                  constants.blockGutter,
                  constants.doubleBlockGutter,
                  constants.doubleBlockGutter,
                ]}
                ml={[constants.blockGutter, 0, 0]}
                borderColor="transparent"
              />

              {loading &&
                <BlocksLoadingIndicator />
              }

              {!loading && contents.length > 0 &&
                <Grid
                  pageStart={1}
                  threshold={800}
                  initialLoad={false}
                  loader={<BlocksLoadingIndicator key="loading" />}
                  hasMore={contents.length >= per && hasMore}
                  loadMore={this.loadMore(fetchMore)}
                >
                  {contents.map(blokk => (
                    <Cell.Konnectable
                      key={`${blokk.__typename}_${blokk.id}`}
                      konnectable={blokk}
                      context={contents}
                    />
                  ))}
                </Grid>
              }
            </div>
          );
        }}
      </Query>
    );
  }
}
