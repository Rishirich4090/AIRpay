import { DashboardLayout } from "@/components/DashboardLayout";
import { UserProfile } from "@/components/UserProfile";

export default function Profile() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-in fade-in-0 slide-in-from-top-2 duration-500">
          <h2 className="text-2xl font-bold tracking-tight">User Profile</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Content */}
        <UserProfile />
      </div>
    </DashboardLayout>
  );
}
