import { CheckInClient } from "@/components/attendance/CheckInClient";


type PageProps = {
  params: Promise<{
    room?: string;
  }>;
};

export default async function CheckInPage({ params }: PageProps) {
  const { room } = await params;

  const safeRoom = room?.toUpperCase() ?? "UNKNOWN";

  return (
    <main className="min-h-screen bg-neutral-100 flex items-center justify-center px-4">
      <CheckInClient room={safeRoom} />
    </main>
  );
}
