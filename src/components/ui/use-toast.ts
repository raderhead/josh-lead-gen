
// Import from Radix UI directly for the basic toast functionality
import { type Toast as ToastPrimitive } from "@radix-ui/react-toast";

// Re-export the useToast hook directly from Radix without going through our hook
export { useToast } from "@/components/ui/toast";

// Define the toast function that can be imported directly
export const toast = (props: any) => {
  // This is just a pass-through function that will be properly implemented by the toast provider
  return props;
};

export type ToastActionElement = React.ReactElement<typeof ToastPrimitive.Action>;
