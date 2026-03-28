export default function RootLoading() {
  return (
    <div className="section-wrap flex min-h-[44vh] items-center justify-center">
      <div className="glass surface-card w-full max-w-sm rounded-2xl p-4 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--gold-lux)]">Loading</p>
        <p className="mt-1 font-display text-2xl text-sand">Preparing your page...</p>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="loading-shimmer h-full w-2/3 rounded-full bg-[color:var(--gold-lux)]" />
        </div>
      </div>
    </div>
  );
}
