import { AttenDance } from "@/components/attendance/AttenDanceClient";

type PageProps = {
  params: Promise<{
    room?: string;
  }>;
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function AttenDancePage({
  params,
  searchParams,
}: PageProps) {
  const { room } = await params;
  const { token } = await searchParams;

  const safeRoom = room?.toUpperCase() ?? "UNKNOWN";
  const safeToken = token ?? "";

  return (
    <main className="min-h-screen bg-neutral-100 flex items-center justify-center px-4">
      <AttenDance room={safeRoom} token={safeToken} />
    </main>
  );
}
