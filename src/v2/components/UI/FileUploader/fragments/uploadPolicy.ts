import gql from 'graphql-tag'

export default gql`
  fragment UploadPolicy on Me {
    __typename
    id
    policy {
      __typename
      AWSAccessKeyId
      acl
      bucket
      expires
      key
      policy
      signature
      success_action_status
    }
  }
`
