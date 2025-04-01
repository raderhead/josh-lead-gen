
import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface VirtualTourViewerProps {
  isOpen: boolean;
  onClose: () => void;
  virtualTourUrl: string;
}

const VirtualTourViewer: React.FC<VirtualTourViewerProps> = ({
  isOpen,
  onClose,
  virtualTourUrl,
}) => {
  if (!virtualTourUrl) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="p-0 h-[90vh] max-w-full border-t-0 rounded-t-lg">
        <div className="relative w-full h-full pt-10">
          <div className="absolute top-2 right-4 z-50">
            <Button 
              onClick={onClose}
              variant="outline"
              size="icon"
              className="bg-white/80 hover:bg-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <iframe 
            src={virtualTourUrl} 
            title="Virtual Tour"
            className="w-full h-full border-0"
            allowFullScreen
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default VirtualTourViewer;
