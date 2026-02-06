import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker-overrides.css";

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

/**
 * Custom Input Component
 * Uses forwardRef to allow the DatePicker to control the button's focus/click
 */
const CustomInput = forwardRef<HTMLButtonElement, { value?: string; onClick?: () => void; placeholder?: string }>(
  ({ value, onClick, placeholder }, ref) => (
    <button
      type="button"
      onClick={onClick}
      ref={ref}
      className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-neutral-200 bg-white text-left outline-none focus:ring-2 focus:ring-primary-500 transition-all group"
    >
      <span className={`${value ? "text-neutral-900" : "text-neutral-500"} font-medium`}>
        {value || placeholder}
      </span>
      <FaCalendarAlt className="text-neutral-300 group-hover:text-primary-500 transition-colors" />
    </button>
  )
);

const MyDatePicker: React.FC<DatePickerProps> = ({
  selected,
  onChange,
  placeholder = "Select Date",
  label,
  required,
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-bold text-neutral-500 uppercase ml-1 tracking-wider">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <DatePicker
        selected={selected}
        onChange={onChange}
        // Custom button trigger
        customInput={<CustomInput placeholder={placeholder} />}
        dateFormat="MMMM d, yyyy"
        // Portal ensures it floats over the modal
        portalId="datepicker-portal"
        showPopperArrow={false}
        popperPlacement="bottom-start"
        // Pro features
        fixedHeight
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        // Accessibility
        autoComplete="off"
      />
    </div>
  );
};

export default MyDatePicker;