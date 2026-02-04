type Props = {
  room: string;
};

export function RoomHeader({ room }: Props) {
  return (
    <div>
      <p className="text-lg font-semibold text-kmitl">
        CURRENT ROOM
        </p>
      <h2 className="text-8xl font-extrabold">
        {room}
        </h2>
    </div>
  );
}
