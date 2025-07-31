"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Input from "@/components/customComponent/Input";
import Card from "@/components/customComponent/Card";
import Button from "@/components/customComponent/Button";
import { APP_CONFIG } from "@/lib/constants";

interface LoginFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
}

export const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // STI Logo component
  const stiLogo = (
    <div className="flex justify-center">
      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-xl">
          {APP_CONFIG.shortName}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-md w-full space-y-8">
        <Card
          header={stiLogo}
          title={APP_CONFIG.name}
          description="Sign in to your STI account"
          className="border-t-4 border-t-blue-600 shadow-xl"
        >
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Authentication Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{decodeURIComponent(error)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Enter your email address"
                label="Email Address"
                disabled={isLoading}
              />
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Enter your password"
                label="Password"
                disabled={isLoading}
              />
            </div>

            <div>
              <Button
                type="submit"
                isLoading={isLoading}
                loadingText="Signing in..."
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sign in
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
