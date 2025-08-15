import { useState } from 'react';
import type { State } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Landmark, GraduationCap, Gavel, Search, Loader2 } from 'lucide-react';

interface StateSelectionProps {
  states: State[];
  onStateSelect: (state: State) => void;
  isLoading: boolean;
}

const StatItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
    <div className="flex items-center text-sm text-muted-foreground">
        {icon}
        <span className="ml-2 font-medium">{label}:</span>
        <span className="ml-auto font-semibold text-foreground">{value}</span>
    </div>
);

export default function StateSelection({ states, onStateSelect, isLoading }: StateSelectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);

  const filteredStates = states.filter(state =>
    state.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSelect = (state: State) => {
      setSelectedStateId(state.id);
      onStateSelect(state);
  }

  const formatGdp = (gdp: number) => {
    if (gdp === 0) return '₹0 Lk Cr';
    const gdpInCrores = gdp / 10000000;
    if (gdpInCrores >= 100000) {
        return `₹${(gdpInCrores / 100000).toFixed(2)} Lk Cr`;
    }
    return `₹${gdpInCrores.toFixed(0)} Cr`;
  }
  
  const formatPopulation = (population: number) => {
    if (population === 0) return '0.0M';
    return `${(population / 1_000_000).toFixed(1)}M`;
  }

  return (
    <div className="flex flex-col items-center animate-fade-in">
      <h1 className="text-4xl sm:text-5xl font-extrabold font-headline text-primary mb-2 tracking-tight">StateCraft</h1>
      <p className="text-lg text-muted-foreground mb-6 text-center">Choose your state to begin your political journey.</p>
      
      <div className="w-full max-w-md mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="text"
            placeholder="Search for a state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {filteredStates.map((state) => (
          <Card key={state.id} className="flex flex-col bg-card hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out">
            <CardHeader>
              <CardTitle className="text-2xl font-headline font-bold text-primary">{state.name}</CardTitle>
              <CardDescription>{state.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
                <h4 className="font-semibold mb-2 text-card-foreground/80">Starting Conditions:</h4>
                <StatItem icon={<Users size={16} className="text-accent" />} label="Population" value={formatPopulation(state.demographics.population)} />
                <StatItem icon={<Landmark size={16} className="text-accent"/>} label="GDP" value={formatGdp(state.demographics.gdp)} />
                <StatItem icon={<GraduationCap size={16} className="text-accent"/>} label="Literacy" value={`${state.demographics.literacyRate}%`} />
                <StatItem icon={<Gavel size={16} className="text-accent"/>} label="Crime Rate" value={`${state.demographics.crimeRate}`} />
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSelect(state)} 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 text-base"
                disabled={isLoading}
              >
                {isLoading && selectedStateId === state.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Begin Term as CM'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {filteredStates.length === 0 && (
        <div className="text-center py-16 w-full">
            <p className="text-muted-foreground text-lg">No states found matching your search.</p>
        </div>
      )}
    </div>
  );
}
