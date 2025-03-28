
import { useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

interface PropertyFiltersProps {
  onFilterChange: (filters: any) => void;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    city: '',
    minPrice: 0,
    maxPrice: 1000000,
    beds: 0,
    baths: 0,
    propertyType: 'any',
    hasPool: false,
    hasGarage: false
  });

  const isLandProperty = filters.propertyType === 'Land';

  const handleChange = (name: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4">
        <div className="flex-1">
          <Label htmlFor="location" className="mb-1 block">Location</Label>
          <Input
            id="location"
            placeholder="City, Zip, or Neighborhood"
            value={filters.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="w-full md:w-32">
          <Label htmlFor="beds" className="mb-1 block">Beds</Label>
          <Select
            value={filters.beds.toString()}
            onValueChange={(value) => handleChange('beds', parseInt(value))}
          >
            <SelectTrigger id="beds">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-32">
          <Label htmlFor="baths" className="mb-1 block">Baths</Label>
          <Select
            value={filters.baths.toString()}
            onValueChange={(value) => handleChange('baths', parseInt(value))}
          >
            <SelectTrigger id="baths">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-auto">
          <Button type="submit" className="bg-estate-blue hover:bg-estate-dark-blue flex-1 w-full">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </div>
      
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center text-sm text-gray-500">
            Advanced Filters
            {isOpen ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div>
              <Label className="mb-2 block">Price Range</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleChange('minPrice', Number(e.target.value))}
                  className="w-full"
                />
                <span>to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleChange('maxPrice', Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="propertyType" className="mb-2 block">Property Type</Label>
              <Select
                value={filters.propertyType}
                onValueChange={(value) => handleChange('propertyType', value)}
              >
                <SelectTrigger id="propertyType">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="Single Family">Single Family</SelectItem>
                  <SelectItem value="Condo">Condo</SelectItem>
                  <SelectItem value="Townhouse">Townhouse</SelectItem>
                  <SelectItem value="Multi Family">Multi Family</SelectItem>
                  <SelectItem value="Land">Land</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="hasPool" className="cursor-pointer">Has Pool</Label>
                <Switch
                  id="hasPool"
                  checked={filters.hasPool}
                  onCheckedChange={(checked) => handleChange('hasPool', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="hasGarage" className="cursor-pointer">Has Garage</Label>
                <Switch
                  id="hasGarage"
                  checked={filters.hasGarage}
                  onCheckedChange={(checked) => handleChange('hasGarage', checked)}
                />
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </form>
  );
};

export default PropertyFilters;
