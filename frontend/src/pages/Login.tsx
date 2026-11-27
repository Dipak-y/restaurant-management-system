
import axios from "axios";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, User, UtensilsCrossed } from "lucide-react";
import { useAuth } from  "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const role = await login(username, password);

      if (role === "KITCHEN") {
        navigate("/kitchen/dashboard");
      } else if (
        role === "WAITER" ||
        role === "MANAGER" ||
        role === "ADMIN"
      ) {
        navigate("/staff/orders");
      } else {
        setError("Your account does not have a valid staff role.");
      }
    } catch (err: unknown) {
      console.error("Login error:", err);

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.detail ||
          err.message ||
          "Unable to connect to the server."
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
            <UtensilsCrossed size={28} />
          </div>

          <h1 className="text-2xl font-bold text-slate-800">
            Restaurant Management
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to access your staff dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Username
            </label>

            <div className="flex items-center rounded-lg border border-slate-300 px-3">
              <User size={18} className="text-slate-400" />

              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter your username"
                required
                className="w-full p-3 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>

            <div className="flex items-center rounded-lg border border-slate-300 px-3">
              <LockKeyhole size={18} className="text-slate-400" />

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                className="w-full p-3 outline-none"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-orange-600 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
