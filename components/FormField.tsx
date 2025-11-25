"use client";
import React from "react";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Input } from "./ui/input";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "file";
}

const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
}: FormFieldProps<T>) => {
  return (
    <div>
      <FieldGroup>
        <Controller
          control={control}
          name={name}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={name} className="label">
                {label}
              </FieldLabel>
              <Input
                {...field}
                className="input"
                id={name}
                aria-invalid={fieldState.invalid}
                placeholder={placeholder}
                autoComplete="username"
                type={type}
              />
              {/* <FieldDescription>
                    This is your public display name. Must be between 3 and 10
                    characters. Must only contain letters, numbers, and
                    underscores.
                  </FieldDescription> */}
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </div>
  );
};

export default FormField;
