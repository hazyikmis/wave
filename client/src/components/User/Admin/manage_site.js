import React from "react";

import UserLayout from "../../../hoc/user_layout";

import UpdateSiteNfo from "./update_site_nfo";

export const ManageSite = () => {
  return (
    <UserLayout>
      <h1>Site info</h1>
      <UpdateSiteNfo />
    </UserLayout>
  );
};
