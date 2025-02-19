/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MySettings
// ====================================================

export interface MySettings_me_can {
  __typename: "UserCan";
  edit_profile_description: boolean | null;
}

export interface MySettings_me_settings {
  __typename: "MeSettings";
  receive_email: string | null;
  receive_tips_emails: boolean | null;
  exclude_from_indexes: boolean | null;
  receive_newsletter: boolean | null;
  show_nsfw: boolean | null;
}

export interface MySettings_me {
  __typename: "Me";
  id: number | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  slug: string | null;
  unconfirmed_email: string | null;
  bio: string | null;
  is_premium: boolean | null;
  home_path: string | null;
  can: MySettings_me_can | null;
  settings: MySettings_me_settings | null;
}

export interface MySettings {
  /**
   * The current logged in user
   */
  me: MySettings_me | null;
}
