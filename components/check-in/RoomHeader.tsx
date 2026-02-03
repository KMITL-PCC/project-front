type Props = {
  room: string;
};

export function RoomHeader({ room }: Props) {
  return (
    <div>
      <p className="text-sm font-semibold text-orange-500">
        CURRENT ROOM
        </p>
      <h2 className="text-5xl font-extrabold">
        {room}
        </h2>
    </div>
  );
}
