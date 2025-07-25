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
                <input
                    ref={ref}
                    className={`p-3 pr-12 rounded ${bgColor} text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#7fffd4] w-full`}
                    {...props}
                />
                {error && <span className="text-red-400 text-sm mt-1">{error}</span>}
            </div>
        );
    }
);

TextField.displayName = "TextField";

export default TextField; 