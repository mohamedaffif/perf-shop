import { auth } from "@/auth";
import { ChangePasswordForm } from "@/components/account/ChangePasswordForm";
import { ProfileForm } from "@/components/account/ProfileForm";
import { ProfileOverview } from "@/components/account/ProfileOverview";
import { getProfile } from "@/domain/auth";

export default async function AccountProfilePage() {
  const session = await auth();
  const profile = await getProfile(session!.user.id);

  return (
    <div className="space-y-6">
      <ProfileOverview profile={profile} />
      <ProfileForm profile={profile} />
      {profile.hasPassword ? (
        <ChangePasswordForm />
      ) : (
        <p className="text-muted-foreground max-w-md text-sm">
          Your account uses social sign-in, so there&apos;s no password to change.
        </p>
      )}
    </div>
  );
}
