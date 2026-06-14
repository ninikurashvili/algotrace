import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface InfoSection {
  title: string
  body: string
}

interface Props {
  open: boolean
  onClose: () => void
  algoName: string
  color: string
  sections: InfoSection[]
}

export default function InfoModal({ open, onClose, algoName, color, sections }: Props) {
  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header — fixed, doesn't scroll */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                <span className="text-lg font-bold" style={{ color }}>
                  {algoName}
                </span>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-white text-xl leading-none transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Sections — scrollable */}
              <div className="flex flex-col gap-5 px-6 py-5 overflow-y-auto modal-scroll max-h-[70vh]">
                {sections.map((s) => (
                  <div key={s.title} className="flex flex-col gap-1.5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {s.title}
                    </p>
                    <p className="text-gray-200 text-sm leading-relaxed">{s.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
