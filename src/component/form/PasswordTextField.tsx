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

        const bgColor = cssStyle === "ADMIN" ? "bg-[#f0f4f8]" : "bg-[#1e3557]";
        const textColor = cssStyle === "ADMIN" ? "text-[#0a1628]" : "text-white";

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
                        className={`p-3 pr-12 rounded ${bgColor} text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#7fffd4] w-full`}
                        {...props}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#7fffd4] transition-colors ${textColor} cursor-pointer`}
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