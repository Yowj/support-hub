import LoginForm from "@/components/login-form";
import Image from "next/image";

export default function Login() {
  return (
    <main className="bg-background grid xl:grid-cols-2 grid-cols-1">
      <div className="container mx-auto ">
        <LoginForm />
      </div>
      <div className="hidden xl:block">
        <Image
          src={"/images/hero.jpg"}
          alt="hero.jpg"
          width={5376}
          height={3584}
          className="h-full object-cover"
        />
      </div>
    </main>
  );
}
