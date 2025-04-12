
import { useToast as useShadcnToast } from "@/components/ui/use-toast";

// Export with an interface that includes the success variant
export interface UseToastOptions {
  variant?: "default" | "destructive" | "success";
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export const useToast = () => {
  const hookToast = useShadcnToast();
  
  return {
    ...hookToast,
    toast: (options: UseToastOptions) => hookToast.toast(options),
  };
};

// Re-export the toast function from the shadcn implementation
export { toast } from "@/components/ui/use-toast";
