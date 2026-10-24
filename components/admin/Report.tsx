"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "@/components/hooks/useDebounce";
import ReportsHeader from "./reports/ReportsHeader";
import StatCards from "./reports/StatCards";
import StaffAudit from "./reports/StaffAudit";
import TransactionRecords from "./reports/TransactionRecords";
import ClubPaymentStatusChart from "./reports/ClubPaymentStatusChart";
import {
  getDashboardStats,
  getStaffOptions,
  getStaffPerformance,
  getTransactionRecords,
  exportTransactionRecords,
  type ReportStats,
  type ReportFilters,
  type StaffPerformanceRecord,
  type TransactionRecord,
} from "@/lib/reportsApi";

const emptyStats: ReportStats = {
  totalRevenue: 0,
  totalReceived: 0,
  totalPending: 0,
  totalMembers: 0,
  totalClubs: 0,
  activeStaff: 0,
  chart: [],
};

export default function Report() {
  const [stats, setStats] = useState(emptyStats);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");
  const [staff, setStaff] = useState<StaffPerformanceRecord[]>([]);
  const [staffOptions, setStaffOptions] = useState<Pick<StaffPerformanceRecord, "id" | "first_name" | "last_name">[]>([]);
  const [staffPagination, setStaffPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const [staffSearch, setStaffSearch] = useState("");
  const [staffStatus, setStaffStatus] = useState("all");
  const [staffPage, setStaffPage] = useState(1);
  const [staffLoading, setStaffLoading] = useState(true);
  const [staffError, setStaffError] = useState("");
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [transactionPagination, setTransactionPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const [transactionSearch, setTransactionSearch] = useState("");
  const [transactionPage, setTransactionPage] = useState(1);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [transactionsError, setTransactionsError] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [activeRange, setActiveRange] = useState("This Month");
  const [filters, setFilters] = useState<ReportFilters>(() => getRangeFilters("This Month"));
  const debouncedStaffSearch = useDebounce(staffSearch, 300);
  const debouncedTransactionSearch = useDebounce(transactionSearch, 300);

  useEffect(() => {
    let active = true;
    getDashboardStats({ startDate: filters.startDate, endDate: filters.endDate, clubId: filters.clubId })
      .then((response) => {
        if (active) {
          setStats(response.data);
          setStatsError("");
        }
      })
      .catch((error: unknown) => {
        if (active) setStatsError(getErrorMessage(error));
      })
      .finally(() => {
        if (active) setStatsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [filters.startDate, filters.endDate, filters.clubId, reloadKey]);

  useEffect(() => {
    let active = true;
    getStaffPerformance({
      startDate: filters.startDate,
      endDate: filters.endDate,
      clubId: filters.clubId,
      search: debouncedStaffSearch,
      status: staffStatus,
      page: staffPage,
      limit: 10,
    })
      .then((response) => {
        if (!active) return;
        setStaff(response.data);
        setStaffPagination(response.pagination);
        setStaffError("");
      })
      .catch((error: unknown) => {
        if (active) setStaffError(getErrorMessage(error));
      })
      .finally(() => {
        if (active) setStaffLoading(false);
      });
    return () => {
      active = false;
    };
  }, [filters.startDate, filters.endDate, filters.clubId, debouncedStaffSearch, staffStatus, staffPage, reloadKey]);

  useEffect(() => {
    let active = true;
    getTransactionRecords({
      ...filters,
      search: debouncedTransactionSearch,
      page: transactionPage,
      limit: 8,
    })
      .then((response) => {
        if (!active) return;
        setTransactions(response.data);
        setTransactionPagination(response.pagination);
        setTransactionsError("");
      })
      .catch((error: unknown) => {
        if (active) setTransactionsError(getErrorMessage(error));
      })
      .finally(() => {
        if (active) setTransactionsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [filters, debouncedTransactionSearch, transactionPage, reloadKey]);

  useEffect(() => {
    let active = true;
    getStaffOptions({ clubId: filters.clubId })
      .then((response) => {
        if (active) setStaffOptions(response.data);
      })
      .catch((error: unknown) => {
        if (active) setTransactionsError(getErrorMessage(error));
      });
    return () => {
      active = false;
    };
  }, [filters.clubId, reloadKey]);

  function handleRangeChange(range: string) {
    setActiveRange(range);
    if (range === "Custom Range") return;
    setStatsLoading(true);
    setStaffLoading(true);
    setTransactionsLoading(true);
    setFilters(getRangeFilters(range));
    setStaffPage(1);
    setTransactionPage(1);
  }

  function handleCustomRange(startDate: string, endDate: string) {
    if (!startDate || !endDate || startDate > endDate) return;
    setActiveRange("Custom Range");
    setStatsLoading(true);
    setStaffLoading(true);
    setTransactionsLoading(true);
    setFilters((current) => ({ ...current, startDate, endDate }));
    setStaffPage(1);
    setTransactionPage(1);
  }

  function handleFilterChange(name: "staffId" | "status" | "type", value: string) {
    setTransactionsLoading(true);
    setTransactionsError("");
    setFilters((current) => ({
      ...current,
      [name]: value === "all" ? undefined : value,
    }));
    setTransactionPage(1);
  }

  function handleRetry() {
    setStatsLoading(true);
    setStaffLoading(true);
    setTransactionsLoading(true);
    setStatsError("");
    setStaffError("");
    setTransactionsError("");
    setReloadKey((value) => value + 1);
  }

  function handleStaffSearchChange(value: string) {
    setStaffLoading(true);
    setStaffError("");
    setStaffSearch(value);
    setStaffPage(1);
  }

  function handleStaffStatusChange(value: string) {
    setStaffLoading(true);
    setStaffError("");
    setStaffStatus(value);
    setStaffPage(1);
  }

  function handleStaffPageChange(page: number) {
    setStaffLoading(true);
    setStaffPage(page);
  }

  function handleTransactionSearchChange(value: string) {
    setTransactionsLoading(true);
    setTransactionsError("");
    setTransactionSearch(value);
    setTransactionPage(1);
  }

  function handleTransactionPageChange(page: number) {
    setTransactionsLoading(true);
    setTransactionPage(page);
  }

  async function handleExport(format: "csv" | "xlsx" | "pdf") {
    setExporting(true);
    setExportError("");
    try {
      await exportTransactionRecords({ ...filters, search: transactionSearch }, format);
    } catch (error) {
      setExportError(getErrorMessage(error));
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="w-full min-w-0 space-y-5">
      <ReportsHeader
        activeRange={activeRange}
        startDate={filters.startDate || ""}
        endDate={filters.endDate || ""}
        exporting={exporting}
        exportError={exportError}
        onRangeChange={handleRangeChange}
        onCustomRange={handleCustomRange}
        onExport={handleExport}
      />
      <StatCards
        stats={stats}
        loading={statsLoading}
        error={statsError}
        onRetry={handleRetry}
      />
      <ClubPaymentStatusChart />
      <StaffAudit
        staff={staff}
        loading={staffLoading}
        error={staffError}
        pagination={staffPagination}
        search={staffSearch}
        status={staffStatus}
        onSearchChange={handleStaffSearchChange}
        onStatusChange={handleStaffStatusChange}
        onPageChange={handleStaffPageChange}
        onRetry={handleRetry}
      />
      <TransactionRecords
        transactions={transactions}
        loading={transactionsLoading}
        error={transactionsError}
        pagination={transactionPagination}
        search={transactionSearch}
        onSearchChange={handleTransactionSearchChange}
        staffOptions={staffOptions}
        filters={filters}
        onFilterChange={handleFilterChange}
        onPageChange={handleTransactionPageChange}
        onRetry={handleRetry}
      />
    </div>
  );
}

function getRangeFilters(range: string): ReportFilters {
  if (range === "Custom Range") return {};

  const end = new Date();
  const start = new Date(end);
  if (range === "Today") {
    start.setHours(0, 0, 0, 0);
  } else if (range === "Last 7 Days") {
    start.setDate(end.getDate() - 6);
  } else if (range === "Last Month") {
    start.setDate(1);
    start.setMonth(start.getMonth() - 1);
    end.setDate(0);
  } else if (range === "This Month") {
    start.setDate(1);
  } else if (range === "Last 30 Days") {
    start.setDate(end.getDate() - 29);
  }

  return { startDate: toDateInput(start), endDate: toDateInput(end) };
}

function toDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Failed to load report data.";
}
