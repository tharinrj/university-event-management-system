import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ApiError, signup } from "../api/auth.ts";
import type { UserRole } from "../api/auth.ts";

interface SignUpFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  department: string;
  role: UserRole;
  agreeToTerms: boolean;
}

const initialFormData: SignUpFormData = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  department: "",
  role: "STUDENT",
  agreeToTerms: false,
};

export default function SignUpPage() {
  const [formData, setFormData] = useState<SignUpFormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const passwordStrength = useMemo(() => {
    const lengthScore = Math.min(40, formData.password.length * 5);
    const hasUpper = /[A-Z]/.test(formData.password) ? 20 : 0;
    const hasNumber = /\d/.test(formData.password) ? 20 : 0;
    const hasSymbol = /[^A-Za-z0-9]/.test(formData.password) ? 20 : 0;
    return lengthScore + hasUpper + hasNumber + hasSymbol;
  }, [formData.password]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      nextErrors.fullName = "Please enter your full name.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Please enter your email.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      nextErrors.email = "Please provide a valid email address.";
    }

    if (formData.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    if (formData.confirmPassword !== formData.password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.department.trim()) {
      nextErrors.department = "Please select your department.";
    }

    if (!formData.agreeToTerms) {
      nextErrors.agreeToTerms = "You must agree to the terms to continue.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerMessage(null);

    if (!validate()) {
      setSubmitted(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await signup({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        passwordConfirm: formData.confirmPassword,
        role: formData.role,
      });

      setErrors({});
      setSubmitted(true);
      setServerMessage(`Welcome, ${response.fullName}. Your account was created.`);
      setFormData(initialFormData);
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      setSubmitted(false);

      if (error instanceof ApiError) {
        if (error.fieldErrors.length > 0) {
          const nextErrors: Record<string, string> = {};
          for (const fieldError of error.fieldErrors) {
            if (fieldError.field === "passwordConfirm") {
              nextErrors.confirmPassword = fieldError.message;
            } else {
              nextErrors[fieldError.field] = fieldError.message;
            }
          }
          setErrors((prev) => ({ ...prev, ...nextErrors }));
        }
        setServerMessage(error.message);
      } else {
        setServerMessage("Unable to create account right now. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.20),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.18),transparent_45%)] bg-gray-50 dark:bg-gray-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <section className="rounded-3xl border border-sky-200/60 dark:border-sky-800/50 bg-white/85 dark:bg-gray-900/85 backdrop-blur-md p-8 sm:p-10">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-200 transition-colors"
          >
            <span aria-hidden="true">←</span>
            Back to home
          </a>

          <h1 className="mt-6 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Create your UniEvents account
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
            Join your campus event community. Sign up to save events, get reminders, and manage registrations from one place.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, fullName: event.target.value }))
                }
                className="mt-1.5 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Alex Carter"
                autoComplete="name"
              />
              {errors.fullName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                University email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, email: event.target.value }))
                }
                className="mt-1.5 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="you@university.edu"
                autoComplete="email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                I am signing up as
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  id="role-student"
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, role: "STUDENT" }))}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 py-4 px-3 text-sm font-medium transition-all ${
                    formData.role === "STUDENT"
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <span className="text-2xl">🎓</span>
                  Student
                </button>
                <button
                  id="role-organizer"
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, role: "ORGANIZER" }))}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 py-4 px-3 text-sm font-medium transition-all ${
                    formData.role === "ORGANIZER"
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <span className="text-2xl">📋</span>
                  Event Organizer
                </button>
              </div>
            </div>

            {/* Department */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                Department
              </label>
              <select
                id="department"
                value={formData.department}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, department: event.target.value }))
                }
                className="mt-1.5 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select a department</option>
                <option value="computer-science">Computer Science</option>
                <option value="engineering">Engineering</option>
                <option value="business">Business</option>
                <option value="arts">Arts & Humanities</option>
                <option value="science">Science</option>
              </select>
              {errors.department && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.department}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, password: event.target.value }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary-500"
                  autoComplete="new-password"
                />
                {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, confirmPassword: event.target.value }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary-500"
                  autoComplete="new-password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div>
              <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-rose-500 via-amber-500 to-emerald-500 transition-all duration-300"
                  style={{ width: `${passwordStrength}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Password strength</p>
            </div>

            <label className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, agreeToTerms: event.target.checked }))
                }
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              I agree to the Terms of Service and Privacy Policy.
            </label>
            {errors.agreeToTerms && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.agreeToTerms}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3.5 transition-colors"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>

            {submitted && (
              <p className="rounded-xl border border-emerald-300/70 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-300">
                {serverMessage ?? "Account details look good"}
              </p>
            )}

            {!submitted && serverMessage && (
              <p className="rounded-xl border border-red-300/70 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-800 dark:text-red-300">
                {serverMessage}
              </p>
            )}
          </form>
        </section>

        <aside className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 p-8 sm:p-10 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {formData.role === "ORGANIZER" ? "Why organizers love UniEvents" : "Why students sign up"}
            </h2>
            {formData.role === "ORGANIZER" ? (
              <ul className="mt-6 space-y-4 text-gray-600 dark:text-gray-400">
                <li className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary-500" aria-hidden="true" />
                  Create and publish events to the whole university in minutes.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500" aria-hidden="true" />
                  Manage registrations, attendance, and capacity automatically.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  Send announcements directly to all registered attendees.
                </li>
              </ul>
            ) : (
              <ul className="mt-6 space-y-4 text-gray-600 dark:text-gray-400">
                <li className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary-500" aria-hidden="true" />
                  Personalized event recommendations by department and interests.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500" aria-hidden="true" />
                  One-click registration and calendar reminders.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  Early access to featured campus events.
                </li>
              </ul>
            )}
          </div>

          <div className="mt-10 rounded-2xl bg-linear-to-br from-primary-600 to-sky-600 text-white p-6">
            {formData.role === "ORGANIZER" ? (
              <>
                <p className="text-sm uppercase tracking-wide text-white/80">This semester</p>
                <p className="mt-2 text-3xl font-bold">120+</p>
                <p className="mt-1 text-sm text-white/90">events hosted by organisers like you</p>
              </>
            ) : (
              <>
                <p className="text-sm uppercase tracking-wide text-white/80">Student community</p>
                <p className="mt-2 text-3xl font-bold">5,000+</p>
                <p className="mt-1 text-sm text-white/90">active members this semester</p>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
