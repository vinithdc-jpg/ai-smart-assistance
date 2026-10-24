export function GstSettings({
  gstRateInput,
  gstLoading,
  gstSuccess,
  gstError,
  setGstRateInput,
  handleSaveGstRate,
}: {
  gstRate: number;
  gstRateInput: string;
  gstLoading: boolean;
  gstSuccess: string;
  gstError: string;
  setGstRateInput: (value: string) => void;
  handleSaveGstRate: (e: React.FormEvent) => void;
}) {
  const fieldClass =
    "h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-ring/40 disabled:opacity-50";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">GST & Tax Configuration</h2>
        <p className="text-sm text-muted">
          Configure the standard Goods and Services Tax (GST) percentage applied to transaction receipts across all clubs.
        </p>
      </div>

      {gstSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {gstSuccess}
        </div>
      )}

      {gstError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {gstError}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <form
          onSubmit={handleSaveGstRate}
          className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-5 lg:col-span-2"
        >
          <div className="space-y-2">
            <p className="text-xs text-muted leading-relaxed">
              This rate will be used by staff members when creating transactions. Calculated values (Amount Excl. GST, CGST, SGST, Total GST) are automatically computed using this percentage.
            </p>
            <div className="form-floating-field relative mt-2 max-w-xs">
              <label
                htmlFor="gstRateInput"
                className="form-floating-label"
              >
                System GST Percentage (%)
              </label>
              <input
                id="gstRateInput"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={gstRateInput}
                onChange={(e) => setGstRateInput(e.target.value)}
                className={fieldClass + " form-floating-input form-floating-input-with-suffix pr-10 font-semibold text-base"}
                placeholder=" "
                required
              />
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 font-semibold text-muted">
                %
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="block text-xs font-medium text-muted uppercase tracking-wider">
              Standard GST Presets
            </span>
            <div className="flex flex-wrap gap-2">
              {[0, 5, 12, 18, 28].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setGstRateInput(String(preset))}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-semibold cursor-pointer transition ${
                    Number(gstRateInput) === preset
                      ? "border-primary bg-primary text-white shadow-xs"
                      : "border-border bg-[#f7f8ff] text-foreground hover:border-primary/40 hover:bg-primary-soft"
                  }`}
                >
                  {preset}% GST
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4 flex">
            <button
              type="submit"
              disabled={gstLoading}
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover disabled:opacity-50 cursor-pointer"
            >
              {gstLoading ? "Saving..." : "Save GST Configuration"}
            </button>
          </div>
        </form>

        <div className="rounded-2xl border border-border bg-[#f7f8ff] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
              %
            </span>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Formula Preview</h3>
              <p className="text-[11px] text-muted">Based on ₹10,000 received</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-muted">
            {(() => {
              const rate = Number(gstRateInput) || 0;
              const samplePayment = 10000;
              const sampleExcl = samplePayment;
              const sampleCgst = rate > 0 ? Math.round(((sampleExcl * (rate / 2)) / 100) * 100) / 100 : 0;
              const sampleSgst = rate > 0 ? Math.round(((sampleExcl * (rate / 2)) / 100) * 100) / 100 : 0;
              const sampleGst = Math.round((sampleCgst + sampleSgst) * 100) / 100;
              const sampleTotalWithGst = Math.round((sampleExcl + sampleGst) * 100) / 100;

              return (
                <>
                  <div className="flex justify-between py-1 border-b border-border/60">
                    <span>Amount Excl. GST (Payment):</span>
                    <strong className="font-mono text-foreground">₹{sampleExcl.toFixed(2)}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/60">
                    <span>CGST ({(rate / 2).toFixed(1)}%):</span>
                    <strong className="font-mono text-emerald-600">₹{sampleCgst.toFixed(2)}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/60">
                    <span>SGST ({(rate / 2).toFixed(1)}%):</span>
                    <strong className="font-mono text-emerald-600">₹{sampleSgst.toFixed(2)}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/60">
                    <span>Total GST ({rate}%):</span>
                    <strong className="font-mono text-amber-600">₹{sampleGst.toFixed(2)}</strong>
                  </div>
                  <div className="flex justify-between py-1 pt-2 font-semibold text-foreground">
                    <span>Total Amount With GST:</span>
                    <strong className="font-mono text-sm text-primary">₹{sampleTotalWithGst.toFixed(2)}</strong>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
