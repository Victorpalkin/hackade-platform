'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, Clock } from 'lucide-react';
import { ProvisioningItem } from '@/lib/types';

interface ProgressChecklistProps {
  items: ProvisioningItem[];
}

const statusIcon = {
  pending: <Clock size={16} className="text-gray-500" />,
  'in-progress': <Loader2 size={16} className="text-cyan-400 animate-spin" />,
  complete: <Check size={16} className="text-emerald-400" />,
};

const statusStyle = {
  pending: 'text-gray-500',
  'in-progress': 'text-cyan-300',
  complete: 'text-emerald-300',
};

export function ProgressChecklist({ items }: ProgressChecklistProps) {
  return (
    <div className="space-y-3">
      <AnimatePresence>
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
            className={`flex items-center gap-3 p-3 rounded-lg glass transition-colors ${
              item.status === 'complete' ? 'border-emerald-500/20' : ''
            }`}
          >
            {statusIcon[item.status]}
            <span className={`text-sm font-medium ${statusStyle[item.status]}`}>
              {item.label}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
