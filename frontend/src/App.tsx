import { Navigate, Route, Routes } from "react-router-dom";
import { CommonLayout } from "./layouts/CommonLayout";
import { ManagementLayout } from "./layouts/ManagementLayout";
import { DepartmentLayout } from "./layouts/DepartmentLayout";
import { AuthProvider } from "./auth/AuthContext";
import { AssignedUserModuleRoute, PublicOnly, RequireAuth, RequireDepartment, RequireTopManagement, RequireMainAdmin } from "./auth/RequireAuth";
import { DashboardPage } from "./pages/DashboardPage";
import { HomePage } from "./pages/HomePage";
import { UsersPage } from "./pages/UsersPage";
import { TopManagementRegistrationPage } from "./pages/TopManagementRegistrationPage";
import { MainAdminPage } from "./pages/MainAdminPage";
import { TopManagementProfilePage } from "./pages/TopManagementProfilePage";
import { Module01Page } from "./pages/modules/Module01Page";
import { Module02Page } from "./pages/modules/Module02Page";
import { Module03Page } from "./pages/modules/Module03Page";
import { Module04Page } from "./pages/modules/Module04Page";
import { Module05Page } from "./pages/modules/Module05Page";
import { Module06Page } from "./pages/modules/Module06Page";
import { Module07Page } from "./pages/modules/Module07Page";
import { Module08Page } from "./pages/modules/Module08Page";
import { Module09Page } from "./pages/modules/Module09Page";
import { Module10Page } from "./pages/modules/Module10Page";
import { Module11Page } from "./pages/modules/Module11Page";
import { Module12Page } from "./pages/modules/Module12Page";
import { Module13Page } from "./pages/modules/Module13Page";
import { Module14Page } from "./pages/modules/Module14Page";
import { Module15Page } from "./pages/modules/Module15Page";
import { Module16Page } from "./pages/modules/Module16Page";
import { Module17Page } from "./pages/modules/Module17Page";
import { Module18Page } from "./pages/modules/Module18Page";
import { UserModule01Page } from "./pages/user-modules/UserModule01Page";
import { UserModule02Page } from "./pages/user-modules/UserModule02Page";
import { UserModule03Page } from "./pages/user-modules/UserModule03Page";
import { UserModule04Page } from "./pages/user-modules/UserModule04Page";
import { UserModule05Page } from "./pages/user-modules/UserModule05Page";
import { UserModule06Page } from "./pages/user-modules/UserModule06Page";
import { UserModule07Page } from "./pages/user-modules/UserModule07Page";
import { UserModule08Page } from "./pages/user-modules/UserModule08Page";
import { UserModule09Page } from "./pages/user-modules/UserModule09Page";
import { UserModule10Page } from "./pages/user-modules/UserModule10Page";
import { UserModule11Page } from "./pages/user-modules/UserModule11Page";
import { UserModule12Page } from "./pages/user-modules/UserModule12Page";
import { UserModule13Page } from "./pages/user-modules/UserModule13Page";
import { UserModule14Page } from "./pages/user-modules/UserModule14Page";
import { UserModule15Page } from "./pages/user-modules/UserModule15Page";
import { UserModule16Page } from "./pages/user-modules/UserModule16Page";
import { UserModule17Page } from "./pages/user-modules/UserModule17Page";
import { UserModule18Page } from "./pages/user-modules/UserModule18Page";

