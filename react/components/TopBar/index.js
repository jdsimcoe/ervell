import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Box from 'react/components/UI/Box';
import PrimarySearch from 'react/components/TopBar/components/PrimarySearch';
import AuthenticationLinks from 'react/components/TopBar/components/AuthenticationLinks';
import NewChannelButton from 'react/components/TopBar/components/NewChannelButton';
import NotificationCount from 'react/components/TopBar/components/NotificationCount';
import MyRepresentation from 'react/components/TopBar/components/MyRepresentation';

import WithSerializedMe from 'react/hocs/WithSerializedMe';

const Container = styled(Box)`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;

  ${props => props.scheme === 'GROUP' && `
    background-color: ${props.theme.colors.gray.hint};

    &:after {
      position: absolute;
      display: block;
      content: '';
      pointer-events: none;
      width: 100%;
      height: 0.8125em;
      right: 0;
      bottom: 0;
      left: 0;
      background: linear-gradient(to bottom,
        ${props.theme.colors.utility.transparent} 0%,
        rgba(0, 0, 0, 0.02) 100%);
    }
  `}
`;

class TopBar extends PureComponent {
  static propTypes = {
    scheme: PropTypes.oneOf(['DEFAULT', 'GROUP']),
    serializedMe: PropTypes.shape({
      id: PropTypes.number,
    }),
  }

  static defaultProps = {
    scheme: 'DEFAULT',
    serializedMe: null,
  }

  render() {
    const { serializedMe: me, scheme, ...rest } = this.props;

    return (
      <Container scheme={scheme} {...rest}>
        <PrimarySearch flex={1} scheme={scheme} />

        {me
          ? (
            <React.Fragment>
              <NewChannelButton py={4} pl={6} />
              <NotificationCount py={3} px={6} me={me} />
              <MyRepresentation pr={6} me={me} />
            </React.Fragment>
          )
          : <AuthenticationLinks px={6} />
        }
      </Container>
    );
  }
}

export default WithSerializedMe(TopBar);
