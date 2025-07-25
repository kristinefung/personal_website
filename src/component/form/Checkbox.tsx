import React from "react";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    cssStyle: "ADMIN" | "CUSTOMER";
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, error, className = "", cssStyle, ...props }, ref) => {
        const accent = cssStyle === "ADMIN" ? "accent-blue-600" : "accent-[#7fffd4]";
        const labelColor = cssStyle === "ADMIN" ? "text-gray-700" : "text-gray-300";
        return (
            <div className="flex flex-col">
                <label className={`inline-flex items-center gap-2 cursor-pointer ${labelColor}`}>
                    <input
                        ref={ref}
                        type="checkbox"
                        className={`mr-2 ${accent} ${className}`}
                        {...props}
                    />
                    {label}
                </label>
                {error && <span className="text-red-400 text-sm mt-1">{error}</span>}
            </div>
        );
    }
);

Checkbox.displayName = "Checkbox";

export default Checkbox; 