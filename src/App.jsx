import React, { Fragment, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Blog from './pages/Blog';
import Schedule from './pages/Schedule';
import Contact from './pages/Contact';
import BlogPost from './pages/BlogPost';
import GalleryEventDetail from './pages/GalleryEventDetail';
import './App.css'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/schedule', label: 'Schedule' },
  { to: '/contact', label: 'Contact' },
];

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}><Home /></motion.div>} />
        <Route path="/gallery" element={<motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}><Gallery /></motion.div>} />
        <Route path="/gallery/:slug" element={<motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}><GalleryEventDetail /></motion.div>} />
        <Route path="/about" element={<motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}><About /></motion.div>} />
        <Route path="/blog" element={<motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}><Blog /></motion.div>} />
        <Route path="/blog/:slug" element={<motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}><BlogPost /></motion.div>} />
        <Route path="/schedule" element={<motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}><Schedule /></motion.div>} />
        <Route path="/contact" element={<motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}><Contact /></motion.div>} />
      </Routes>
    </AnimatePresence>
  );
}

function NavLinkAnimated({ to, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={to}
      className="relative px-1 hover:text-pink-600 transition-colors"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <motion.div
        layoutId="nav-underline"
        className="absolute left-0 -bottom-1 h-0.5 bg-pink-500 rounded"
        initial={false}
        animate={{ width: hovered ? '100%' : '0%' }}
        transition={{ duration: 0.25 }}
        style={{ width: hovered ? '100%' : '0%' }}
      />
    </Link>
  );
}

function DancerBackground() {
  const imgUrl = 'https://www.tandavalasya.com/static/b6c8c7fa13bb61de3cf6a6c3448d4535/bfa06/0072.webp';
  return (
    <img
      src={imgUrl}
      alt="Bharatanatyam dancer pose"
      className="hidden md:block fixed right-[-10vw] top-0 h-full w-auto z-10 opacity-25 pointer-events-none mix-blend-multiply grayscale contrast-125 blur-[1px] object-cover"
      style={{
        filter: 'grayscale(1) contrast(1.2) brightness(1.1) blur(1px)',
        WebkitMaskImage: 'radial-gradient(ellipse 60% 80% at 60% 50%, white 80%, transparent 100%)',
        maskImage: 'radial-gradient(ellipse 60% 80% at 60% 50%, white 80%, transparent 100%)',
      }}
    />
  );
}

function FloatingMudra() {
  // Top left
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    let timeout;
    function move() {
      setPos({ x: Math.random() * 120, y: Math.random() * 180 });
      timeout = setTimeout(move, 3500 + Math.random() * 1200);
    }
    move();
    return () => clearTimeout(timeout);
  }, []);
  return (
    <motion.div
      className="hidden md:block fixed z-10 opacity-20 blur-xs pointer-events-none select-none"
      style={{ left: '1vw', top: '6vh', width: '11rem', height: '11rem' }}
      animate={{ x: pos.x, y: pos.y, rotate: [0, 12, -10, 0] }}
      transition={{ x: { duration: 2.5 }, y: { duration: 2.5 }, rotate: { duration: 6, repeat: Infinity } }}
    >
      <span className="w-full h-full flex items-center justify-center text-7xl">🤲</span>
    </motion.div>
  );
}

function FloatingLotus() {
  // Bottom right
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    let timeout;
    function move() {
      setPos({ x: Math.random() * 160, y: Math.random() * 120 });
      timeout = setTimeout(move, 4000 + Math.random() * 1200);
    }
    move();
    return () => clearTimeout(timeout);
  }, []);
  return (
    <motion.div
      className="hidden md:block fixed z-10 opacity-20 blur-xs pointer-events-none select-none"
      style={{ right: '2vw', bottom: '7vh', width: '12rem', height: '12rem' }}
      animate={{ x: pos.x, y: pos.y, rotate: [0, -14, 10, 0] }}
      transition={{ x: { duration: 2.8 }, y: { duration: 2.8 }, rotate: { duration: 7, repeat: Infinity } }}
    >
      <span className="w-full h-full flex items-center justify-center text-8xl">🌸</span>
    </motion.div>
  );
}

function FloatingLamp() {
  // Top right
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    let timeout;
    function move() {
      setPos({ x: Math.random() * 120, y: Math.random() * 140 });
      timeout = setTimeout(move, 4200 + Math.random() * 1200);
    }
    move();
    return () => clearTimeout(timeout);
  }, []);
  return (
    <motion.div
      className="hidden md:block fixed z-10 opacity-20 blur-xs pointer-events-none select-none"
      style={{ right: '3vw', top: '8vh', width: '10rem', height: '10rem' }}
      animate={{ x: pos.x, y: pos.y, rotate: [0, 10, -12, 0] }}
      transition={{ x: { duration: 2.7 }, y: { duration: 2.7 }, rotate: { duration: 6.5, repeat: Infinity } }}
    >
      <span className="w-full h-full flex items-center justify-center text-7xl">🪔</span>
    </motion.div>
  );
}

