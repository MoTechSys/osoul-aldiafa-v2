// Brand mark for أصول الضيافة — uses the new client-supplied logo.webp.
// Renamed semantics retained for backwards compatibility with imports.
export function DallahLogo({ size = 40 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
      aria-label="أصول الضيافة - شعار"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.webp"
        alt="أصول الضيافة"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
  );
}
