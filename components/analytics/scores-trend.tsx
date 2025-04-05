'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/shadcn/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select';

const chartData = [
  { date: '2024-04-01', desktop: 222, mobile: 150, tablet: 186 },
  { date: '2024-04-02', desktop: 97, mobile: 180, tablet: 138 },
  { date: '2024-04-03', desktop: 167, mobile: 120, tablet: 144 },
  { date: '2024-04-04', desktop: 242, mobile: 260, tablet: 251 },
  { date: '2024-04-05', desktop: 373, mobile: 290, tablet: 332 },
  { date: '2024-04-06', desktop: 301, mobile: 340, tablet: 320 },
  { date: '2024-04-07', desktop: 245, mobile: 180, tablet: 213 },
  { date: '2024-04-08', desktop: 409, mobile: 320, tablet: 365 },
  { date: '2024-04-09', desktop: 59, mobile: 110, tablet: 85 },
  { date: '2024-04-10', desktop: 261, mobile: 190, tablet: 226 },
  { date: '2024-04-11', desktop: 327, mobile: 350, tablet: 339 },
  { date: '2024-04-12', desktop: 292, mobile: 210, tablet: 251 },
  { date: '2024-04-13', desktop: 342, mobile: 380, tablet: 361 },
  { date: '2024-04-14', desktop: 137, mobile: 220, tablet: 178 },
  { date: '2024-04-15', desktop: 120, mobile: 170, tablet: 145 },
  { date: '2024-04-16', desktop: 138, mobile: 190, tablet: 164 },
  { date: '2024-04-17', desktop: 446, mobile: 360, tablet: 403 },
  { date: '2024-04-18', desktop: 364, mobile: 410, tablet: 387 },
  { date: '2024-04-19', desktop: 243, mobile: 180, tablet: 212 },
  { date: '2024-04-20', desktop: 89, mobile: 150, tablet: 120 },
  { date: '2024-04-21', desktop: 137, mobile: 200, tablet: 169 },
  { date: '2024-04-22', desktop: 224, mobile: 170, tablet: 197 },
  { date: '2024-04-23', desktop: 138, mobile: 230, tablet: 184 },
  { date: '2024-04-24', desktop: 387, mobile: 290, tablet: 339 },
  { date: '2024-04-25', desktop: 215, mobile: 250, tablet: 233 },
  { date: '2024-04-26', desktop: 75, mobile: 130, tablet: 102 },
  { date: '2024-04-27', desktop: 383, mobile: 420, tablet: 402 },
  { date: '2024-04-28', desktop: 122, mobile: 180, tablet: 151 },
  { date: '2024-04-29', desktop: 315, mobile: 240, tablet: 278 },
  { date: '2024-04-30', desktop: 454, mobile: 380, tablet: 417 },
  { date: '2024-05-01', desktop: 165, mobile: 220, tablet: 193 },
  { date: '2024-05-02', desktop: 293, mobile: 310, tablet: 302 },
  { date: '2024-05-03', desktop: 247, mobile: 190, tablet: 219 },
  { date: '2024-05-04', desktop: 385, mobile: 420, tablet: 403 },
  { date: '2024-05-05', desktop: 481, mobile: 390, tablet: 436 },
  { date: '2024-05-06', desktop: 498, mobile: 520, tablet: 509 },
  { date: '2024-05-07', desktop: 388, mobile: 300, tablet: 344 },
  { date: '2024-05-08', desktop: 149, mobile: 210, tablet: 180 },
  { date: '2024-05-09', desktop: 227, mobile: 180, tablet: 204 },
  { date: '2024-05-10', desktop: 293, mobile: 330, tablet: 312 },
  { date: '2024-05-11', desktop: 335, mobile: 270, tablet: 303 },
  { date: '2024-05-12', desktop: 197, mobile: 240, tablet: 219 },
  { date: '2024-05-13', desktop: 197, mobile: 160, tablet: 179 },
  { date: '2024-05-14', desktop: 448, mobile: 490, tablet: 469 },
  { date: '2024-05-15', desktop: 473, mobile: 380, tablet: 427 },
  { date: '2024-05-16', desktop: 338, mobile: 400, tablet: 369 },
  { date: '2024-05-17', desktop: 499, mobile: 420, tablet: 460 },
  { date: '2024-05-18', desktop: 315, mobile: 350, tablet: 333 },
  { date: '2024-05-19', desktop: 235, mobile: 180, tablet: 208 },
  { date: '2024-05-20', desktop: 177, mobile: 230, tablet: 204 },
  { date: '2024-05-21', desktop: 82, mobile: 140, tablet: 111 },
  { date: '2024-05-22', desktop: 81, mobile: 120, tablet: 100 },
  { date: '2024-05-23', desktop: 252, mobile: 290, tablet: 271 },
  { date: '2024-05-24', desktop: 294, mobile: 220, tablet: 257 },
  { date: '2024-05-25', desktop: 201, mobile: 250, tablet: 226 },
  { date: '2024-05-26', desktop: 213, mobile: 170, tablet: 192 },
  { date: '2024-05-27', desktop: 420, mobile: 460, tablet: 440 },
  { date: '2024-05-28', desktop: 233, mobile: 190, tablet: 212 },
  { date: '2024-05-29', desktop: 78, mobile: 130, tablet: 104 },
  { date: '2024-05-30', desktop: 340, mobile: 280, tablet: 310 },
  { date: '2024-05-31', desktop: 178, mobile: 230, tablet: 204 },
  { date: '2024-06-01', desktop: 178, mobile: 200, tablet: 189 },
  { date: '2024-06-02', desktop: 470, mobile: 410, tablet: 440 },
  { date: '2024-06-03', desktop: 103, mobile: 160, tablet: 131 },
  { date: '2024-06-04', desktop: 439, mobile: 380, tablet: 409 },
  { date: '2024-06-05', desktop: 88, mobile: 140, tablet: 114 },
  { date: '2024-06-06', desktop: 294, mobile: 250, tablet: 272 },
  { date: '2024-06-07', desktop: 323, mobile: 370, tablet: 347 },
  { date: '2024-06-08', desktop: 385, mobile: 320, tablet: 353 },
  { date: '2024-06-09', desktop: 438, mobile: 480, tablet: 459 },
  { date: '2024-06-10', desktop: 155, mobile: 200, tablet: 178 },
  { date: '2024-06-11', desktop: 92, mobile: 150, tablet: 121 },
  { date: '2024-06-12', desktop: 492, mobile: 420, tablet: 456 },
  { date: '2024-06-13', desktop: 81, mobile: 130, tablet: 106 },
  { date: '2024-06-14', desktop: 426, mobile: 380, tablet: 403 },
  { date: '2024-06-15', desktop: 307, mobile: 350, tablet: 329 },
  { date: '2024-06-16', desktop: 371, mobile: 310, tablet: 341 },
  { date: '2024-06-17', desktop: 475, mobile: 520, tablet: 498 },
  { date: '2024-06-18', desktop: 107, mobile: 170, tablet: 139 },
  { date: '2024-06-19', desktop: 341, mobile: 290, tablet: 316 },
  { date: '2024-06-20', desktop: 408, mobile: 450, tablet: 429 },
  { date: '2024-06-21', desktop: 169, mobile: 210, tablet: 189 },
  { date: '2024-06-22', desktop: 317, mobile: 270, tablet: 294 },
  { date: '2024-06-23', desktop: 480, mobile: 530, tablet: 505 },
  { date: '2024-06-24', desktop: 132, mobile: 180, tablet: 156 },
  { date: '2024-06-25', desktop: 141, mobile: 190, tablet: 166 },
  { date: '2024-06-26', desktop: 434, mobile: 380, tablet: 407 },
  { date: '2024-06-27', desktop: 448, mobile: 490, tablet: 469 },
  { date: '2024-06-28', desktop: 149, mobile: 200, tablet: 174 },
  { date: '2024-06-29', desktop: 103, mobile: 160, tablet: 132 },
  { date: '2024-06-30', desktop: 446, mobile: 400, tablet: 423 },
];

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--chart-2))',
  },
  tablet: {
    label: 'Tablet',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export default function ScoresTrend() {
  const [timeRange, setTimeRange] = React.useState('90d');

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date('2024-06-30');
    let daysToSubtract = 90;
    if (timeRange === '30d') {
      daysToSubtract = 30;
    } else if (timeRange === '7d') {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="bg-muted/50">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Area Chart - Interactive</CardTitle>
          <CardDescription>Showing total visitors for the last 3 months</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select a value">
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillTablet" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-tablet)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-tablet)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area dataKey="mobile" type="natural" fill="url(#fillMobile)" stroke="var(--color-mobile)" stackId="a" />
            <Area dataKey="desktop" type="natural" fill="url(#fillDesktop)" stroke="var(--color-desktop)" stackId="a" />
            <Area dataKey="tablet" type="natural" fill="url(#fillTablet)" stroke="var(--color-tablet)" stackId="a" />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
