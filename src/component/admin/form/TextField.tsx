import React from "react";

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    cssStyle: "ADMIN" | "CUSTOMER";
    id?: string;
    name?: string;
    label?: string;
    error?: string;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
    ({ label, error, className = "", cssStyle, ...props }, ref) => {
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
                <input
                    ref={ref}
                    className={`p-3 rounded-lg ${bgColor} border border-gray-600 text-white placeholder-gray-400 focus:border-[#7fffd4] focus:outline-none focus:ring-2 focus:ring-[#7fffd4]/20 transition-all duration-200 ${className}`}
                    {...props}
                />
                {error && <span className="text-red-400 text-sm mt-1">{error}</span>}
            </div>
        );
    }
);

TextField.displayName = "TextField";

export default TextField; 