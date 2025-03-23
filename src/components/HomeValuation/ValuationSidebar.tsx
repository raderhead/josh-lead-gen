
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ValuationSidebar = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Why Request a Valuation?</CardTitle>
        <CardDescription>
          Our expert valuation provides crucial insights for property owners
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium">Professional Assessment</h3>
          <p className="text-sm text-gray-500">
            Get a professional evaluation based on current market conditions and property features.
          </p>
        </div>
        <div>
          <h3 className="font-medium">Informed Decisions</h3>
          <p className="text-sm text-gray-500">
            Make better business decisions with accurate property valuations from experienced agents.
          </p>
        </div>
        <div>
          <h3 className="font-medium">Selling or Leasing</h3>
          <p className="text-sm text-gray-500">
            Determine optimal pricing strategy when selling or leasing your commercial property.
          </p>
        </div>
        <div>
          <h3 className="font-medium">Insurance Purposes</h3>
          <p className="text-sm text-gray-500">
            Ensure your property is properly insured with an accurate valuation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ValuationSidebar;
