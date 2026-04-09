import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../api/authApi";
import FailureModal from "../../../shared/components/FailureModal";
import { Loader } from "lucide-react";

const ForgotPassword: React.FC = () => {

    const navigate = useNavigate();

    const [step, setStep] = useState<"email" | "otp">("email");

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");



    // STEP 1 → send email
    const handleEmailSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        setLoading(true);

        try {

            await authService.forgotPassword(email);

            setStep("otp");

        } catch (err) {

            setErrorMsg("Unable to send OTP");
            setShowError(true);

        } finally {

            setLoading(false);

        }

    };



    // STEP 2 → verify otp + change password
    const handleOtpSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        setLoading(true);

        try {

            await authService.verifyOtp({
                email,
                otp,
                newPassword
            });

            alert("Password reset successfully");

            navigate("/login");

        } catch (err) {

            setErrorMsg("Invalid OTP or expired OTP");
            setShowError(true);

        } finally {

            setLoading(false);

        }

    };



    return (

        <div className="flex items-center justify-center min-h-screen">

            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

                {loading && (
                    <div className="flex justify-center mb-4">
                        <Loader className="animate-spin" />
                    </div>
                )}


                {showError && (

                    <FailureModal
                        title="Error"
                        message={errorMsg}
                        onClose={() => setShowError(false)}
                    />

                )}



                {/* STEP 1 FORM */}
                {step === "email" && (

                    <form onSubmit={handleEmailSubmit} className="space-y-6">

                        <h1 className="text-2xl font-bold">
                            Forgot Password
                        </h1>

                        <input
                            type="email"
                            placeholder="Enter registered email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border rounded-xl p-3"
                        />

                        <button
                            type="submit"
                            className="w-full bg-primary-500 text-white py-3 rounded-xl"
                        >
                            Send OTP
                        </button>

                    </form>

                )}


                {/* STEP 2 FORM */}
                {step === "otp" && (

                    <form onSubmit={handleOtpSubmit} className="space-y-6">

                        <h1 className="text-2xl font-bold">
                            Verify OTP
                        </h1>

                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            className="w-full border rounded-xl p-3"
                        />

                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full border rounded-xl p-3"
                        />

                        <button
                            type="submit"
                            className="w-full bg-green-500 text-white py-3 rounded-xl"
                        >
                            Reset Password
                        </button>

                    </form>

                )}

            </div>

        </div>

    );

};

export default ForgotPassword;