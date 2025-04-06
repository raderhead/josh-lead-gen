
import React from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface QuizRetakeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  lastSubmissionDate: Date;
  onRetake: () => void;
}

const QuizRetakeDialog: React.FC<QuizRetakeDialogProps> = ({
  open,
  onOpenChange,
  userName,
  lastSubmissionDate,
  onRetake,
}) => {
  const formattedDate = format(lastSubmissionDate, 'MMMM dd, yyyy');
  const formattedTime = format(lastSubmissionDate, 'h:mm a');

  const handleRetake = () => {
    onOpenChange(false);
    onRetake();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Already Submitted</DialogTitle>
          <DialogDescription>
            Hey {userName}, looks like you've already submitted a questionnaire on {formattedDate} at {formattedTime}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-gray-700">
            Are you sure you want to submit another questionnaire? Your previous responses are already being reviewed.
          </p>
        </div>
        
        <DialogFooter className="sm:justify-start gap-2 flex flex-col sm:flex-row">
          <Button
            type="button" 
            variant="default"
            className="bg-estate-blue hover:bg-estate-dark-blue w-full sm:w-auto" 
            onClick={handleRetake}
          >
            Yes, Submit New Response
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuizRetakeDialog;
