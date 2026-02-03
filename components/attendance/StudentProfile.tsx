
import Image from "next/image";

type Props = {
  name: string;
  studentId: string;
  avatarUrl: string;
};

export function StudentProfile({ name, studentId, avatarUrl }: Props) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative h-20 w-20 rounded-full overflow-hidden border-4 border-white shadow">
        <Image
          src={avatarUrl}
          alt={name}
          fill
          sizes="80px"
          className="object-cover"
          priority
        />
      </div>

      <div className="text-center">
        <p className="font-semibold text-lg">
            {name}
        </p>
        <p className="text-sm text-gray-500">
            Student ID : {studentId}
        </p>
      </div>
    </div>
  );
}
