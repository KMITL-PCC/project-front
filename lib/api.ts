// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  StudentId: string;
  fname: string;
  lname: string;
  nickname: string;
  roleId: string;
  role: { name: string };
  majorId: string;
  major: { name: string };
  img: string | null;
  phone: string;
  email: string;
  gen: string;
}

export type QRAction = "CHECK_IN" | "CHECK_OUT" | "SWAP";

export interface ScanResult {
  success: boolean;
  action: QRAction;
  currentSession: {
    id: number;
    StudentId: string;
    roomCode: string;
    checkIn: string;
    checkOut: string | null;
  } | null;
  metadata: {
    class_session_id: number;
    subject_id: number;
    startTime: string;
    endTime: string;
    roomCode: string;
    roomDesc: string;
    studentName: string;
  };
}

export interface ActionResult {
  success: boolean;
  message: string;
  action: QRAction;
}

// ─── API Functions ─────────────────────────────────────────────────────────────

/** ดึงข้อมูล user ที่ login อยู่ */
export async function getMe(): Promise<{ user: User }> {
  const res = await fetch("/api/auth/me", {
    credentials: "include",
  });

  if (res.status === 401) throw new Error("Unauthorized");
  if (!res.ok) throw new Error("Failed to fetch user");

  return res.json();
}

/** สแกน QR Token → ระบบบอกว่าต้องทำ action อะไร (CHECK_IN / CHECK_OUT / SWAP) */
export async function scanQR(
  token: string,
  studentId: string,
): Promise<ScanResult> {
  const res = await fetch("/api/qrcode/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ token, studentId }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as any).error || "Invalid or expired QR code");
  }

  return res.json();
}

/** ยืนยัน action → บันทึก CHECK_IN / CHECK_OUT / SWAP ลง DB จริง */
export async function confirmAction(
  action: QRAction,
  studentId: string,
  token: string,
  isGuest = false,
): Promise<ActionResult> {
  const res = await fetch("/api/qrcode/action", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ action, studentId, token, isGuest }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as any).error || "Action failed. Please scan again.");
  }

  return res.json();
}
