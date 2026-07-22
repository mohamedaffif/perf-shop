import { auth } from "@/auth";
import { ProfileForm } from "@/components/account/ProfileForm";
import { getProfile } from "@/domain/auth";

export default async function AccountProfilePage() {
  const session = await auth();
  const profile = await getProfile(session!.user.id);

  return <ProfileForm profile={profile} />;
}
