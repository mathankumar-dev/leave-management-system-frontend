

const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12 h-screen overflow-y-auto">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

            <p className="mb-4">
                This Privacy Policy explains how our Employee Leave Management System
                (ELMS) collects, uses, and protects employee information when using
                this platform.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
            <p className="mb-4">
                We collect information required to manage employee records and leave
                requests including employee name, email address, employee ID,
                department details, and leave history.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Information</h2>
            <p className="mb-4">
                The collected data is used to manage employee leave applications,
                process approvals, generate payslip records, and maintain internal
                organizational workflows.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Security</h2>
            <p className="mb-4">
                We implement appropriate security measures to protect employee data
                from unauthorized access, modification, or disclosure.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">4. Data Sharing</h2>
            <p className="mb-4">
                Employee data is not shared with third parties except when required by
                company policy or legal obligations.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">5. User Rights</h2>
            <p className="mb-4">
                Employees may request updates or corrections to their personal data
                through the HR department.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">6. Changes to Policy</h2>
            <p className="mb-4">
                The organization reserves the right to update this privacy policy when
                necessary. Updates will be communicated through the system.
            </p>

            <p className="mt-6 text-sm text-gray-500">
                Last Updated: {new Date().getFullYear()}
            </p>
        </div>
    );
};

export default PrivacyPolicy;