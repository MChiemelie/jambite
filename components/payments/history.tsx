'use client';

import { useEffect, useState } from 'react';
import { Status } from '@/components/custom';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/shadcn/table';
import { getPayments } from '@/services/payments';

export default function History() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const perPage = 10;

  useEffect(() => {
    async function fetchPayments() {
      setLoading(true);
      try {
        const data = await getPayments(currentPage, perPage);
        const fetchedTransactions = data.data || [];
        setTransactions(fetchedTransactions);

        setTotalPages(Math.ceil((data.meta?.total || 0) / perPage));
        setTotalAmount(fetchedTransactions.reduce((sum, payment) => sum + (payment.amount || 0) / 100, 0));
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  if (loading) {
    return <Status image="/assets/payments.svg" desc1="Getting payments..." desc2="" />;
  }

  if (transactions.length === 0) {
    return <Status image="/assets/payments.svg" desc1="You've not made any payment(s) yet" desc2="" />;
  }

  return (
    <div className="overflow-x-auto min-w-0">
      <Table className="scroll-content rounded min-w-full overflow-x-auto">
        <TableCaption className="text-xs md:text-md">A list of your recent payments.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center text-xs md:text-md sticky left-0 bg-white dark:bg-gray-900 z-10 w-24">Invoice</TableHead>
            <TableHead className="text-center text-xs md:text-md">Status</TableHead>
            <TableHead className="text-center text-xs md:text-md">Method</TableHead>
            <TableHead className="text-center text-xs md:text-md">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.reference}>
              <TableCell className="text-center text-xs md:text-md sticky left-0 bg-white dark:bg-gray-900 z-10 w-24">{transaction.reference}</TableCell>
              <TableCell className="text-center text-xs md:text-md capitalize">{transaction.status}</TableCell>
              <TableCell className="text-center text-xs md:text-md capitalize">{transaction.channel}</TableCell>
              <TableCell className="text-center text-xs md:text-md">₦{(transaction.amount / 100).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <div className="flex justify-evenly items-center mt-4 text-xs md:text-md">
          <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-2 py-1 md:px-4 md:py-2 bg-foreground text-background rounded disabled:opacity-50">
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-2 py-1 md:px-4 md:py-2 bg-foreground text-background rounded disabled:opacity-50">
            Next
          </button>
        </div>
      )}
    </div>
  );
}