// Modern Thoranam/Salangai Garland Motif
function ThoranamGarland() {
  const bellCount = 13;
  // Helper to get y on the rope path for a given x
  function getRopeY(x) {
    if (x <= 650) {
      const t = (x - 30) / (650 - 30);
      const y = (1 - t) * (1 - t) * 40 + 2 * (1 - t) * t * 140 + t * t * 40;
      return y;
    } else {
      const t = (x - 650) / (1270 - 650);
      const y = (1 - t) * (1 - t) * 40 + 2 * (1 - t) * t * -60 + t * t * 40;
      return y;
    }
  }
  // Draw beaded/dashed line along the path
  const beadCount = 40;
  const beads = Array.from({ length: beadCount }).map((_, i) => {
    const x = 30 + i * ((1270 - 30) / (beadCount - 1));
    const y = getRopeY(x);
    return <circle key={i} cx={x} cy={y} r="5.5" fill="#b91c1c" stroke="#fff" strokeWidth="1.5" />;
  });
  return (
    <motion.svg
      className="fixed left-0 right-0 top-28 w-full h-36 md:h-48 z-10 opacity-20 blur-xs pointer-events-none select-none"
      viewBox="0 0 1300 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{
        y: [0, 24, 0, -18, 0],
        rotate: [0, 2, -2, 0]
      }}
      transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
      style={{ maxWidth: '100vw' }}
    >
      {/* Beaded salangai-like path */}
      {beads}
      {/* Stylized bells */}
      {Array.from({ length: bellCount }).map((_, i) => {
        const x = 30 + i * ((1270 - 30) / (bellCount - 1));
        const y = getRopeY(x);
        return (
          <g key={i}>
            {/* Bell string */}
            <rect x={x - 1} y={y} width="2" height="22" rx="1" fill="#b45309" />
            {/* Bell */}
            <motion.circle
              cx={x}
              cy={y + 22}
              r="16"
              fill="#fbbf24"
              stroke="#b45309"
              strokeWidth="3"
              animate={{
                y: [0, 8 * Math.sin((i / (bellCount - 1)) * Math.PI), 0, -4 * Math.cos((i / (bellCount - 1)) * Math.PI), 0]
              }}
              transition={{ repeat: Infinity, duration: 7 + i, ease: 'easeInOut' }}
            />
            {/* Bell highlight */}
            <circle cx={x + 5} cy={y + 13 + 13} r="2.5" fill="#fff" />
          </g>
        );
      })}
    </motion.svg>
  );
}

function FloatingSalangai() {
  // Left bottom
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    let timeout;
    function move() {
      setPos({ x: Math.random() * 100, y: Math.random() * 100 });
      timeout = setTimeout(move, 4000 + Math.random() * 1200);
    }
    move();
    return () => clearTimeout(timeout);
  }, []);
  return (
    <motion.div
      className="hidden md:block fixed z-10 opacity-20 blur-xs pointer-events-none select-none"
      style={{ left: '2vw', bottom: '7vh', width: '10rem', height: '10rem' }}
      animate={{ x: pos.x, y: pos.y, rotate: [0, 10, -12, 0] }}
      transition={{ x: { duration: 2.7 }, y: { duration: 2.7 }, rotate: { duration: 6.5, repeat: Infinity } }}
    >
      <span className="w-full h-full flex items-center justify-center text-7xl">🔔</span>
    </motion.div>
  );
}

function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-pink-200 via-orange-100 to-blue-100 text-gray-700 py-4 px-4 border-t border-pink-200 z-50">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-bold text-lg tracking-wide">TandavaLasya &copy; {new Date().getFullYear()}</div>
        <div className="flex gap-4 text-pink-600 text-xl">
          <a href="#" className="hover:text-pink-800" aria-label="Instagram"><i className="fab fa-instagram"></i> Instagram</a>
          <a href="#" className="hover:text-blue-800" aria-label="Facebook"><i className="fab fa-facebook"></i> Facebook</a>
          <a href="#" className="hover:text-red-800" aria-label="YouTube"><i className="fab fa-youtube"></i> YouTube</a>
        </div>
      </div>
    </footer>
  );
}

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <Router>
      <div className="relative min-h-screen bg-gradient-to-br from-pink-100 via-orange-100 to-blue-100 text-gray-900 pb-24">
        <DancerBackground />
        <div className="relative z-20">
          {/* Navbar */}
          <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-md border-b border-pink-200 shadow-lg rounded-b-2xl z-50">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="TandavaLasya Logo" className="w-10 h-10 rounded-full object-contain bg-white shadow-lg" />
              <span className="font-extrabold text-lg tracking-wide">TandavaLasya</span>
            </div>
            {/* Desktop Nav */}
            <div className="hidden md:flex gap-6 font-medium text-base">
              {navLinks.map(link => (
                <NavLinkAnimated key={link.to} to={link.to}>
                  {link.label}
                </NavLinkAnimated>
              ))}
            </div>
            {/* Mobile Hamburger */}
            <button className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-400" onClick={() => setMobileOpen(true)}>
              <Bars3Icon className="h-7 w-7 text-pink-600" />
            </button>
            {/* Mobile Nav Dialog */}
            <Transition show={mobileOpen} as={Fragment}>
              <Dialog as="div" className="relative z-50" onClose={setMobileOpen}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
                  leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-black bg-opacity-30" />
                </Transition.Child>
                <div className="fixed inset-0 flex items-start justify-end">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300" enterFrom="translate-x-full" enterTo="translate-x-0"
                    leave="ease-in duration-200" leaveFrom="translate-x-0" leaveTo="translate-x-full"
                  >
                    <Dialog.Panel className="w-64 bg-white h-full shadow-xl p-6 flex flex-col gap-6">
                      <button className="self-end mb-4" onClick={() => setMobileOpen(false)}>
                        <XMarkIcon className="h-7 w-7 text-pink-600" />
                      </button>
                      {navLinks.map(link => (
                        <NavLinkAnimated key={link.to} to={link.to}>
                          {link.label}
                        </NavLinkAnimated>
                      ))}
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </Dialog>
            </Transition>
          </nav>
          <main className="pt-20">
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
        <FloatingMudra />
        <FloatingLotus />
        <FloatingLamp />
        <FloatingSalangai />
        <ThoranamGarland />
      </div>
    </Router>
  );
}

export default App;
