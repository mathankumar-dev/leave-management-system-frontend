import React, { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { dashboardService } from "../services/dashboardService";
// import { dashboardService } from "../dashboard/services/dashboardService";

const CompleteProfileForm = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    contactNumber: "",
    personalEmail: "",
    aadharNumber: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    maritalStatus: "",
    presentAddress: "",
    permanentAddress: "",
    emergencyContactNumber: "",
    designation: "",
    skillSet: "",

    fatherName: "",
    fatherOccupation: "",
    fatherDateOfBirth: "",
    fatherAlive: true,

    motherName: "",
    motherOccupation: "",
    motherDateOfBirth: "",
    motherAlive: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

    const { name, value, type, checked } = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

  };

  const handleSubmit = async () => {

    try {

      const employeeId = Cookies.get("employee_id");

      if (!employeeId) {
        alert("Employee ID missing");
        return;
      }

      const payload = {
        ...formData,
        skillSet: formData.skillSet
          ? formData.skillSet.split(",").map((s) => s.trim())
          : []
      };

      await dashboardService.completeProfile(Number(employeeId), payload);

      alert("Profile completed successfully");

      navigate("/dashboard");

    } catch (error) {

      console.error("Profile submit failed", error);

    }

  };

  return (

    <div className="space-y-6 p-4 md:p-0 max-w-4xl mx-auto">

      <div>
        <h2 className="text-2xl font-bold">Complete Your Profile</h2>
        <p className="text-xs text-slate-500">
          Please enter your personal details
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">

        {/* PERSONAL DETAILS */}

        <Section title="Personal Details">

          <Input label="Contact Number" name="contactNumber" onChange={handleChange} />
          <Input label="Personal Email" name="personalEmail" onChange={handleChange} />
          <Input label="Aadhar Number" name="aadharNumber" onChange={handleChange} />
          <Input label="Date Of Birth" name="dateOfBirth" type="date" onChange={handleChange} />

          <Select label="Gender" name="gender"
            options={["MALE","FEMALE","OTHER"]}
            onChange={handleChange}
          />

          <Select label="Blood Group" name="bloodGroup"
            options={[
              "A_POSITIVE","A_NEGATIVE","B_POSITIVE","B_NEGATIVE",
              "O_POSITIVE","O_NEGATIVE","AB_POSITIVE","AB_NEGATIVE"
            ]}
            onChange={handleChange}
          />

          <Select label="Marital Status" name="maritalStatus"
            options={["SINGLE","MARRIED"]}
            onChange={handleChange}
          />

        </Section>

        {/* ADDRESS */}

        <Section title="Address">

          <Input label="Present Address" name="presentAddress" onChange={handleChange} />
          <Input label="Permanent Address" name="permanentAddress" onChange={handleChange} />

        </Section>

        {/* JOB */}

        <Section title="Job Details">

          <Input label="Designation" name="designation" onChange={handleChange} />
          <Input label="Skill Set (comma separated)" name="skillSet" onChange={handleChange} />

        </Section>

        {/* EMERGENCY */}

        <Section title="Emergency Contact">

          <Input label="Emergency Contact Number" name="emergencyContactNumber" onChange={handleChange} />

        </Section>

        {/* FATHER */}

        <Section title="Father Details">

          <Input label="Father Name" name="fatherName" onChange={handleChange} />
          <Input label="Father Occupation" name="fatherOccupation" onChange={handleChange} />
          <Input label="Father DOB" name="fatherDateOfBirth" type="date" onChange={handleChange} />

          <Checkbox label="Father Alive" name="fatherAlive" onChange={handleChange} />

        </Section>

        {/* MOTHER */}

        <Section title="Mother Details">

          <Input label="Mother Name" name="motherName" onChange={handleChange} />
          <Input label="Mother Occupation" name="motherOccupation" onChange={handleChange} />
          <Input label="Mother DOB" name="motherDateOfBirth" type="date" onChange={handleChange} />

          <Checkbox label="Mother Alive" name="motherAlive" onChange={handleChange} />

        </Section>

        <div className="flex justify-end pt-4">

          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
          >
            Submit Profile
          </button>

        </div>

      </div>

    </div>

  );

};

export default CompleteProfileForm;


/* ---------- UI COMPONENTS ---------- */


const Section = ({ title, children }: any) => (

  <div>

    <h3 className="text-sm font-bold text-slate-600 mb-4">
      {title}
    </h3>

    <div className="grid md:grid-cols-2 gap-4">
      {children}
    </div>

  </div>

);


const Input = ({ label, name, type = "text", onChange }: any) => (

  <div className="flex flex-col gap-1">

    <label className="text-xs font-bold text-slate-500">
      {label}
    </label>

    <input
      type={type}
      name={name}
      onChange={onChange}
      className="bg-white border border-slate-200 px-4 py-3 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-sm"
    />

  </div>

);


const Select = ({ label, name, options, onChange }: any) => (

  <div className="flex flex-col gap-1">

    <label className="text-xs font-bold text-slate-500">
      {label}
    </label>

    <select
      name={name}
      onChange={onChange}
      className="bg-white border border-slate-200 px-4 py-3 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-sm"
    >

      <option value="">Select</option>

      {options.map((o: string) => (
        <option key={o} value={o}>{o}</option>
      ))}

    </select>

  </div>

);


const Checkbox = ({ label, name, onChange }: any) => (

  <label className="flex items-center gap-2 text-sm font-medium text-slate-600 mt-2">

    <input
      type="checkbox"
      name={name}
      onChange={onChange}
    />

    {label}

  </label>

);