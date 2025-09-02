'use client';

import { useState, useEffect } from 'react';

// Reusable Input Component
export const Input = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    placeholder = '',
    required = false,
    disabled = false,
    error = '',
    step,
    min,
    max,
    className = '',
}) => {
    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
                    {label}
                    {required && <span className="text-red-500"> *</span>}
                </label>
            )}
            <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${error ? 'border-red-500' : ''
                    } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                step={step}
                min={min}
                max={max}
            />
            {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
        </div>
    );
};

// Reusable Checkbox Component
export const Checkbox = ({
    label,
    name,
    checked,
    onChange,
    required = false,
    disabled = false,
    className = '',
}) => {
    return (
        <div className={`mb-4 ${className}`}>
            <label className="flex items-center">
                <input
                    className="form-checkbox h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    name={name}
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                />
                <span className="ml-2 text-gray-700">{label}</span>
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
        </div>
    );
};

// Reusable Select Component
export const Select = ({
    label,
    name,
    value,
    onChange,
    options = [],
    required = false,
    disabled = false,
    error = '',
    className = '',
}) => {
    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
                    {label}
                    {required && <span className="text-red-500"> *</span>}
                </label>
            )}
            <select
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${error ? 'border-red-500' : ''
                    } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
            >
                <option value="">Select an option</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
        </div>
    );
};

// Reusable TextArea Component
export const TextArea = ({
    label,
    name,
    value,
    onChange,
    placeholder = '',
    required = false,
    disabled = false,
    error = '',
    rows = 3,
    className = '',
}) => {
    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
                    {label}
                    {required && <span className="text-red-500"> *</span>}
                </label>
            )}
            <textarea
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${error ? 'border-red-500' : ''
                    } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                id={name}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                rows={rows}
            />
            {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
        </div>
    );
};

// Reusable Button Component
export const Button = ({
    type = 'button',
    onClick,
    disabled = false,
    children,
    variant = 'primary', // primary, secondary, danger
    className = '',
}) => {
    const baseClasses = 'font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline';
    const variantClasses = {
        primary: 'bg-blue-500 hover:bg-blue-700 text-white',
        secondary: 'bg-gray-500 hover:bg-gray-700 text-white',
        danger: 'bg-red-500 hover:bg-red-700 text-white',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            {children}
        </button>
    );
};

// Reusable Form Component
export const Form = ({ onSubmit, children, className = '' }) => {
    return (
        <form onSubmit={onSubmit} className={`bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 ${className}`}>
            {children}
        </form>
    );
};