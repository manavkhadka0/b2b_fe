 "use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function RosterEditRedirectPage() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const rawId = params?.id;
    if (!rawId) return;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    router.replace(`/jobs/roster/create?editId=${id}`);
  }, [params, router]);

  return null;
}
