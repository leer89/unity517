import * as React from "react";

/**
 * Mobile-safe form primitives. Single source of truth for input + textarea
 * styling so every form on this site shrinks/grows correctly on phones.
 *
 * Conventions baked in:
 *   - w-full + min-w-0 so the field tracks its container, never overflows.
 *   - box-border (inherited from globals.css) so padding doesn't bust width.
 *   - textareas: resize-y only.
 *   - 16px font on inputs so iOS Safari doesn't zoom on focus.
 *
 * See feedback memory `feedback-mobile-form-fields` for why this exists.
 */

const baseField =
  "block w-full min-w-0 rounded-md bg-brand-ink border border-brand-line " +
  "px-3 py-2 text-base text-brand-paper " +
  "focus:outline-none focus:border-brand-cyan " +
  "placeholder:text-brand-muted/70";

type LabelProps = { children: React.ReactNode; htmlFor?: string };
export function Label({ children, htmlFor }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs uppercase tracking-widest text-brand-muted"
    >
      {children}
    </label>
  );
}

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};
export function Field({ label, id, className = "", ...rest }: FieldProps) {
  const inputId = id ?? `f-${rest.name ?? Math.random().toString(36).slice(2, 8)}`;
  return (
    <div className="w-full">
      <Label htmlFor={inputId}>{label}</Label>
      <input id={inputId} className={`${baseField} mt-1 ${className}`} {...rest} />
    </div>
  );
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
};
export function Textarea({ label, id, rows = 5, className = "", ...rest }: TextareaProps) {
  const taId = id ?? `t-${rest.name ?? Math.random().toString(36).slice(2, 8)}`;
  return (
    <div className="w-full">
      <Label htmlFor={taId}>{label}</Label>
      <textarea
        id={taId}
        rows={rows}
        className={`${baseField} mt-1 resize-y ${className}`}
        {...rest}
      />
    </div>
  );
}

type FileFieldProps = {
  label: string;
  name: string;
  accept?: string;
  helper?: string;
};
export function FileField({ label, name, accept = "image/*", helper }: FileFieldProps) {
  return (
    <div className="w-full">
      <Label>{label}</Label>
      {helper && <p className="text-xs text-brand-muted mt-1">{helper}</p>}
      <input
        type="file"
        name={name}
        accept={accept}
        className={
          "mt-2 block w-full min-w-0 text-sm text-brand-paper " +
          "file:mr-3 file:rounded-md file:border-0 file:bg-brand-card " +
          "file:px-3 file:py-2 file:text-brand-paper hover:file:bg-brand-line"
        }
      />
    </div>
  );
}

type CheckboxProps = {
  name: string;
  defaultChecked?: boolean;
  label: string;
};
export function Checkbox({ name, defaultChecked, label }: CheckboxProps) {
  return (
    <label className="flex items-center gap-2 text-sm text-brand-paper cursor-pointer select-none">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="accent-brand-neon"
      />
      <span>{label}</span>
    </label>
  );
}
