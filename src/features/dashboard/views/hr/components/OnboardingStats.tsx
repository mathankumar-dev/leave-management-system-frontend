import React from "react";

interface OnboardingStatsProps {
  newEmployeesCount: number;
  pendingBiometricCount: number;
  pendingVPNCount: number;
}

const OnboardingStats: React.FC<OnboardingStatsProps> = ({
  newEmployeesCount,
  pendingBiometricCount,
  pendingVPNCount,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Onboarding Overview</h2>

      <p>New Employees: {newEmployeesCount}</p>
      <p>Pending Biometric: {pendingBiometricCount}</p>
      <p>Pending VPN Setup: {pendingVPNCount}</p>
    </div>
  );
};

export default OnboardingStats;