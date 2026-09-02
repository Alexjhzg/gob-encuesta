import React from 'react';

export default function ConfigFormField({
  label,
  icon: Icon,
  type = 'text',
  placeholder = '',
  value = '',
  helperText,
  onChange = () => {}
}) {
  return (
    <div className="space-y-1">
      <label className="font-semibold text-slate-700 flex items-center gap-1.5">
        {Icon && <Icon size={14} className="text-blue-600" />}
        <span>{label}</span>
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 font-mono text-xs"
      />
      {helperText && (
        <p className="text-[11px] text-slate-400">
          {helperText}
        </p>
      )}
    </div>
  );
}
