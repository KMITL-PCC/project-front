"use client";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

// import { redirect } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {router.back();}, []);
  // redirect("/teacher-login"); //เปลี่ยนเป็นหน้า Login แทน (เอาไว้หลีกเลี่ยงปัญหาคนหลุดคอกลิกมา page นี้)
  //  loop คนหลุดคอกลิกมา page นี้
  return <div className="flex justify-center items-center h-screen"> <LoadingSpinner /> </div>;
  // return null; //ไม่ต้องแสดงอะไรเลย เพราะ redirect ไปหน้าอื่นแล้ว
}
