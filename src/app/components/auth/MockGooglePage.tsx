import { useState, useEffect, useRef } from "react";
import { GoogleIcon } from "./LoginProviderIcons";

export function MockGooglePage({
  email,
  onBack,
  onAuthenticated,
}: {
  email: string;
  onBack: () => void;
  onAuthenticated: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onAuthenticated();
    }, 1500);
  };

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-20 font-sans focus:outline-none"
    >
      <button
        type="button"
        onClick={onBack}
        className="absolute left-6 top-6 text-sm text-google-bg hover:underline"
      >
        Back
      </button>
      <div className="flex w-full max-w-[450px] flex-col rounded-lg bg-white p-10 shadow-sm md:border md:border-gray-50">
        <div className="flex flex-col items-center gap-4">
          <GoogleIcon />
          <h1 className="text-2xl font-medium text-gray-900">Sign in</h1>
          <p className="text-base text-gray-900">to continue to Bird AI</p>
        </div>

        <div className="mt-8 flex flex-col gap-6">
          <div className="flex items-center justify-center rounded-full border border-gray-50 px-3 py-1.5">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white">
                {email.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-400">{email}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded bg-google-bg px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-200 disabled:opacity-70"
          >
            {loading ? "Signing in…" : "Next"}
          </button>
        </div>
      </div>
      <div className="mt-6 flex gap-8 text-xs text-gray-400">
        <span>English (United States)</span>
        <span>Help</span>
        <span>Privacy</span>
        <span>Terms</span>
      </div>
    </div>
  );
}
