import { useState } from 'react';

export default function PasswordInput({
  value,
  onChange,
  autoComplete = 'current-password',
  required = false,
  placeholder = '••••••••',
  id,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="admin-password-field">
      <input
        id={id}
        type={showPassword ? 'text' : 'password'}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <button
        type="button"
        className="admin-password-toggle"
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        aria-pressed={showPassword}
      >
        {showPassword ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}
