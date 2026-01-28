import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-950 mx-auto">LOGIN ก่อนนะจ๊ะ!</h1>
      <div>
        <LoginForm />
      </div>
    </div>
  );
}
