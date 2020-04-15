import React from "react";
import UserLayout from "../../hoc/user_layout";
import UpdatePersonalNfo from "./update_personal_nfo";

export const UpdateUserProfile = () => {
  return (
    <UserLayout>
      <h1>Profile</h1>
      <UpdatePersonalNfo />
    </UserLayout>
  );
};
