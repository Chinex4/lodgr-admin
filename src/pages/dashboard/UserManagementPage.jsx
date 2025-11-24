import React from "react";
import UserManagementStatsSection from "../../components/userManagement/sections/UserManagementStatsSection";
import UsersTableSection from "../../components/userManagement/sections/UsersTableSection";

function UserManagementPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-neutral-900">
        User Management
      </h2>
      <UserManagementStatsSection />
      <UsersTableSection />
    </div>
  );
}

export default UserManagementPage;
