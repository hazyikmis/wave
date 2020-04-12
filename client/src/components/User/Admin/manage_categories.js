import React from "react";
import UserLayout from "../../../hoc/user_layout";
import ManageBrands from "./manage_brands";
import ManageWoods from "./manage_woods";

export const ManageCategories = () => {
  return (
    <UserLayout>
      <ManageBrands />
      <ManageWoods />
    </UserLayout>
  );
};
