import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export interface PasswordTextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    cssStyle: "ADMIN" | "CUSTOMER";
}

const PasswordTextField = React.forwardRef<HTMLInputElement, PasswordTextFieldProps>(
    ({ label, error, className = "", cssStyle, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        const bgColor = cssStyle === "ADMIN" ? "bg-[#0a1628]" : "bg-[#f0f4f8]";
        const textColor = cssStyle === "ADMIN" ? "text-[#7fffd4]" : "text-[#0a1628]";

        return (
            <div className="flex flex-col">
                {label && (
                    <label htmlFor={props.id || props.name} className={`${textColor} font-medium mb-2`}>
                        {label}
                        {props.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                )}
                <div className="relative">
                    <input
                        ref={ref}
                        type={showPassword ? "text" : "password"}
                        className={`p-3 pr-12 rounded-lg ${bgColor} border border-gray-600 text-white placeholder-gray-400 focus:border-[#7fffd4] focus:outline-none focus:ring-2 focus:ring-[#7fffd4]/20 transition-all duration-200 w-full ${className}`}
                        {...props}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#7fffd4] transition-colors ${textColor}`}
                        tabIndex={-1}
                        disabled={props.disabled}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                {error && <span className="text-red-400 text-sm mt-1">{error}</span>}
            </div>
        );
    }
);

PasswordTextField.displayName = "PasswordTextField";

export default PasswordTextField; 