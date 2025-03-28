
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ChevronLeft, MapPin, School, Building, Home, BarChart2, Pool, DollarSign, BadgePercent, Map, Shield } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// This would typically come from an API
const neighborhoodData = {
  'abilene': {
    name: 'Abilene',
    longDescription: 'Abilene is the commercial heart of the region, offering a diverse range of properties from retail spaces to office buildings. With strong foot traffic and growing business community, it's an ideal location for both established businesses and startups.',
    imageUrl: '/public/lovable-uploads/55deabfb-d38d-4cf3-ad88-d5e416c3ae39.png',
    stats: {
      totalListings: 42,
      avgPrice: '$450,000',
      priceChange: '+3.2%',
      medianPrice: '$425,000',
      avgDaysOnMarket: 28
    },
    priceHistory: [
      { month: 'Jan', price: 440000 },
      { month: 'Feb', price: 442000 },
      { month: 'Mar', price: 445000 },
      { month: 'Apr', price: 448000 },
      { month: 'May', price: 450000 },
      { month: 'Jun', price: 455000 },
    ],
    bedroomPrices: [
      { bedrooms: '1 Bedroom', avgPrice: '$285,000' },
      { bedrooms: '2 Bedrooms', avgPrice: '$365,000' },
      { bedrooms: '3 Bedrooms', avgPrice: '$450,000' },
      { bedrooms: '4+ Bedrooms', avgPrice: '$525,000' },
    ],
    propertyTypes: [
      { type: 'Retail', count: 12, avgPrice: '$475,000' },
      { type: 'Office', count: 18, avgPrice: '$525,000' },
      { type: 'Industrial', count: 8, avgPrice: '$650,000' },
      { type: 'Mixed Use', count: 4, avgPrice: '$725,000' },
    ],
    specialProperties: {
      distressed: 5,
      multiMillion: 8,
      newBuilt: 12,
      withPool: 6,
      reducedPrice: 9
    },
    schoolDistricts: [
      { name: 'East Abilene', homes: 15, avgPrice: '$435,000', avgDays: 32 },
      { name: 'West Abilene', homes: 14, avgPrice: '$465,000', avgDays: 26 },
      { name: 'South Abilene', homes: 13, avgPrice: '$420,000', avgDays: 30 },
    ],
    avgBedrooms: 2.8,
    avgBathrooms: 2.2,
    mapCoordinates: {
      lat: 32.4487,
      lng: -99.7331
    }
  },
  'buffalo-gap': {
    name: 'Buffalo Gap',
    longDescription: 'Buffalo Gap offers the perfect blend of rural charm and commercial opportunity. Properties here feature generous space, lower costs than downtown, while still maintaining proximity to major transportation routes.',
    imageUrl: '/public/lovable-uploads/55deabfb-d38d-4cf3-ad88-d5e416c3ae39.png',
    stats: {
      totalListings: 28,
      avgPrice: '$320,000',
      priceChange: '+2.5%',
      medianPrice: '$310,000',
      avgDaysOnMarket: 35
    },
    priceHistory: [
      { month: 'Jan', price: 310000 },
      { month: 'Feb', price: 312000 },
      { month: 'Mar', price: 315000 },
      { month: 'Apr', price: 317000 },
      { month: 'May', price: 319000 },
      { month: 'Jun', price: 320000 },
    ],
    bedroomPrices: [
      { bedrooms: '1 Bedroom', avgPrice: '$220,000' },
      { bedrooms: '2 Bedrooms', avgPrice: '$275,000' },
      { bedrooms: '3 Bedrooms', avgPrice: '$320,000' },
      { bedrooms: '4+ Bedrooms', avgPrice: '$380,000' },
    ],
    propertyTypes: [
      { type: 'Retail', count: 6, avgPrice: '$310,000' },
      { type: 'Office', count: 10, avgPrice: '$340,000' },
      { type: 'Industrial', count: 9, avgPrice: '$380,000' },
      { type: 'Mixed Use', count: 3, avgPrice: '$420,000' },
    ],
    specialProperties: {
      distressed: 3,
      multiMillion: 2,
      newBuilt: 8,
      withPool: 4,
      reducedPrice: 5
    },
    schoolDistricts: [
      { name: 'Buffalo Gap Elementary', homes: 14, avgPrice: '$315,000', avgDays: 36 },
      { name: 'Buffalo Gap High', homes: 14, avgPrice: '$325,000', avgDays: 34 },
    ],
    avgBedrooms: 2.5,
    avgBathrooms: 2.0,
    mapCoordinates: {
      lat: 32.2810,
      lng: -99.8288
    }
  },
  'eastland': {
    name: 'Eastland',
    longDescription: 'Eastland is known for its premium commercial spaces and luxury developments. This area attracts high-end retail, professional services, and businesses looking for prestige locations with modern amenities and upscale surroundings.',
    imageUrl: '/public/lovable-uploads/55deabfb-d38d-4cf3-ad88-d5e416c3ae39.png',
    stats: {
      totalListings: 24,
      avgPrice: '$520,000',
      priceChange: '+4.1%',
      medianPrice: '$510,000',
      avgDaysOnMarket: 25
    },
    priceHistory: [
      { month: 'Jan', price: 495000 },
      { month: 'Feb', price: 500000 },
      { month: 'Mar', price: 505000 },
      { month: 'Apr', price: 510000 },
      { month: 'May', price: 515000 },
      { month: 'Jun', price: 520000 },
    ],
    bedroomPrices: [
      { bedrooms: '1 Bedroom', avgPrice: '$320,000' },
      { bedrooms: '2 Bedrooms', avgPrice: '$420,000' },
      { bedrooms: '3 Bedrooms', avgPrice: '$515,000' },
      { bedrooms: '4+ Bedrooms', avgPrice: '$650,000' },
    ],
    propertyTypes: [
      { type: 'Retail', count: 8, avgPrice: '$540,000' },
      { type: 'Office', count: 10, avgPrice: '$580,000' },
      { type: 'Industrial', count: 4, avgPrice: '$620,000' },
      { type: 'Mixed Use', count: 2, avgPrice: '$850,000' },
    ],
    specialProperties: {
      distressed: 2,
      multiMillion: 6,
      newBuilt: 9,
      withPool: 8,
      reducedPrice: 4
    },
    schoolDistricts: [
      { name: 'North Eastland', homes: 12, avgPrice: '$505,000', avgDays: 23 },
      { name: 'South Eastland', homes: 12, avgPrice: '$535,000', avgDays: 27 },
    ],
    avgBedrooms: 3.1,
    avgBathrooms: 2.5,
    mapCoordinates: {
      lat: 32.4049,
      lng: -98.8178
    }
  },
  'tuscola': {
    name: 'Tuscola',
    longDescription: 'Tuscola is an emerging commercial hub with rapid development and growth. Businesses benefit from newer infrastructure, competitive pricing, and a strategic location that's becoming increasingly connected to the broader regional economy.',
    imageUrl: '/public/lovable-uploads/55deabfb-d38d-4cf3-ad88-d5e416c3ae39.png',
    stats: {
      totalListings: 32,
      avgPrice: '$380,000',
      priceChange: '+3.8%',
      medianPrice: '$375,000',
      avgDaysOnMarket: 30
    },
    priceHistory: [
      { month: 'Jan', price: 360000 },
      { month: 'Feb', price: 365000 },
      { month: 'Mar', price: 370000 },
      { month: 'Apr', price: 372000 },
      { month: 'May', price: 375000 },
      { month: 'Jun', price: 380000 },
    ],
    bedroomPrices: [
      { bedrooms: '1 Bedroom', avgPrice: '$250,000' },
      { bedrooms: '2 Bedrooms', avgPrice: '$310,000' },
      { bedrooms: '3 Bedrooms', avgPrice: '$380,000' },
      { bedrooms: '4+ Bedrooms', avgPrice: '$450,000' },
    ],
    propertyTypes: [
      { type: 'Retail', count: 9, avgPrice: '$370,000' },
      { type: 'Office', count: 12, avgPrice: '$390,000' },
      { type: 'Industrial', count: 8, avgPrice: '$425,000' },
      { type: 'Mixed Use', count: 3, avgPrice: '$480,000' },
    ],
    specialProperties: {
      distressed: 4,
      multiMillion: 3,
      newBuilt: 14,
      withPool: 5,
      reducedPrice: 7
    },
    schoolDistricts: [
      { name: 'Tuscola Elementary', homes: 16, avgPrice: '$375,000', avgDays: 29 },
      { name: 'Tuscola High', homes: 16, avgPrice: '$385,000', avgDays: 31 },
    ],
    avgBedrooms: 2.7,
    avgBathrooms: 2.3,
    mapCoordinates: {
      lat: 32.2099,
      lng: -99.7976
    }
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

const NeighborhoodDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const neighborhood = slug ? neighborhoodData[slug as keyof typeof neighborhoodData] : null;

  if (!neighborhood) {
    return (
      <Layout>
        <div className="py-12 px-4 max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Neighborhood Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            The neighborhood you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/neighborhoods">Return to All Neighborhoods</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header & Introduction */}
      <section className="relative">
        <div className="h-64 md:h-96 w-full overflow-hidden">
          <img
            src={neighborhood.imageUrl}
            alt={`${neighborhood.name} neighborhood`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
        <div className="absolute bottom-0 w-full p-6 md:p-12 text-white">
          <Button asChild variant="outline" size="sm" className="mb-4 bg-white/20 backdrop-blur-sm border-white/40 hover:bg-white/30 text-white">
            <Link to="/neighborhoods" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Neighborhoods
            </Link>
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold">{neighborhood.name}</h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* City Snapshot */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">About {neighborhood.name}</h2>
              <p className="text-lg text-gray-700 mb-6">
                {neighborhood.longDescription}
              </p>
              
              <div className="bg-estate-light-blue/30 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Why Choose {neighborhood.name}</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-estate-blue mt-0.5" />
                    <span>Strategic location with excellent accessibility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Building className="h-5 w-5 text-estate-blue mt-0.5" />
                    <span>Range of property types to suit different business needs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-estate-blue mt-0.5" />
                    <span>Safe community with strong business network</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Location</h3>
              <div className="bg-gray-200 rounded-lg overflow-hidden flex-grow">
                <div className="h-full w-full">
                  {/* This would be replaced with an actual map */}
                  <div className="h-full w-full flex items-center justify-center bg-estate-light-blue p-6 text-center">
                    <div>
                      <Map className="h-10 w-10 mx-auto mb-3 text-estate-blue" />
                      <p className="text-sm text-gray-600">
                        Interactive map would be displayed here<br />
                        Coordinates: {neighborhood.mapCoordinates.lat}, {neighborhood.mapCoordinates.lng}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Market Report */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Market Report</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Card className="bg-white">
              <CardContent className="pt-6">
                <h3 className="text-sm font-medium text-gray-500">Total Listings</h3>
                <p className="text-3xl font-bold text-estate-blue">{neighborhood.stats.totalListings}</p>
                <p className="text-sm text-gray-600">Available properties</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-sm font-medium text-gray-500">Average Price</h3>
                <p className="text-3xl font-bold text-estate-blue">{neighborhood.stats.avgPrice}</p>
                <p className="text-sm text-gray-600">Year-over-year: <span className="text-green-600">{neighborhood.stats.priceChange}</span></p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-sm font-medium text-gray-500">Median Price</h3>
                <p className="text-3xl font-bold text-estate-blue">{neighborhood.stats.medianPrice}</p>
                <p className="text-sm text-gray-600">Market middle point</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-sm font-medium text-gray-500">Avg. Days on Market</h3>
                <p className="text-3xl font-bold text-estate-blue">{neighborhood.stats.avgDaysOnMarket}</p>
                <p className="text-sm text-gray-600">Before selling</p>
              </CardContent>
            </Card>
            
            <Card className="bg-estate-light-blue/30">
              <CardContent className="pt-6">
                <h3 className="text-sm font-medium text-gray-600">Property Breakdown</h3>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm">Average Bedrooms:</span>
                    <span className="font-medium">{neighborhood.avgBedrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Average Bathrooms:</span>
                    <span className="font-medium">{neighborhood.avgBathrooms}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Price Trends */}
        <section className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Price Trends</h2>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 h-[300px]">
              <ChartContainer
                config={{
                  price: {
                    label: "Price",
                    theme: {
                      light: "#0052CC",
                      dark: "#2684FF",
                    },
                  },
                }}
              >
                <AreaChart
                  data={neighborhood.priceHistory}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0052CC" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0052CC" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" />
                  <YAxis 
                    tickFormatter={(value) => `$${value/1000}k`}
                  />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2 border border-gray-200 shadow-sm rounded">
                            <p className="font-medium">{payload[0].payload.month}</p>
                            <p className="text-estate-blue">
                              {formatCurrency(payload[0].value as number)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#0052CC" 
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Price Breakdown by Property Type</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property Type</TableHead>
                  <TableHead>Count</TableHead>
                  <TableHead>Avg. Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {neighborhood.propertyTypes.map((type) => (
                  <TableRow key={type.type}>
                    <TableCell className="font-medium">{type.type}</TableCell>
                    <TableCell>{type.count}</TableCell>
                    <TableCell>{type.avgPrice}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Average Price by Bedrooms</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Size</TableHead>
                  <TableHead>Avg. Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {neighborhood.bedroomPrices.map((item) => (
                  <TableRow key={item.bedrooms}>
                    <TableCell className="font-medium">{item.bedrooms}</TableCell>
                    <TableCell>{item.avgPrice}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
        
        {/* Special Property Types */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Specialized Property Types</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Link to={`/properties?neighborhood=${slug}&reduced=true`} className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="pt-6 h-full flex flex-col items-center justify-center text-center p-6">
                  <BadgePercent className="h-8 w-8 text-red-500 mb-2" />
                  <h3 className="font-medium mb-1">Reduced Price</h3>
                  <p className="text-2xl font-bold text-gray-900">{neighborhood.specialProperties.reducedPrice}</p>
                  <p className="text-sm text-gray-500">Properties</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to={`/properties?neighborhood=${slug}&distressed=true`} className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="pt-6 h-full flex flex-col items-center justify-center text-center p-6">
                  <Home className="h-8 w-8 text-yellow-500 mb-2" />
                  <h3 className="font-medium mb-1">Distressed</h3>
                  <p className="text-2xl font-bold text-gray-900">{neighborhood.specialProperties.distressed}</p>
                  <p className="text-sm text-gray-500">Properties</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to={`/properties?neighborhood=${slug}&luxury=true`} className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="pt-6 h-full flex flex-col items-center justify-center text-center p-6">
                  <DollarSign className="h-8 w-8 text-green-500 mb-2" />
                  <h3 className="font-medium mb-1">Multi-Million</h3>
                  <p className="text-2xl font-bold text-gray-900">{neighborhood.specialProperties.multiMillion}</p>
                  <p className="text-sm text-gray-500">Properties</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to={`/properties?neighborhood=${slug}&new=true`} className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="pt-6 h-full flex flex-col items-center justify-center text-center p-6">
                  <Building className="h-8 w-8 text-blue-500 mb-2" />
                  <h3 className="font-medium mb-1">Newly Built</h3>
                  <p className="text-2xl font-bold text-gray-900">{neighborhood.specialProperties.newBuilt}</p>
                  <p className="text-sm text-gray-500">Properties</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to={`/properties?neighborhood=${slug}&pool=true`} className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="pt-6 h-full flex flex-col items-center justify-center text-center p-6">
                  <Pool className="h-8 w-8 text-cyan-500 mb-2" />
                  <h3 className="font-medium mb-1">With Pool</h3>
                  <p className="text-2xl font-bold text-gray-900">{neighborhood.specialProperties.withPool}</p>
                  <p className="text-sm text-gray-500">Properties</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>
        
        {/* School District Data */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            <div className="flex items-center gap-2">
              <School className="h-6 w-6 text-estate-blue" />
              <span>School Districts</span>
            </div>
          </h2>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>District</TableHead>
                <TableHead>Total Homes</TableHead>
                <TableHead>Avg. Price</TableHead>
                <TableHead>Avg. Days on Market</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {neighborhood.schoolDistricts.map((district) => (
                <TableRow key={district.name}>
                  <TableCell className="font-medium">{district.name}</TableCell>
                  <TableCell>{district.homes}</TableCell>
                  <TableCell>{district.avgPrice}</TableCell>
                  <TableCell>{district.avgDays}</TableCell>
                  <TableCell>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/properties?district=${district.name}`}>
                        View Properties
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
        
        {/* Call to Action */}
        <section className="rounded-lg bg-estate-light-blue p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Interested in {neighborhood.name} Properties?</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-6">
            Our team of local experts can help you find the perfect property in {neighborhood.name} for your business needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild className="bg-estate-blue hover:bg-estate-blue/90">
              <Link to={`/properties?neighborhood=${slug}`} className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Browse {neighborhood.name} Properties
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-estate-blue text-estate-blue hover:bg-estate-light-blue/50">
              <Link to="/contact" className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact an Agent
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default NeighborhoodDetail;
