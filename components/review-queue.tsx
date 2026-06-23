'use client'

import { useState } from 'react'
import { applications, statusLabels, type LoanStatus } from '@/lib/data'
import { ApplicationsTable } from '@/components/applications-table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const filters: { value: 'all' | LoanStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'submitted', label: statusLabels.submitted },
  { value: 'under-review', label: statusLabels['under-review'] },
  { value: 'approved', label: statusLabels.approved },
  { value: 'rejected', label: statusLabels.rejected },
]

export function ReviewQueue() {
  const [filter, setFilter] = useState<'all' | LoanStatus>('all')

  const filtered =
    filter === 'all'
      ? applications
      : applications.filter((a) => a.status === filter)

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-1">
          <CardTitle>Review queue</CardTitle>
          <CardDescription>
            {filtered.length} application{filtered.length !== 1 && 's'} matching
            this filter.
          </CardDescription>
        </div>
        <Tabs
          value={filter}
          onValueChange={(v) => setFilter(v as 'all' | LoanStatus)}
        >
          <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
            {filters.map((f) => (
              <TabsTrigger key={f.value} value={f.value}>
                {f.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="px-0 sm:px-2">
        <ApplicationsTable data={filtered} />
      </CardContent>
    </Card>
  )
}
