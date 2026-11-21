"use client";

/* eslint-disable @next/next/no-img-element -- a provider profile photo, shown as it is */
import { useState, type ReactNode } from "react";

// The signed-in person's profile picture, or what is passed as the
// fallback (their initials) when they have none or it does not load.
export function UserAvatar({
  fallback,
  image,
}: {
  fallback: ReactNode;
  image: string | null | undefined;
}) {
  const [failed, setFailed] = useState<string | null>(null);

  if (!image || failed === image) {
    return <>{fallback}</>;
  }

  return (
    <img
      alt=""
      className="size-full rounded-full object-cover"
      height={40}
      onError={() => setFailed(image)}
      // Google serves profile photos only without a referrer from other sites.
      referrerPolicy="no-referrer"
      src={image}
      width={40}
    />
  );
}
