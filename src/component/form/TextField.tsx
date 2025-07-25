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
        const bgColor = cssStyle === "ADMIN" ? "bg-white" : "bg-[#1e3557]";
        const textColor = cssStyle === "ADMIN" ? "text-black" : "text-white";
        const borderColor = cssStyle === "ADMIN" ? "border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" : "focus:outline-none focus:ring-1 focus:ring-[#7fffd4]";

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
                    className={`p-2.5 pr-12 rounded placeholder-gray-400 ${bgColor} ${textColor} ${borderColor} w-full`}
                    {...props}
                />
                {error && <span className="text-red-400 text-sm mt-1">{error}</span>}
            </div>
        );
    }
);

TextField.displayName = "TextField";

export default TextField; 