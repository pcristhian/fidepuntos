// components/Header.jsx
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const menuItems = [
        { name: "Inicio", href: "/" },
        { name: "Servicios", href: "/servicios" },
        { name: "Productos", href: "/productos" },
        { name: "Nosotros", href: "/nosotros" },
        { name: "Iniciar Sesión", href: "/Login" },
    ];

    return (
        <>
            {/* Header fijo */}
            <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg z-50">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="text-white text-2xl font-bold">
                        MiLogo
                    </Link>

                    {/* Botón hamburguesa */}
                    <button
                        onClick={toggleMenu}
                        className="relative w-10 h-10 flex flex-col justify-center items-center gap-1.5 group focus:outline-none"
                        aria-label="Menú"
                    >
                        <motion.span
                            animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-6 h-0.5 bg-white block rounded-full"
                        />
                        <motion.span
                            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="w-6 h-0.5 bg-white block rounded-full"
                        />
                        <motion.span
                            animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-6 h-0.5 bg-white block rounded-full"
                        />
                    </button>
                </div>
            </header>

            {/* Menú lateral (overlay) */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Fondo oscuro */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={closeMenu}
                            className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        />

                        {/* Menú lateral desde la derecha */}
                        <motion.nav
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 p-6 pt-20"
                        >
                            <ul className="space-y-4">
                                {menuItems.map((item, index) => (
                                    <motion.li
                                        key={item.name}
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={closeMenu}
                                            className="block text-gray-800 hover:text-blue-600 text-lg font-medium transition-colors duration-200 py-2 border-b border-gray-100"
                                        >
                                            {item.name}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}