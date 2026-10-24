"use client";

import { useEffect, useState } from "react";
import Select from "@/components/ui/Select";
import {
  getClubPaymentStatus,
  type ClubPaymentStatusRecord,
} from "@/lib/reportsApi";

const chartSeries = [
  { key: "pending", label: "Pending", color: "#f59e0b" },
  { key: "partial", label: "Partial", color: "#3b82f6" },
  { key: "completed", label: "Completed", color: "#22c55e" },
] as const;

const chartHeight = 250;
const plotTop = 16;
const plotBottom = 164;
const plotLeft = 58;
const plotRight = 20;

export default function ClubPaymentStatusChart() {
  const [selectedClubId, setSelectedClubId] = useState("");
  const [clubs, setClubs] = useState<ClubPaymentStatusRecord[]>([]);
  const [chartData, setChartData] = useState<ClubPaymentStatusRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    getClubPaymentStatus(
      selectedClubId ? { clubId: selectedClubId } : { limit: 10 },
    )
      .then((response) => {
        if (!active) return;
        setChartData(response.data);
        if (!selectedClubId) setClubs(response.data);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Failed to load payment status data.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedClubId, reloadKey]);

  const chartWidth = Math.max(680, chartData.length * 82 + plotLeft + plotRight);
  const plotWidth = chartWidth - plotLeft - plotRight;
  const maximumValue = Math.max(
    1,
    ...chartData.map((club) => club.pending + club.partial + club.completed),
  );
  const scaleMaximum = Math.ceil(maximumValue / 4) * 4;
  const tickStep = scaleMaximum / 4;
  const plotHeight = plotBottom - plotTop;

  return (
    <section className="rounded-md border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Club-wise Payment Status</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Transaction records by payment status.
          </p>
        </div>
        <label className="grid w-full gap-1 text-xs font-medium text-muted-foreground sm:w-56">
          Club
          <Select
            value={selectedClubId}
            onChange={(event) => {
              setLoading(true);
              setError("");
              setSelectedClubId(event.target.value);
            }}
            className="h-10 rounded-lg px-3 text-sm"
          >
            <option value="">All Clubs</option>
            {clubs.map((club) => (
              <option key={club.clubId} value={club.clubId}>
                {club.clubName}
              </option>
            ))}
          </Select>
        </label>
      </div>

      {loading ? (
        <div
          aria-label="Loading club payment status"
          aria-busy="true"
          className="mt-5 h-56 animate-pulse rounded-lg bg-muted"
        />
      ) : error ? (
        <div role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>Unable to load club payment status. {error}</span>
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setError("");
                setReloadKey((key) => key + 1);
              }}
              className="font-semibold underline"
            >
              Retry
            </button>
          </div>
        </div>
      ) : chartData.length === 0 ? (
        <p className="mt-5 rounded-lg border border-dashed border-border px-4 py-12 text-center text-sm text-muted-foreground">
          No club payment status data is available.
        </p>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2" aria-label="Chart legend">
            {chartSeries.map((series) => (
              <span key={series.key} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: series.color }} />
                {series.label}
              </span>
            ))}
          </div>
          <div className="mt-2 overflow-x-auto">
            <svg
              role="img"
              aria-label="Stacked bar chart of pending, partial, and completed payment records by club"
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              style={{ width: chartWidth, maxWidth: "100%", minWidth: 640, height: "auto" }}
            >
              {Array.from({ length: 5 }, (_, index) => {
                const value = tickStep * index;
                const y = plotBottom - (value / scaleMaximum) * plotHeight;
                return (
                  <g key={value}>
                    <line
                      x1={plotLeft}
                      x2={chartWidth - plotRight}
                      y1={y}
                      y2={y}
                      stroke="var(--border)"
                      strokeDasharray={index === 0 ? undefined : "3 5"}
                    />
                    <text
                      x={plotLeft - 10}
                      y={y + 4}
                      textAnchor="end"
                      fill="var(--muted-foreground)"
                      fontSize="11"
                    >
                      {value}
                    </text>
                  </g>
                );
              })}
              <text
                x="15"
                y={(plotTop + plotBottom) / 2}
                transform={`rotate(-90 15 ${(plotTop + plotBottom) / 2})`}
                textAnchor="middle"
                fill="var(--muted-foreground)"
                fontSize="11"
              >
                Number of records
              </text>
              {chartData.map((club, index) => {
                const slotWidth = plotWidth / chartData.length;
                const barWidth = Math.min(38, slotWidth * 0.56);
                const barX = plotLeft + slotWidth * index + (slotWidth - barWidth) / 2;
                let currentY = plotBottom;
                const values = [club.pending, club.partial, club.completed];
                const segments = chartSeries.map((series, seriesIndex) => {
                  const value = values[seriesIndex];
                  const height = (value / scaleMaximum) * plotHeight;
                  currentY -= height;
                  return { ...series, value, y: currentY, height };
                });
                const label = club.clubName.length > 15
                  ? `${club.clubName.slice(0, 14)}…`
                  : club.clubName;

                return (
                  <g key={club.clubId}>
                    <title>
                      {`${club.clubName}: Pending ${club.pending}, Partial ${club.partial}, Completed ${club.completed}`}
                    </title>
                    {segments.map((segment) => (
                      <rect
                        key={segment.key}
                        x={barX}
                        y={segment.y}
                        width={barWidth}
                        height={segment.height}
                        fill={segment.color}
                      >
                        <title>{`${segment.label}: ${segment.value}`}</title>
                      </rect>
                    ))}
                    <text
                      x={barX + barWidth / 2}
                      y={plotBottom + 18}
                      textAnchor="middle"
                      fill="var(--muted-foreground)"
                      fontSize="10"
                    >
                      <title>{club.clubName}</title>
                      {label}
                    </text>
                  </g>
                );
              })}
              <text
                x={plotLeft + plotWidth / 2}
                y={chartHeight - 12}
                textAnchor="middle"
                fill="var(--muted-foreground)"
                fontSize="11"
              >
                Club name
              </text>
            </svg>
          </div>
        </>
      )}
    </section>
  );
}
