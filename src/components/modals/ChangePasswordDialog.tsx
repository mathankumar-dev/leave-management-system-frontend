import React, { useState } from "react";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { authService } from "../../features/auth/services/AuthService";

const ChangePasswordDialog: React.FC = () => {
  const { setForceChangePassword } = useAuth();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 0) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      await authService.changePassword(newPassword);      
      setForceChangePassword(false);
    } catch (err) {
      setError("Failed to update password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">

        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="text-red-600 w-8 h-8" />
          </div>

          <h3 className="text-2xl font-bold text-neutral-900">
            Password Update Required
          </h3>

          <p className="text-neutral-500 mt-2 text-sm">
            You must change your default password to continue.
          </p>
        </div>

        <div className="px-8 pb-8 space-y-4">

          <input
            type="password"
            placeholder="New Password"
            className="w-full border border-neutral-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border border-neutral-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-red-200 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default ChangePasswordDialog;