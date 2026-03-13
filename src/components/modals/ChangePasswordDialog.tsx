import React, { useState } from "react";
import { FaShieldAlt } from "react-icons/fa";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { authService } from "../../features/auth/services/AuthService";
import SuccessModal from "../ui/SuccessModal";
import FailureModal from "../ui/FailureModal";

const ChangePasswordDialog: React.FC = () => {
  const { user, setUser } = useAuth();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [failureMessage, setFailureMessage] = useState("");

  const handleSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      setFailureMessage("All fields are required.");
      setShowFailure(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setFailureMessage("Passwords do not match.");
      setShowFailure(true);
      return;
    }

    if (newPassword.length < 6) {
      setFailureMessage("Password must be at least 6 characters.");
      setShowFailure(true);
      return;
    }

    try {
      setLoading(true);

      await authService.changePassword(newPassword);

      setShowSuccess(true);

    } catch (err) {
      console.error("Change password error:", err);
      setFailureMessage("Failed to update password. Please try again.");
      setShowFailure(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = async () => {
    setShowSuccess(false);

    if (user) {
      const updatedProfile = await authService.getEmployeeProfile(user.id);
      setUser(updatedProfile);
    }
  };

  return (
    <>
      {/* Password Dialog */}
      <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">

          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-red-50 rounded-lg flex items-center justify-center mb-4 text-2xl text-red-600">
              <FaShieldAlt />
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
              disabled={loading}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full border border-neutral-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />

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

      {/* Success Modal */}
      {showSuccess && (
        <SuccessModal
          title="Password Updated"
          message="Your password has been successfully updated. You may now continue to your dashboard."
          buttonText="Continue"
          onClose={handleSuccessClose}
        />
      )}

      {/* Failure Modal */}
      {showFailure && (
        <FailureModal
          title="Update Failed"
          message={failureMessage}
          buttonText="Try Again"
          onClose={() => setShowFailure(false)}
        />
      )}
    </>
  );
};

export default ChangePasswordDialog;