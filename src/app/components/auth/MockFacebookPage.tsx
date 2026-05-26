import { useState, useEffect, useRef } from "react";
import { FacebookIcon } from "./LoginProviderIcons";

export function MockFacebookPage({
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

  const displayEmail = email || "user@example.com";

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-20 font-sans focus:outline-none"
    >
      <button
        type="button"
        onClick={onBack}
        className="absolute left-6 top-6 text-sm text-fb-bg hover:underline"
      >
        Back
      </button>
      <div className="flex w-full max-w-[396px] flex-col items-center gap-4 rounded-lg bg-white p-5 shadow-lg md:border md:border-gray-50">
        <div className="mb-4 flex flex-col items-center gap-4">
          <FacebookIcon />
          <h1 className="text-xl font-bold text-gray-900">Log Into Facebook</h1>
        </div>

        <div className="w-full text-center text-sm text-gray-200">
          Log in as <span className="font-semibold">{displayEmail}</span> to continue to Bird AI.
        </div>

        <div className="mt-4 w-full">
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-md bg-fb-bg px-4 py-3 text-xl font-bold text-white transition-colors hover:bg-fb-bg disabled:opacity-70"
          >
            {loading ? "Logging in…" : "Log In"}
          </button>
        </div>

        <div className="mt-4 cursor-pointer text-sm text-fb-bg hover:underline">Forgot account?</div>
      </div>
    </div>
  );
}
