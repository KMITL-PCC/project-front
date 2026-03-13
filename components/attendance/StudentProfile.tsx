import Image from "next/image";

type Props = {
  firstName: string | null;
  lastName: string | null;
  studentId: string;
  avatarUrl: string;
  isLoading?: boolean;
};

export function StudentProfile({
  firstName,
  lastName,
  studentId,
  avatarUrl,
  isLoading = false,
}: Props) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative h-20 w-20 rounded-full overflow-hidden border-4 border-white shadow">
        <Image
          src={avatarUrl}
          alt={`${firstName} ${lastName}`}
          fill
          sizes="80px"
          className="object-cover"
          priority
        />
      </div>

      <div className="text-center">
        <p className="font-semibold text-lg">
          {isLoading
            ? "Loading..."
            : `${firstName} ${lastName ? lastName : ""}`}
        </p>
        <p className="text-sm text-gray-500">Student ID : {studentId}</p>
      </div>
    </div>
  );
}
