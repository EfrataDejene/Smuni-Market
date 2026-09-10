import { Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';

const benefits = [
  {
    icon: Truck,
    title: '24h Doorstep Delivery',
    description: 'Fast express shipping in Addis Ababa & tracking.',
    color: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  {
    icon: ShieldCheck,
    title: 'Chapa Escrow Protection',
    description: '100% money-back guarantee & encrypted checkout.',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
  },
  {
    icon: RotateCcw,
    title: '7-Day Easy Returns',
    description: 'Hassle-free replacement for defective items.',
    color: 'text-amber-600 bg-amber-50 border-amber-200'
  },
  {
    icon: Headphones,
    title: '24/7 Local Support',
    description: 'Direct phone & Telegram customer service.',
    color: 'text-purple-600 bg-purple-50 border-purple-200'
  },
];

export default function BenefitsBar() {
  return (
    <section className="max-w-[1320px] mx-auto px-2 sm:px-4 py-2 sm:py-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {benefits.map((benefit, idx) => {
          const Icon = benefit.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-slate-200/80 rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 shadow-2xs hover:shadow-xs transition-all flex items-center gap-2.5 group"
            >
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${benefit.color}`}>
                <Icon size={18} strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <h4 className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight truncate">
                  {benefit.title}
                </h4>
                <p className="text-[10px] text-slate-500 font-medium leading-tight line-clamp-1 mt-0.5">
                  {benefit.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
