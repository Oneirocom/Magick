export default function InfoCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 space-y-1 rounded-xl border shadow-sm">{children}</div>
  );
}
