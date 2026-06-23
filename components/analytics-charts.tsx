'use client'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { approvalTrend, loanMix, monthlyVolume } from '@/lib/data'

const volumeConfig = {
  approved: { label: 'Approved', color: 'var(--chart-1)' },
  rejected: { label: 'Rejected', color: 'var(--chart-5)' },
} satisfies ChartConfig

const trendConfig = {
  rate: { label: 'Approval rate', color: 'var(--chart-2)' },
} satisfies ChartConfig

const mixConfig = {
  value: { label: 'Share' },
  home: { label: 'Home', color: 'var(--chart-1)' },
  auto: { label: 'Auto', color: 'var(--chart-2)' },
  business: { label: 'Business', color: 'var(--chart-3)' },
  personal: { label: 'Personal', color: 'var(--chart-4)' },
  education: { label: 'Education', color: 'var(--chart-5)' },
} satisfies ChartConfig

export function VolumeChart() {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Application volume</CardTitle>
        <CardDescription>
          Approved vs. rejected decisions over the last 7 months.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={volumeConfig} className="h-72 w-full">
          <BarChart data={monthlyVolume} accessibilityLayer>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={28} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="approved" fill="var(--color-approved)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="rejected" fill="var(--color-rejected)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function ApprovalTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Approval rate</CardTitle>
        <CardDescription>Weekly trend, last 8 weeks.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={trendConfig} className="h-72 w-full">
          <AreaChart data={approvalTrend} accessibilityLayer>
            <defs>
              <linearGradient id="fillRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-rate)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-rate)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={32}
              domain={[60, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="rate"
              type="monotone"
              stroke="var(--color-rate)"
              strokeWidth={2}
              fill="url(#fillRate)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function LoanMixChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio mix</CardTitle>
        <CardDescription>Share of active loans by product.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={mixConfig}
          className="mx-auto aspect-square h-64"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={loanMix}
              dataKey="value"
              nameKey="type"
              innerRadius={56}
              strokeWidth={4}
            >
              {loanMix.map((entry) => (
                <Cell key={entry.type} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="type" />}
              className="flex-wrap gap-2"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
