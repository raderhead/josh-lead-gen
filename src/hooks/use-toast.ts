
import { useToast as useHookToast, toast } from "@/hooks/use-toast";

// Export with an interface that includes the new variant
export interface UseToastOptions {
  variant?: "default" | "destructive" | "success";
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export const useToast = () => {
  const hookToast = useHookToast();
  
  return {
    ...hookToast,
    toast: (options: UseToastOptions) => hookToast.toast(options),
  };
};

export { toast };
