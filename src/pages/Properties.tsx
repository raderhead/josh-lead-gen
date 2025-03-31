
import React, { useState } from "react";
import Layout from "@/components/Layout/Layout";
import PropertyList from "@/components/Property/PropertyList";
import PropertyFilters from "@/components/Property/PropertyFilters";
import PropertySearchInput from "@/components/Property/PropertySearchInput";
import { useUser } from "@/contexts/UserContext";

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    propertyType: [],
    minPrice: 0,
    maxPrice: 1000000,
    beds: "",
    baths: "",
  });
  const { user } = useUser();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (filters: any) => {
    setSelectedFilters(filters);
  };

  return (
    <Layout>
      {user && (
        <div className="bg-primary/10 py-3 px-4 text-center">
          <p className="text-primary font-medium">
            Welcome back, {user.name.split(' ')[0]}! Looking for your next property?
          </p>
        </div>
      )}
      <div className="container mx-auto py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            <div className="w-full lg:w-1/2">
              <PropertySearchInput onSearch={handleSearch} />
            </div>
            <PropertyFilters onFilterChange={handleFilterChange} />
          </div>
          <PropertyList searchTerm={searchTerm} filters={selectedFilters} />
        </div>
      </div>
    </Layout>
  );
};

export default Properties;
