import React from 'react';

export default function SelectFilter({
  label,
  icon: Icon,
  iconClass = 'text-slate-400',
  value = 'ALL',
  allOptionLabel = 'Todos',
  options = [],
  formatter = (v) => v,
  onChange = () => {}
}) {
  return (
    <div className="space-y-1.5">
      <label className="font-semibold text-slate-300 flex items-center gap-1.5">
        {Icon && <Icon size={13} className={iconClass} />}
        <span>{label}</span>
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
      >
        <option value="ALL">{allOptionLabel}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{formatter(opt)}</option>
        ))}
      </select>
    </div>
  );
}
