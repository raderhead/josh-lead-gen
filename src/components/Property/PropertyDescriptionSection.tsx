
import React from 'react';

interface PropertyDescriptionSectionProps {
  description: string;
  remarks?: string;
}

const PropertyDescriptionSection: React.FC<PropertyDescriptionSectionProps> = ({
  description,
  remarks,
}) => {
  return (
    <div className="mb-6 bg-secondary p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center">
          <span className="text-primary">ⓘ</span>
        </div>
        <h3 className="text-xl font-semibold text-primary">Description</h3>
      </div>
      <p className="ml-10 text-foreground whitespace-pre-line">
        {remarks || description}
      </p>
    </div>
  );
};

export default PropertyDescriptionSection;