/** Management and departmental users never render each other's page components. */
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<CommonLayout />}>
          <Route element={<PublicOnly />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/register/top-management" element={<TopManagementRegistrationPage />} />
          </Route>
          <Route element={<RequireAuth />}>
            <Route element={<RequireMainAdmin />}><Route path="/admin" element={<MainAdminPage />} /></Route>
            {/* EXISTING TOP MANAGEMENT AREA: routes, link targets and pages remain unchanged. */}
            <Route element={<RequireTopManagement />}>
              <Route element={<ManagementLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/profile" element={<TopManagementProfilePage />} />
                <Route path="/modules/01" element={<Module01Page />} />
                <Route path="/modules/02" element={<Module02Page />} />
                <Route path="/modules/03" element={<Module03Page />} />
                <Route path="/modules/04" element={<Module04Page />} />
                <Route path="/modules/05" element={<Module05Page />} />
                <Route path="/modules/06" element={<Module06Page />} />
                <Route path="/modules/07" element={<Module07Page />} />
                <Route path="/modules/08" element={<Module08Page />} />
                <Route path="/modules/09" element={<Module09Page />} />
                <Route path="/modules/10" element={<Module10Page />} />
                <Route path="/modules/11" element={<Module11Page />} />
                <Route path="/modules/12" element={<Module12Page />} />
                <Route path="/modules/13" element={<Module13Page />} />
                <Route path="/modules/14" element={<Module14Page />} />
                <Route path="/modules/15" element={<Module15Page />} />
                <Route path="/modules/16" element={<Module16Page />} />
                <Route path="/modules/17" element={<Module17Page />} />
                <Route path="/modules/18" element={<Module18Page />} />
              </Route>
            </Route>
            {/* NEW DEPARTMENT USER AREA: independently editable pages; no TM sidebar or modules. */}
            <Route element={<RequireDepartment />}>
              <Route element={<DepartmentLayout />}>
                <Route path="/user/modules/01" element={<AssignedUserModuleRoute moduleId="01"><UserModule01Page /></AssignedUserModuleRoute>} />
                <Route path="/user/modules/02" element={<AssignedUserModuleRoute moduleId="02"><UserModule02Page /></AssignedUserModuleRoute>} />
                <Route path="/user/modules/03" element={<AssignedUserModuleRoute moduleId="03"><UserModule03Page /></AssignedUserModuleRoute>} />
                <Route path="/user/modules/04" element={<AssignedUserModuleRoute moduleId="04"><UserModule04Page /></AssignedUserModuleRoute>} />
                <Route path="/user/modules/05" element={<AssignedUserModuleRoute moduleId="05"><UserModule05Page /></AssignedUserModuleRoute>} />
                <Route path="/user/modules/06" element={<AssignedUserModuleRoute moduleId="06"><UserModule06Page /></AssignedUserModuleRoute>} />
                <Route path="/user/modules/07" element={<AssignedUserModuleRoute moduleId="07"><UserModule07Page /></AssignedUserModuleRoute>} />
                <Route path="/user/modules/08" element={<AssignedUserModuleRoute moduleId="08"><UserModule08Page /></AssignedUserModuleRoute>} />
                <Route path="/user/modules/09" element={<AssignedUserModuleRoute moduleId="09"><UserModule09Page /></AssignedUserModuleRoute>} />
                <Route path="/user/modules/10" element={<AssignedUserModuleRoute moduleId="10"><UserModule10Page /></AssignedUserModuleRoute>} />
                <Route path="/user/modules/11" element={<AssignedUserModuleRoute moduleId="11"><UserModule11Page /></AssignedUserModuleRoute>} />
                <Route path="/user/modules/12" element={<AssignedUserModuleRoute moduleId="12"><UserModule12Page /></AssignedUserModuleRoute>} />
                <Route path="/user/modules/13" element={<AssignedUserModuleRoute moduleId="13"><UserModule13Page /></AssignedUserModuleRoute>} />
                <Route path="/user/modules/14" element={<AssignedUserModuleRoute moduleId="14"><UserModule14Page /></AssignedUserModuleRoute>} />
                <Route path="/user/modules/15" element={<AssignedUserModuleRoute moduleId="15"><UserModule15Page /></AssignedUserModuleRoute>} />
                <Route path="/user/modules/16" element={<AssignedUserModuleRoute moduleId="16"><UserModule16Page /></AssignedUserModuleRoute>} />
                <Route path="/user/modules/17" element={<AssignedUserModuleRoute moduleId="17"><UserModule17Page /></AssignedUserModuleRoute>} />
                <Route path="/user/modules/18" element={<AssignedUserModuleRoute moduleId="18"><UserModule18Page /></AssignedUserModuleRoute>} />
              </Route>
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
