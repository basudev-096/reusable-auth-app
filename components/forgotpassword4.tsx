"use client";

import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import AlertGradient from "@/components/shadcn-space/alert/alert-06";
import Component from "@/components/inputotp2";
import { useRouter } from "next/navigation";

type Alert = {
  title: string;
  description: string;
  type: "error" | "success";
};

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState<Alert | null>(null);
  const router = useRouter();

  const handleRequestOtp = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAlert(null);
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "forget-password",
    });

    if (error) {
      setAlert({
        title: "Error",
        description: error.message || "Failed to request OTP",
        type: "error",
      });
    } else {
      setAlert({
        title: "OTP Sent",
        description: "Password reset OTP sent to your email.",
        type: "success",
      });
      setStep("reset");
    }
  };

  const handleResetPassword = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAlert(null);
    const { error } = await authClient.emailOtp.resetPassword({
      email,
      otp,
      password,
    });

    if (error) {
      setAlert({
        title: "Error",
        description: error.message || "Failed to reset password",
        type: "error",
      });
    } else {
      setAlert({
        title: "Success",
        description: "Password reset successfully. Redirecting to login...",
        type: "success",
      });
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  const handleResendOtp = async () => {
    setAlert(null);
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "forget-password",
    });

    if (error) {
      setAlert({
        title: "Error",
        description: error.message || "Failed to request OTP",
        type: "error",
      });
    } else {
      setAlert({
        title: "OTP Sent",
        description: "A new password reset OTP has been sent to your email.",
        type: "success",
      });
    }
  };

  return (
    <>
      {alert && <AlertGradient {...alert} />}
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Left Panel */}
        <div className="relative hidden lg:block lg:w-1/2">
          <img
            loading="lazy"
            decoding="async"
            src="https://images.unsplash.com/photo-1698044048234-2e7f6c4e6aca?q=80&w=1000&auto=format"
            alt="Blog Post Image"
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background/80 to-background/20" />
        </div>

        {/* Right Panel (Form) */}
        <div className="flex w-full items-center justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div className="flex flex-col items-center">
              <Logo />
              <h2 className="mt-6 text-center text-2xl font-extrabold text-foreground">
                {step === "request" ? "Forgot Password?" : "Reset Password"}
              </h2>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                {step === "request"
                  ? "Enter the email associated with your account and we'll send you an OTP to reset your password."
                  : `Enter the OTP sent to ${email} and your new password.`}
              </p>
            </div>

            {step === "request" ? (
              <form className="space-y-6" onSubmit={handleRequestOtp}>
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="mt-1"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Send OTP
                </Button>

                <div className="flex items-center justify-center">
                  <Link href="/login" className="text-sm text-primary hover:underline">
                    Back to Login
                  </Link>
                </div>
              </form>
            ) : (
              <form className="space-y-6" onSubmit={handleResetPassword}>
                <div className="flex flex-col items-center gap-2">
                  <Label>Verification OTP</Label>
                  <Component handleChange={setOtp} />
                </div>

                <div>
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="mt-1"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Reset Password
                </Button>

                <p className="text-sm text-center text-muted-foreground mt-4">
                  Didn't receive the code? <button type="button" onClick={handleResendOtp} className="text-primary hover:underline font-medium">Resend</button>
                </p>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep("request")}
                    className="text-sm text-primary hover:underline"
                  >
                    Use a different email
                  </button>
                  <Link href="/login" className="text-sm text-primary hover:underline">
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
