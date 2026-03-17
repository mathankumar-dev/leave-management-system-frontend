import React, { useState } from "react";
import { FaShieldAlt } from "react-icons/fa";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { authService } from "../../features/auth/services/AuthService";
import Loader from "../ui/Loader"; // Updated circular loader
import FailureModal from "../ui/FailureModal";


const ChangePasswordDialog: React.FC = () => {
  const { user, setUser } = useAuth();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Loader States
  const [loaderState, setLoaderState] = useState({ active: false, finished: false });
  
  const [showFailure, setShowFailure] = useState(false);
  const [failureMessage, setFailureMessage] = useState("");

  const handleSubmit = async () => {
    // Validations
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
      // 1. Activate circular loader
      setLoaderState({ active: true, finished: false });

      await authService.changePassword(newPassword);

      // 2. Mark as finished to trigger exit animation
      setLoaderState({ active: true, finished: true });

    } catch (err) {
      console.error("Change password error:", err);
      setLoaderState({ active: false, finished: false });
      setFailureMessage("Failed to update password. Please try again.");
      setShowFailure(true);
    }
  };

  // This runs after the loader finishes its "Success" state
  const handleFinalize = async () => {
    if (user) {
      try {
        const updatedProfile = await authService.getEmployeeProfile(user.id);
        setUser(updatedProfile); // This triggers the redirect to dashboard
      } catch (err) {
        window.location.reload(); // Fallback to refresh state
      }
    }
  };

  return (
    <>
      {/* FULL-SCREEN CIRCULAR LOADER */}
      {loaderState.active && (
        <Loader 
          message="Updating Security..." 
          isFinished={loaderState.finished}
          onFinished={handleFinalize} 
        />
      )}

      {/* Password Dialog - Only visible if not loading */}
      {!loaderState.active && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
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
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full border border-neutral-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                onClick={handleSubmit}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-red-200 active:scale-[0.98]"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
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