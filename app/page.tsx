import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/teacher-login");
}

export default function Home() {
  const isLogin = false; // mock ก่อน

  if (!isLogin) {
    redirect("/teacher-login");
  }

  redirect("/");
}
