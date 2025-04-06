
import React from 'react';
import { LogIn } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuthDialog } from "@/contexts/AuthDialogContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthDialog: React.FC<AuthDialogProps> = ({ open, onOpenChange }) => {
  const { openLogin, openSignup } = useAuthDialog();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign in required</DialogTitle>
          <DialogDescription>
            You need to be signed in to use the property questionnaire. 
            Please sign in or create an account to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button
            className="w-full bg-estate-blue hover:bg-estate-dark-blue"
            onClick={() => {
              onOpenChange(false);
              openLogin();
            }}
          >
            <LogIn className="mr-2 h-4 w-4" />
            Sign in
          </Button>
          <Button
            variant="outline" 
            className="w-full"
            onClick={() => {
              onOpenChange(false);
              openSignup();
            }}
          >
            Create an account
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
