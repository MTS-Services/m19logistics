import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus, Search } from 'lucide-react';
import { dummyInvoices, formatMoney, formatDate } from './contractorDummyData';

const statusStyles = {
  Paid: 'bg-green-100 text-green-700',
  Outstanding: 'bg-amber-100 text-amber-800',
};

const ContractorInvoices = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [invoices] = useState(dummyInvoices);

  const filtered = invoices.filter(
    (inv) =>
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.period.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-3 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">My Invoices</h1>
          <p className="mt-2 text-gray-600">
            Invoices submitted to M19 Logistics — dummy data
          </p>
        </div>
        <Link
          to="/contractor/invoices/generate"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" />
          Generate Invoice
        </Link>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by invoice ID, period, or status..."
            className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No invoices found</h3>
            <p className="mt-2 text-sm text-gray-600">Generate your first invoice for this period.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Jobs
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Issued
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filtered.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{invoice.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{invoice.period}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{invoice.jobs}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {formatMoney(invoice.amount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(invoice.issuedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          statusStyles[invoice.status] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractorInvoices;
