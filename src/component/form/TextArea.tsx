import React from "react";

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    cssStyle: "ADMIN" | "CUSTOMER";
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
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
                <textarea
                    ref={ref}
                    className={`w-full p-3 h-32 rounded ${bgColor} ${textColor} placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#7fffd4] resize-none ${className}`}
                    {...props}
                />
                {error && <span className="text-red-400 text-sm mt-1">{error}</span>}
            </div>
        );
    }
);

TextArea.displayName = "TextArea";

export default TextArea; 