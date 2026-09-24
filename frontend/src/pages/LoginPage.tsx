import { useState } from "react";
import type { FormEvent } from "react";
import { ApiError, login } from "../api/auth.ts";
import { useAuth } from "../context/AuthContext.tsx";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const initialFormData: LoginFormData = {
  email: "",
  password: "",
  rememberMe: false,
};

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useAuth();

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      nextErrors.email = "Please enter your email.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      nextErrors.email = "Please provide a valid email address.";
    }

    if (!formData.password) {
      nextErrors.password = "Please enter your password.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerMessage(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      // Store user in auth context (persisted to localStorage)
      setUser({
        id: response.id,
        email: response.email,
        fullName: response.fullName,
        role: response.role,
        token: response.token,
      });

      // On success, redirect to home
      window.location.href = "/";
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.fieldErrors.length > 0) {
          const nextErrors: Record<string, string> = {};
          for (const fieldError of error.fieldErrors) {
            nextErrors[fieldError.field] = fieldError.message;
          }
          setErrors((prev) => ({ ...prev, ...nextErrors }));
        }
        setServerMessage(error.message);
      } else {
        setServerMessage("Unable to sign in right now. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.20),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.18),transparent_45%)] bg-gray-50 dark:bg-gray-950 px-4 py-10 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Login form */}
        <section className="rounded-3xl border border-sky-200/60 dark:border-sky-800/50 bg-white/85 dark:bg-gray-900/85 backdrop-blur-md p-8 sm:p-10">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-200 transition-colors"
          >
            <span aria-hidden="true">←</span>
            Back to home
          </a>

          <h1 className="mt-6 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Welcome back
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
            Sign in to your UniEvents account to manage registrations, view
            upcoming events, and stay connected with your campus community.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-medium text-gray-800 dark:text-gray-200"
              >
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                value={formData.email}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
                className="mt-1.5 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="you@university.edu"
                autoComplete="email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-gray-800 dark:text-gray-200"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 pr-12 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary-500"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      rememberMe: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                Remember me
              </label>
              <a
                href="#"
                className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 transition-colors"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>

            {/* Error message */}
            {serverMessage && (
              <p className="rounded-xl border border-red-300/70 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-800 dark:text-red-300">
                {serverMessage}
              </p>
            )}

            {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-gray-900 px-3 text-gray-500 dark:text-gray-400">
                  New to UniEvents?
                </span>
              </div>
            </div>

            {/* Sign up link */}
            <a
              href="/signup"
              className="block w-full text-center rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold py-3.5 transition-colors"
            >
              Create an account
            </a>
          </form>
        </section>

        {/* Side panel */}
        <aside className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 p-8 sm:p-10 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Stay in the loop
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
              Sign in to access your personalized dashboard and never miss an
              event.
            </p>
            <ul className="mt-6 space-y-4 text-gray-600 dark:text-gray-400">
              <li className="flex gap-3">
                <span
                  className="mt-1 h-2.5 w-2.5 rounded-full bg-primary-500 shrink-0"
                  aria-hidden="true"
                />
                View and manage your event registrations.
              </li>
              <li className="flex gap-3">
                <span
                  className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500 shrink-0"
                  aria-hidden="true"
                />
                Get personalized event recommendations.
              </li>
              <li className="flex gap-3">
                <span
                  className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0"
                  aria-hidden="true"
                />
                Receive reminders before events start.
              </li>
              <li className="flex gap-3">
                <span
                  className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0"
                  aria-hidden="true"
                />
                Track attendance history and certificates.
              </li>
            </ul>
          </div>

          <div className="mt-10 rounded-2xl bg-linear-to-br from-primary-600 to-sky-600 text-white p-6">
            <p className="text-sm uppercase tracking-wide text-white/80">
              This semester
            </p>
            <p className="mt-2 text-3xl font-bold">120+</p>
            <p className="mt-1 text-sm text-white/90">
              events happening across campus
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
