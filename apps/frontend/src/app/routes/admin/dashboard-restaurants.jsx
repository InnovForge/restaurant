import { Outlet } from "react-router";
import DashboardLayout from "./components/Dashboard";

export default function HomeAdmin() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
