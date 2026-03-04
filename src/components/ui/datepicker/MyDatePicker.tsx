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
  minDate?: Date; // Added for restriction
  maxDate?: Date; // Added for restriction
}

const CustomInput = forwardRef<HTMLButtonElement, { value?: string; onClick?: () => void; placeholder?: string }>(
  ({ value, onClick, placeholder }, ref) => (
    <button
      type="button"
      onClick={onClick}
      ref={ref}
      className="w-full flex items-center justify-between px-3 py-2 border border-slate-200 bg-slate-50 text-left outline-none focus:border-indigo-600 transition-all group rounded-sm"
    >
      <span className={`${value ? "text-slate-900" : "text-slate-400"} text-xs font-black uppercase tracking-tight`}>
        {value || placeholder}
      </span>
      <FaCalendarAlt className="text-slate-300 group-hover:text-indigo-600 transition-colors" size={14} />
    </button>
  )
);

const MyDatePicker: React.FC<DatePickerProps> = ({
  selected,
  onChange,
  placeholder = "SELECT DATE",
  label,
  required,
  minDate,
  maxDate,
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-[0.15em]">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <DatePicker
        selected={selected}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        customInput={<CustomInput placeholder={placeholder} />}
        dateFormat="dd / MM / yyyy"
        portalId="datepicker-portal"
        showPopperArrow={false}
        popperPlacement="bottom-start"
        fixedHeight
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        autoComplete="off"
      />
    </div>
  );
};

export default MyDatePicker;