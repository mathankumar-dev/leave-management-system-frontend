import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'info' | 'destructive';
}

export function StatsCard({ title, value, subtitle, icon: Icon, variant = 'default' }: StatsCardProps) {
  const variantStyles = {
    default: 'text-muted-foreground bg-muted/20',
    primary: 'text-primary bg-primary/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    info: 'text-info bg-info/10',
    destructive: 'text-destructive bg-destructive/10',
  };

  return (
    <Card className="overflow-hidden border-none shadow-sm bg-card/50 backdrop-blur-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <div className={`p-2 rounded-lg ${variantStyles[variant]}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold tracking-tight">{value}</h2>
          {subtitle && (
            <p className="text-[11px] text-muted-foreground mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}