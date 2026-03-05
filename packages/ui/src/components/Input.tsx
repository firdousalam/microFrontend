import React from 'react'

export interface InputProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    type?: 'text' | 'email' | 'password'
    disabled?: boolean
}

export function Input({
    value,
    onChange,
    placeholder,
    type = 'text',
    disabled = false
}: InputProps) {
    return (
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="input"
        />
    )
}
