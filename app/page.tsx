"use client";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {router.back();}, []);
   //loop คนหลุดคอกลิกมา page นี้
  return <div className="flex justify-center items-center h-screen"> <LoadingSpinner /> </div>;
}
