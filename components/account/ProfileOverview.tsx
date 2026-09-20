import { UserAvatar } from "@/components/account/UserAvatar";
import { Badge } from "@/components/ui/badge";
import type { AccountProfile } from "@/domain/auth/auth.types";

const PROVIDER_LABELS: Record<string, string> = {
  google: "Google",
  github: "GitHub",
};

function getSignInMethods(profile: AccountProfile): string {
  const methods = profile.providers.map((provider) => PROVIDER_LABELS[provider] ?? provider);

  if (profile.hasPassword) {
    methods.unshift("Email & password");
  }

  return methods.join(", ");
}

export function ProfileOverview({ profile }: { profile: AccountProfile }) {
  const memberSince = new Date(profile.createdAt).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const signInMethods = getSignInMethods(profile);

  return (
    <div className="border-border flex max-w-md items-center gap-4 rounded-lg border p-6">
      <UserAvatar
        name={profile.name}
        email={profile.email}
        image={profile.image}
        className="size-16"
      />

      <div className="min-w-0 space-y-1">
        <p className="text-foreground truncate text-lg font-medium">
          {profile.name ?? "Your account"}
        </p>
        <p className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
          <span className="truncate">{profile.email}</span>
          {profile.emailVerified && <Badge variant="success">Verified</Badge>}
        </p>
        <p className="text-muted-foreground text-xs">
          Member since {memberSince}
          {signInMethods && ` · Signs in with ${signInMethods}`}
        </p>
      </div>
    </div>
  );
}
