import React from 'react';

export const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
    const baseStyle = "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg',
        secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        ghost: 'text-gray-600 hover:bg-gray-100',
        danger: 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg'
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyle} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export const Input = ({ label, error, className = '', ...props }) => (
    <div className="flex flex-col gap-1 w-full">
        {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
        <input
            className={`px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all ${error ? 'border-red-500' : ''} ${className}`}
            {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
);

export const Card = ({ children, className = '' }) => (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-4 ${className}`}>
        {children}
    </div>
);

export const Badge = ({ children, variant = 'default', className = '' }) => {
    const variants = {
        success: 'bg-green-100 text-green-700',
        warning: 'bg-orange-100 text-orange-700',
        danger: 'bg-red-100 text-red-700',
        default: 'bg-gray-100 text-gray-700',
        purple: 'bg-purple-100 text-purple-700'
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>{children}</span>;
};
