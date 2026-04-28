"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // MARCAR QUE EL CLIENTE CARGÓ
    setLoaded(true);

    // REDIRECCIÓN MÚLTIPLE (una debería funcionar)
    const redirect = () => {
      console.log("Redirecting to /home");
      window.location.href = "/home";
    };

    // Redirigir después de 1 segundo
    const timer = setTimeout(redirect, 1000);

    // También escuchar eventos táctiles (para móviles)
    const handleTouch = () => {
      clearTimeout(timer);
      redirect();
    };

    document.addEventListener('touchstart', handleTouch, { once: true });

    return () => {
      clearTimeout(timer);
      document.removeEventListener('touchstart', handleTouch);
    };
  }, []);

  // Si no hay cliente, mostrar HTML puro
  if (!loaded) {
    return (
      <html>
        <head>
          <meta httpEquiv="refresh" content="1;url=/home" />
        </head>
        <body>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontFamily: 'system-ui'
          }}>
            Cargando...
          </div>
        </body>
      </html>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 50,
          height: 50,
          border: '4px solid rgba(255,255,255,0.3)',
          borderTopColor: 'white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }} />
        <h2>Redirigiendo...</h2>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}