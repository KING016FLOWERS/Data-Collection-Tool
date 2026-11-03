import { modules } from "../data/modules.js";

// The existing users.department column contains the module title, as saved by
// the Add User form. Match this to one of the 18 IDs without changing the schema.
function normalizedDepartment(value: string): string {
  return value.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase("en");
}

export function resolveDepartmentModule(department: string) {
  const selected = normalizedDepartment(department);
  return modules.find((module) => normalizedDepartment(module.title) === selected) ?? null;
}
