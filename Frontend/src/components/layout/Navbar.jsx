import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FiMenu, FiX, FiActivity } from 'react-icons/fi'
import clsx from 'clsx'
import { NAV_LINKS, APP_NAME } from '../../constants'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass-surface border-b border-border">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-soft">
              <FiActivity className="h-4 w-4" />
            </span>
            <span className="font-display text-[15px] font-bold tracking-tight text-text">{APP_NAME}</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  clsx(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200',
                    isActive ? 'text-primary bg-primary-50' : 'text-muted hover:text-text hover:bg-slate-100'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/search" className="btn-primary hidden sm:inline-flex">
              New Research
            </Link>
            <button
              className="rounded-lg p-2 text-muted hover:bg-slate-100 lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle navigation"
            >
              {open ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-border bg-white lg:hidden"
          >
            <div className="container-page flex flex-col gap-1 py-3">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    clsx(
                      'rounded-lg px-3 py-2.5 text-sm font-medium',
                      isActive ? 'text-primary bg-primary-50' : 'text-muted hover:bg-slate-100 hover:text-text'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Link to="/search" onClick={() => setOpen(false)} className="btn-primary mt-2 justify-center">
                New Research
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
