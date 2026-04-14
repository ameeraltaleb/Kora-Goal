export default function RootLoading() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '50vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div className="spinner">
        <style>{`
          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-left-color: var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>جاري استدعاء البيانات...</p>
    </div>
  );
}
