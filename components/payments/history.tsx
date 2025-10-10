'use client';

import { useEffect, useMemo, useState } from 'react';
import { Status } from '@/components/custom';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { Badge } from '@/components/shadcn/badge';
import { useDataTable } from '@/hooks/use-data-table';
import { getPayments } from '@/services/payments';
import type { ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, XCircle } from 'lucide-react';

interface Payment {
  reference: string;
  status: string;
  channel: string;
  amount: number;
  paid_at: string;
}

export default function History() {
  const [transactions, setTransactions] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const perPage = 10;
  const columns = useMemo<ColumnDef<Payment>[]>(
    () => [
      {
        id: 'reference',
        accessorKey: 'reference',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Reference" />,
        cell: ({ cell }) => <span className="uppercase">{cell.getValue<string>()}</span>,
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ cell }) => {
          const value = cell.getValue<string>();
          const success = value === 'success';
          const Icon = success ? CheckCircle2 : XCircle;

          return (
            <Badge variant="outline" className={`capitalize flex items-center gap-1 ${success ? 'text-green-600' : 'text-red-600'}`}>
              <Icon className="h-4 w-4" />
              {value}
            </Badge>
          );
        },
      },
      {
        id: 'channel',
        accessorKey: 'channel',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Method" />,
        cell: ({ cell }) => <span className="capitalize">{cell.getValue<string>()}</span>,
      },
      {
        id: 'amount',
        accessorKey: 'amount',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
        cell: ({ cell }) => `₦${(cell.getValue<number>() / 100).toFixed(2)}`,
      },
      {
        id: 'paid_at',
        accessorKey: 'paid_at',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
        cell: ({ cell }) => {
          const raw = cell.getValue<string>();
          const d = new Date(raw);
          return isNaN(d.getTime()) ? 'Invalid date' : d.toLocaleDateString('en-GB') + ' ' + d.toLocaleTimeString();
        },
      },
    ],
    []
  );

  const { table } = useDataTable({
    data: transactions,
    columns,
    pageCount: Math.max(1, Math.ceil(totalCount / perPage)),
    initialState: { pagination: { pageIndex: 0, pageSize: perPage } },
  });

  const pageIndex = table.getState().pagination.pageIndex;

  useEffect(() => {
    async function fetchPayments() {
      setLoading(true);
      setError(null);

      try {
        const res = await getPayments(pageIndex + 1, perPage);
        setTransactions(res.data || []);
        setTotalCount(res.total || 0);
      } catch (err: any) {
        console.error('Error fetching payments:', err);
        setError(err.message || 'Failed to load payment history');
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, [pageIndex]);

  if (loading) {
    return <Status image="/assets/payments.svg" desc1="Getting payments history" desc2="" />;
  }

  if (error) {
    return (
      <Status
        image="/assets/payments.svg"
        desc1="Failed to load payments"
        desc2={error}
      />
    );
  }

  if (!transactions.length) {
    return <Status image="/assets/payments.svg" desc1="No payments found" desc2="" />;
  }

  return (
    <div className="w-full max-w-[90vw] md:max-w-screen overflow-x-auto mx-auto">
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}