import { Input as BaseInput } from "../ui/input";
import { Label } from "../ui/label";

interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
}

export default function Input({
  type = "text",
  name,
  required = true,
  label,
  ...props
}: InputProps) {
  const displayLabel =
    label || (name ? name.charAt(0).toUpperCase() + name.slice(1) : "");

  return (
    <div className="space-y-2 ">
      {displayLabel && (
        <Label htmlFor={name} className="text-sm font-medium">
          {displayLabel}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <BaseInput
        name={name}
        type={type}
        id={name}
        required={required}
        className="border rounded p-2 w-full"
        {...props}
      />
    </div>
  );
}
