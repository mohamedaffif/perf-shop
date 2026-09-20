import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string | null;
  email: string;
  image: string | null;
  className?: string;
}

function getInitials(name: string | null, email: string): string {
  const source = name?.trim() || email;
  const parts = source.split(/\s+/).filter(Boolean);
  const letters =
    parts.length > 1 ? parts[0].charAt(0) + parts[parts.length - 1].charAt(0) : source.slice(0, 2);

  return letters.toUpperCase();
}

export function UserAvatar({ name, email, image, className }: UserAvatarProps) {
  return (
    <Avatar className={cn("border-border border", className)}>
      {/* Google profile photos can 403 when a referrer is sent. */}
      {image && <AvatarImage src={image} alt="" referrerPolicy="no-referrer" />}
      <AvatarFallback>{getInitials(name, email)}</AvatarFallback>
    </Avatar>
  );
}
