import { HRPeopleWorkplaceNavigator } from "../../components/HRPeopleWorkplaceNavigator";
import { UserModuleWorkspaceShell } from "../../components/UserModuleWorkspaceShell";

/** Department USER Module 12 only. Management Module12Page remains unchanged. */
export function UserModule12Page() {
  return (
    <UserModuleWorkspaceShell moduleId="12">
      <HRPeopleWorkplaceNavigator />
    </UserModuleWorkspaceShell>
  );
}
