import { redirect } from "next/navigation";

export default function Home() {
  const isLogin = false; // mock ก่อน

  if (!isLogin) {
    redirect("/login");
  }

  redirect("/");
}