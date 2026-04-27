"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

export default function LoadingPage() {
  const router = useRouter();
  const [points, setPoints] = useState(0);
  const [slotResult, setSlotResult] = useState([0, 0, 0]);
  const startTimeRef = useRef(null);
  const animationRef = useRef(null);
  const redirectedRef = useRef(false);

  const symbols = [
    { name: "regalo", icon: "/1.png", alt: "🎁" },
    { name: "estrella", icon: "/2.png", alt: "⭐" },
    { name: "trofeo", icon: "/3.png", alt: "🏆" } 
  ];

  useEffect(() => {
    // Usar requestAnimationFrame en lugar de setInterval para mejor rendimiento en móvil
    startTimeRef.current = Date.now();
    
    const updateAnimation = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const newPoints = Math.min(100, Math.floor(elapsed / 36)); // 3.6 segundos para llegar a 100
      
      setPoints(newPoints);
      
      // Actualizar slot machine más rápido
      setSlotResult([
        Math.floor(Math.random() * symbols.length),
        Math.floor(Math.random() * symbols.length),
        Math.floor(Math.random() * symbols.length)
      ]);
      
      if (newPoints < 100) {
        animationRef.current = requestAnimationFrame(updateAnimation);
      } else if (!redirectedRef.current) {
        // Redirigir cuando llegue a 100 puntos
        redirectedRef.current = true;
        setTimeout(() => {
          window.location.href = "/home";
        }, 500);
      }
    };
    
    animationRef.current = requestAnimationFrame(updateAnimation);
    
    // Fallback: redirigir después de 4 segundos por si acaso
    const fallbackTimeout = setTimeout(() => {
      if (!redirectedRef.current) {
        redirectedRef.current = true;
        window.location.href = "/home";
      }
    }, 4500);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearTimeout(fallbackTimeout);
    };
  }, [router]);

  // Confeti solo para cliente y cuando points >= 90
  const Confetti = () => {
    if (typeof window === 'undefined') return null;
    if (points < 90) return null;
    
    return (
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-4 bg-gradient-to-b from-yellow-400 to-orange-500"
            initial={{
              x: Math.random() * window.innerWidth,
              y: -20,
              rotate: 0
            }}
            animate={{
              y: window.innerHeight + 50,
              rotate: 360
            }}
            transition={{ 
              duration: 1.5, 
              delay: Math.random() * 0.3,
              ease: "linear"
            }}
            style={{ left: `${Math.random() * 100}%` }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col items-center justify-center">

      <Confetti />

      <div className="relative z-10 text-center px-4 w-full max-w-md mx-auto">

        {/* Título */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-black mb-8 text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text"
        >
          🗼 TORRE PUNTOS
        </motion.h1>

        {/* Slot Machine */}
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl p-4 md:p-8 mb-8 border border-purple-500/30">
          <div className="text-white/60 text-sm mb-4">¡Gira y gana puntos extra!</div>

          <div className="flex gap-2 md:gap-4 justify-center mb-6">
            {slotResult.map((symbol, idx) => (
              <motion.div
                key={`${symbol}-${idx}-${points}`} // Forzar reinicio de animación
                animate={{
                  y: [0, -15, 0],
                  rotateX: [0, 360, 0]
                }}
                transition={{ 
                  duration: 0.2, 
                  type: "tween",
                  ease: "easeInOut"
                }}
                className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl"
              >
                <Image
                  src={symbols[symbol].icon}
                  alt={symbols[symbol].alt}
                  width={45}
                  height={45}
                  className="object-contain"
                  priority
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            key={points} // Reiniciar animación cuando cambian los puntos
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.3, repeat: points < 100 ? Infinity : 0 }}
            className="text-2xl md:text-3xl font-bold text-yellow-400"
          >
            {Math.floor(points * 15)} PUNTOS
          </motion.div>
        </div>

        {/* Barra de progreso */}
        <div className="w-full mx-auto mb-4 relative">
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"
              animate={{ width: `${points}%` }}
              transition={{ duration: 0.05 }}
            />
          </div>

          {/* Burbuja de puntos */}
          {points > 0 && points < 100 && (
            <motion.div
              className="absolute -top-6"
              animate={{ left: `${points}%` }}
              transition={{ duration: 0.05 }}
            >
              <div className="bg-yellow-400 text-purple-900 font-bold px-2 py-1 rounded-full text-xs whitespace-nowrap">
                +{Math.floor(points * 0.5)}
              </div>
            </motion.div>
          )}
        </div>

        {/* Mensaje de estado */}
        <p className="text-gray-300 text-sm">
          {points === 100 ? "🎉 ¡Redirigiendo...! 🎉" : "Acumulando puntos..."}
        </p>
      </div>
    </div>
  );
}