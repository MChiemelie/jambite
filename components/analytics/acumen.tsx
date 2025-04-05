'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/shadcn/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/shadcn/chart';
import { AcumenProps } from '@/types/analytics';

const subjects = ['Use of English', 'Mathematics', 'Commerce', 'Accounting', 'Biology', 'Physics', 'Chemistry', 'Lit. In English', 'Government', 'Christian Rel. Know', 'Geography', 'Economics', 'Islamic Rel. Know', 'Civic Education', 'History'];
const shortenSubjects = ['Eng', 'Math', 'Com', 'Acc', 'Bio', 'Phy', 'Chem', 'Lit', 'Govt', 'CRK', 'Geo', 'Eco', 'IRK', 'Civic', 'His'];
const subjectMapping = Object.fromEntries(subjects.map((subject, index) => [subject, shortenSubjects[index]]));

const chartConfig: ChartConfig = {
  correct: {
    label: 'Correct',
    color: 'hsl(var(--chart-1))',
  },
  incorrect: {
    label: 'Incorrect',
    color: 'hsl(var(--chart-2))',
  },
};

export default function Acumen({ data }: AcumenProps) {
  const processedData = data.map((item) => ({
    ...item,
    displaySubject: subjectMapping[item.subject] || item.subject,
  }));

  const bestSubject = data.reduce((best, current) => {
    const bestScore = best.correct / (best.incorrect + 1);
    const currentScore = current.correct / (current.incorrect + 1);
    return currentScore > bestScore ? current : best;
  }, data[0]);

  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <CardTitle className="text-center">Acumen</CardTitle>
        <CardDescription className="text-center">Judgment of questions</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={processedData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="displaySubject" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const subject = processedData.find((item) => item.displaySubject === value)?.subject;
                    return subject || value;
                  }}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="correct" stackId="a" fill="var(--color-correct)" radius={[0, 0, 4, 4]} />
            <Bar dataKey="incorrect" stackId="a" fill="var(--color-incorrect)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-center gap-2 text-sm">
        <p className="font-medium leading-none">
          Excellent in {bestSubject.subject}: {bestSubject.correct} correct, {bestSubject.incorrect} incorrect
        </p>
        <div className="leading-none text-muted-foreground">Assessing intelligence and judgment in answering questions</div>
      </CardFooter>
    </Card>
  );
}
