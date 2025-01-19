import DashboardLayout from "./components/Dashboard";
import { Outlet } from "react-router";

export default function HomeAdmin() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
