"use client";

import { useEffect, useState } from "react";
import { getClubStatistics } from "@/lib/club";
import { getMembers } from "@/lib/membersApi";
import { getTransactions } from "@/lib/transactionsApi";
import {
  Building2,
  CircleCheck,
  ContactRound,
  ReceiptText,
  UsersRound,
} from "lucide-react";
import { StatCard } from "./StatCard";

interface Statistics {
  totalClubs: number;
  activeClubs: number;
  inactiveClubs: number;
  totalStaff: number;
  totalMembers: number;
  totalTransactions: number;
}

export function DashboardOverview() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);

        const [clubData, memberData, transactionData] = await Promise.all([
          getClubStatistics(),
          getMembers({ limit: 1 }),
          getTransactions({ limit: 1 }),
        ]);

        setStats({
          ...clubData,
          totalMembers: memberData.count,
          totalTransactions: transactionData.count,
        });
      } catch (error) {
        console.error(error);

        setError("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return <p>Loading statistics...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        <StatCard
          label="Total Clubs"
          value={stats.totalClubs}
          icon={Building2}
          iconClassName="text-blue-700"
          iconBackgroundClassName="bg-blue-50"
        />
        <StatCard
          label="Active Clubs"
          value={stats.activeClubs}
          icon={CircleCheck}
          iconClassName="text-emerald-700"
          iconBackgroundClassName="bg-emerald-50"
        />
        <StatCard
          label="Staff Members"
          value={stats.totalStaff}
          icon={ContactRound}
          iconClassName="text-violet-700"
          iconBackgroundClassName="bg-violet-50"
        />
        <StatCard
          label="Total Members"
          value={stats.totalMembers}
          icon={UsersRound}
          iconClassName="text-cyan-700"
          iconBackgroundClassName="bg-cyan-50"
        />
        <StatCard
          label="Total Transactions"
          value={stats.totalTransactions}
          icon={ReceiptText}
          iconClassName="text-amber-700"
          iconBackgroundClassName="bg-amber-50"
        />
      </div>

      <div className="rounded-md border border-border bg-white p-5">
        <h2 className="text-sm font-semibold text-foreground">Club health</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="flex items-center justify-between rounded-md border border-emerald-100 bg-emerald-50/50 p-4">
            <p className="text-sm font-medium text-emerald-800">Active</p>
            <p className="text-2xl font-semibold tabular-nums text-emerald-900">
              {stats.activeClubs.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">Inactive</p>
            <p className="text-2xl font-semibold tabular-nums text-slate-900">
              {stats.inactiveClubs.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
