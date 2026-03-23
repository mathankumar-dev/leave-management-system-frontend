import React from "react";

const TermsOfService = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12 h-screen overflow-y-auto">
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

            <p className="mb-4">
                These Terms of Service govern the use of the Employee Leave Management
                System (ELMS). By accessing or using this system, users agree to comply
                with these terms.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">1. User Responsibilities</h2>
            <p className="mb-4">
                Employees must provide accurate information when submitting leave
                requests and updating personal details within the system.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">2. Leave Policies</h2>
            <p className="mb-4">
                The system enforces company leave policies including monthly leave
                limits, carry-forward rules, and loss-of-pay calculations.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">3. Account Access</h2>
            <p className="mb-4">
                Users are responsible for maintaining the confidentiality of their
                login credentials and must not share access with others.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">4. System Usage</h2>
            <p className="mb-4">
                The platform must only be used for official organizational purposes
                such as leave management, payroll tracking, and employee communication.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">5. Monitoring and Audit</h2>
            <p className="mb-4">
                All activities performed within the system may be logged and audited
                for compliance, security, and organizational transparency.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">6. Termination of Access</h2>
            <p className="mb-4">
                The organization reserves the right to suspend or revoke user access if
                misuse of the system is detected.
            </p>

            <p className="mt-6 text-sm text-gray-500">
                Last Updated: {new Date().getFullYear()}
            </p>
        </div>
    );
};

export default TermsOfService;