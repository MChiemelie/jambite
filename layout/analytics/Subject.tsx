'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { Pie, PieChart, Label } from 'recharts';
import { BookOpenText, TrendingUp } from 'lucide-react';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { fetchPerformanceData } from '@/services/supabase';
import { Session } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Helper function to generate colors based on index
const generateColor = (index: number) => {
  const colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
  return colors[index % colors.length];
};

export default function Subject({ session }: { session: Session | null }) {
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch performance data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPerformanceData(session);
        setPerformanceData(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch performance data.');
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  // Prepare chart data with dynamic colors and configuration
  const chartData = React.useMemo(() => {
    return (
      performanceData?.mostAttemptedSubjects?.map((item: any, index: number) => ({
        subject: item.subject,
        attempts: item.attempts,
        fill: item.color || generateColor(index), // Assign specific colors or generate if not provided
      })) || []
    );
  }, [performanceData]);

  // Create dynamic chart configuration based on subjects
  const chartConfig: ChartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    chartData.forEach((item, index) => {
      config[item.subject] = {
        label: item.subject,
        color: item.fill,
      };
    });
    return config;
  }, [chartData]);

  // Calculate total attempts for display in the chart center
  const totalAttempts = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.attempts, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-sky-100 text-accent-1 mb-4">
          <BookOpenText />
        </div>
        <CardTitle>Most Attempted Subjects</CardTitle>
        <CardDescription>Performance Overview</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {loading && <p>Getting your most attempted subjects...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && chartData.length > 0 && (
          <ChartContainer className="mx-auto aspect-square max-h-[250px]" config={chartConfig}>
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie data={chartData} dataKey="attempts" nameKey="subject" innerRadius={60} strokeWidth={5}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                            {totalAttempts.toLocaleString()}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                            Attempts
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">Showing total attempts for the most attempted subjects</div>
      </CardFooter>
    </Card>
  );
}
