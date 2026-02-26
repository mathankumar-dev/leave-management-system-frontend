import React, { useState } from "react";
import { authService } from "../services/AuthService";
import SuccessModal from "../../../components/ui/SuccessModal";
import FailureModal from "../../../components/ui/FailureModal";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowError(false);

    try {
      await authService.forgotPassword(email);
      setShowSuccess(true);
    } catch (err) {
      setShowError(true);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
      {showSuccess && (
        <SuccessModal
          title="Email Sent"
          message="If an account exists, a reset link has been sent."
        />
      )}

      {showError && (
        <FailureModal
          title="Error"
          message="Something went wrong. Try again."
          onClose={() => setShowError(false)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <h1 className="text-2xl font-bold">Forgot Password</h1>

        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded-xl p-3"
        />

        <button
          type="submit"
          className="w-full bg-primary-500 text-white py-3 rounded-xl"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;