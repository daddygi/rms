"use client";

import { useState } from "react";
import { Eye, Pencil, Download, ChevronUp, ChevronDown } from "lucide-react";
import Link from "next/link";
import PaginationControls from "./PaginationControls";

export type Column<T> = {
  label: string;
  accessor: keyof T;
};

type PaginatedTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  rowsPerPage?: number;
};

export default function PaginatedTable<
  T extends { id: string; created_at: string }
>({ data, columns, rowsPerPage = 5 }: PaginatedTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (column: keyof T) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const filteredData = data
    .filter((row) => {
      const searchText = search.toLowerCase();
      const matchesSearch = Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchText)
      );
      const matchesDate = dateFilter
        ? new Date(row.created_at).toDateString() ===
          new Date(dateFilter).toDateString()
        : true;
      return matchesSearch && matchesDate;
    })
    .sort((a, b) => {
      if (!sortColumn) return 0;
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="w-full overflow-x-auto px-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => {
              setCurrentPage(1);
              setDateFilter(e.target.value);
            }}
            className="border border-gray-300 px-3 py-2 rounded w-full sm:w-1/3"
          />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setCurrentPage(1);
              setSearch(e.target.value);
            }}
            className="border border-gray-300 px-3 py-2 rounded w-full sm:w-2/3"
          />
        </div>

        {/* Table for desktop */}
        <table className="w-full hidden sm:table border border-gray-200 bg-white">
          <thead className="bg-gray-100 text-sm text-gray-600">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.accessor)}
                  className="py-3 px-4 text-left cursor-pointer select-none"
                  onClick={() => handleSort(col.accessor)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortColumn === col.accessor &&
                      (sortOrder === "asc" ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      ))}
                  </div>
                </th>
              ))}
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50 text-sm text-gray-800 border-t"
              >
                {columns.map((col) => (
                  <td key={String(col.accessor)} className="py-3 px-4">
                    {String(row[col.accessor])}
                  </td>
                ))}
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-3">
                    <Link
                      href={`/dashboard/reports/${row.id}`}
                      className="text-blue-600 hover:text-blue-800"
                      title="View"
                    >
                      <Eye size={18} />
                    </Link>
                    <Link
                      href={`/dashboard/reports/${row.id}/edit`}
                      className="text-yellow-600 hover:text-yellow-800"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </Link>
                    <Link
                      href={`/dashboard/reports/${row.id}/download`}
                      className="text-green-600 hover:text-green-800"
                      title="Download"
                    >
                      <Download size={18} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile card layout */}
        <div className="sm:hidden space-y-4 mt-4 -mx-2 px-0">
          {currentData.map((row, index) => (
            <div
              key={index}
              className="rounded-xl border shadow-sm bg-white overflow-hidden mx-2"
            >
              <div className="px-5 py-3 border-b bg-gray-50 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">
                  Report ID:
                </span>
                <span className="text-sm text-blue-600 font-mono text-right break-all">
                  {row.id}
                </span>
              </div>
              {columns
                .filter((col) => col.accessor !== "id")
                .map((col, i) => (
                  <div
                    key={i}
                    className="px-5 py-3 border-b last:border-b-0 flex justify-between items-start"
                  >
                    <span className="text-sm font-medium text-gray-600">
                      {col.label}
                    </span>
                    <span className="text-sm text-gray-900 text-right max-w-[60%] break-words">
                      {String(row[col.accessor])}
                    </span>
                  </div>
                ))}
              <div className="flex justify-end gap-4 px-5 py-3 border-t bg-gray-50">
                <Link
                  href={`/dashboard/reports/${row.id}`}
                  className="text-blue-600 hover:text-blue-800"
                  title="View"
                >
                  <Eye size={18} />
                </Link>
                <Link
                  href={`/dashboard/reports/${row.id}/edit`}
                  className="text-yellow-600 hover:text-yellow-800"
                  title="Edit"
                >
                  <Pencil size={18} />
                </Link>
                <Link
                  href={`/dashboard/reports/${row.id}/download`}
                  className="text-green-600 hover:text-green-800"
                  title="Download"
                >
                  <Download size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
