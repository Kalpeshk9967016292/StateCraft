import type { Stats } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Landmark, Smile, Shield, Users, Briefcase, Handshake, IndianRupee } from 'lucide-react';

interface StatsDisplayProps {
  stats: Stats;
}

const StatCard = ({ title, value, icon, isPercentage = true, invertProgress = false, isCurrency = false }: { title: string; value: string | number; icon: React.ReactNode, isPercentage?: boolean, invertProgress?: boolean, isCurrency?: boolean }) => {
    let numericValue = typeof value === 'number' ? value : parseFloat(value.toString());
    const displayValue = isCurrency ? `₹${numericValue.toFixed(0)} cr` : (isPercentage ? `${numericValue.toFixed(0)}%` : `${numericValue.toFixed(0)}`);
    
    let progressValue = numericValue;
    if (!isCurrency) {
        if (invertProgress) {
            progressValue = 100 - numericValue;
        }
    }


    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{displayValue}</div>
                {!isCurrency && <Progress value={progressValue} className="mt-2 h-2" />}
            </CardContent>
        </Card>
    );
};

export default function StatsDisplay({ stats }: StatsDisplayProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      <StatCard title="Budget" value={stats.budget} icon={<Landmark className="h-4 w-4 text-muted-foreground" />} isPercentage={false} isCurrency={true}/>
      <StatCard title="Revenue" value={stats.revenue} icon={<IndianRupee className="h-4 w-4 text-muted-foreground" />} isPercentage={false} isCurrency={true}/>
      <StatCard title="Public Approval" value={stats.publicApproval} icon={<Smile className="h-4 w-4 text-muted-foreground" />} />
      <StatCard title="Law & Order" value={stats.lawAndOrder} icon={<Shield className="h-4 w-4 text-muted-foreground" />} />
      <StatCard title="Economic Health" value={stats.economicHealth} icon={<Briefcase className="h-4 w-4 text-muted-foreground" />} />
      <StatCard title="Opposition" value={stats.oppositionStrength} icon={<Users className="h-4 w-4 text-muted-foreground" />} invertProgress={true}/>
      <StatCard title="Corruption" value={stats.corruptionLevel} icon={<Handshake className="h-4 w-4 text-muted-foreground" />} invertProgress={true} />
    </div>
  );
}
