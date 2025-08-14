import type { Stats } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Landmark, Smile, Shield, Users, Briefcase } from 'lucide-react';

interface StatsDisplayProps {
  stats: Stats;
}

const StatCard = ({ title, value, icon, isPercentage = true, invertProgress = false }: { title: string; value: string | number; icon: React.ReactNode, isPercentage?: boolean, invertProgress?: boolean }) => {
    let numericValue = typeof value === 'number' ? value : parseFloat(value.toString());
    const displayValue = isPercentage ? `${numericValue.toFixed(0)}%` : `${numericValue.toFixed(0)}`;
    
    if (invertProgress) {
        numericValue = 100 - numericValue;
    }

    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{displayValue}</div>
                <Progress value={numericValue} className="mt-2 h-2" />
            </CardContent>
        </Card>
    );
};

export default function StatsDisplay({ stats }: StatsDisplayProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <StatCard title="Budget Health" value={stats.budget} icon={<Landmark className="h-4 w-4 text-muted-foreground" />} />
      <StatCard title="Public Opinion" value={stats.publicOpinion} icon={<Smile className="h-4 w-4 text-muted-foreground" />} />
      <StatCard title="Police Strength" value={stats.policeStrength} icon={<Shield className="h-4 w-4 text-muted-foreground" />} />
      <StatCard title="Opposition" value={stats.oppositionStrength} icon={<Users className="h-4 w-4 text-muted-foreground" />} invertProgress={true}/>
      <StatCard title="Unemployment" value={stats.unemploymentRate} icon={<Briefcase className="h-4 w-4 text-muted-foreground" />} invertProgress={true} />
    </div>
  );
}
