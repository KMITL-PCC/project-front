"use client";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { StatusBadge } from "./StatusBadge";
import { StudentProfile } from "./StudentProfile";
import { RoomHeader } from "./RoomHeader";
import { PrivacyModal } from "./PrivacyModal";
import { CheckStatusModal } from "../checkin/checkinnn";
import { useRouter } from "next/navigation";
import { getMe, scanQR, confirmAction, User, QRAction } from "@/lib/api";

type Props = {
  room: string;
  token: string;
};

type Status = "pending" | "checked_in" | "checked_out" | "error";

export function AttenDance({ room, token }: Props) {
  const router = useRouter();

  // ── UI State ──────────────────────────────────────────────────────────────
  const [status, setStatus] = useState<Status>("pending");
  const [time, setTime] = useState("");
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"checkin" | "checkout">("checkin");
  const [isRedirecting, setIsRedirecting] = useState(false);

  // ── Data State ────────────────────────────────────────────────────────────
  const [user, setUser] = useState<User | null>(null);
  const [pendingAction, setPendingAction] = useState<QRAction>("CHECK_IN");

  // ── Loading / Error State ─────────────────────────────────────────────────
  const [initLoading, setInitLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Clock ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ── Init: GET /api/auth/me → POST /api/qrcode/scan ───────────────────────
  useEffect(() => {
    const init = async () => {
      try {
        setInitLoading(true);
        setError(null);

        // 1. ดึงข้อมูลนักศึกษาที่ login อยู่
        const meData = await getMe();
        setUser(meData.user);

        // 2. ตรวจสอบว่ามี token หรือเปล่า
        if (!token) {
          setError("QR Code ไม่ถูกต้อง กรุณาสแกนใหม่อีกครั้ง");
          return;
        }

        // 3. POST /api/qrcode/scan → ระบบบอกว่าต้องทำ action อะไร
        const scan = await scanQR(token, meData.user.StudentId);
        setPendingAction(scan.action);

        // CHECK_OUT = เช็คอินอยู่แล้ว → แสดงปุ่ม CHECK-OUT
        // CHECK_IN / SWAP = ยังไม่ได้เช็คอิน → แสดงปุ่ม CHECK-IN
        if (scan.action === "CHECK_OUT") {
          setStatus("checked_in");
        } else {
          setStatus("pending");
        }
      } catch (err: any) {
        if (err.message === "Unauthorized") {
          router.push("/login");
          return;
        }
        setError(err.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      } finally {
        setInitLoading(false);
      }
    };

    init();
  }, [token]);

  // ── Handle CHECK-IN / CHECK-OUT button: POST /api/qrcode/action ──────────
  const handleAction = async () => {
    if (!user || !token) return;

    try {
      setActionLoading(true);
      setError(null);

      await confirmAction(pendingAction, user.StudentId, token);

      if (pendingAction === "CHECK_IN" || pendingAction === "SWAP") {
        setStatus("checked_in");
        setModalType("checkin");
      } else {
        setStatus("checked_out");
        setModalType("checkout");
      }

      setIsModalOpen(true);
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาด กรุณาสแกน QR ใหม่อีกครั้ง");
    } finally {
      setActionLoading(false);
    }
  };

  // ── Derived values ────────────────────────────────────────────────────────
  const buttonLabel =
    status === "pending"
      ? "CHECK-IN →"
      : status === "checked_in"
        ? "CHECK-OUT →"
        : "DONE";

  const title =
    status === "checked_in"
      ? "Check-out"
      : status === "checked_out"
        ? "Completed"
        : "Check-in";

  const studentName = user ? `${user.fname} ${user.lname}` : "";
  const studentId = user?.StudentId ?? "";
  const avatarUrl = user?.img ?? "/avatar.png";

  // ── Loading Screen (init หรือ redirect) ──────────────────────────────────
  if (initLoading || isRedirecting) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // ── Main UI ───────────────────────────────────────────────────────────────
  return (
    <section className="w-full max-w-sm space-y-4">
      <h1 className="text-center text-lg font-semibold text-black">{title}</h1>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl text-center">
          {error}
        </div>
      )}

      <Card className="rounded-3xl shadow-xl">
        <CardContent className="p-6 text-center space-y-4 text-black">
          <RoomHeader room={room} />

          <StudentProfile
            name={studentName}
            studentId={studentId}
            avatarUrl={avatarUrl}
          />

          <div className="grid grid-cols-2 gap-6 pt-6">
            <StatusBadge label="STATUS" value={status} status={status} />
            <StatusBadge label="TIME" value={time} />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Policy Checkbox */}
      <div className="flex items-start gap-2 text-sm text-gray-500">
        <input
          type="checkbox"
          checked={acceptedPolicy}
          onChange={(e) => setAcceptedPolicy(e.target.checked)}
          className="mt-1"
        />
        <p>
          Please read and accept the <PrivacyModal /> to continue
        </p>
      </div>

      {/* Action Button */}
      <button
        disabled={
          !acceptedPolicy ||
          status === "checked_out" ||
          actionLoading ||
          !!error
        }
        onClick={handleAction}
        className="
          w-full rounded-xl py-3 font-semibold text-white
          bg-kmitl hover:bg-orange-500 active:bg-orange-600
          disabled:bg-orange-300 disabled:cursor-not-allowed
          transition flex items-center justify-center
        "
      >
        {actionLoading ? <LoadingSpinner /> : buttonLabel}
      </button>

      {/* Check Status Modal */}
      <CheckStatusModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          if (status === "checked_out") {
            setIsRedirecting(true);
            setTimeout(() => {
              router.push("/SP");
            }, 1000);
          }
        }}
        type={modalType}
        room={room}
        time={time}
        studentName={studentName}
      />
    </section>
  );
}
