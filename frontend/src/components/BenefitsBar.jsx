import { Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';

const benefits = [
  {
    icon: Truck,
    title: 'Free Delivery',
    description: 'On orders over ETB 1,000',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payment',
    description: '100% secure payment',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: '7 days return policy',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Dedicated support',
  },
];

export default function BenefitsBar() {
  return (
    <section className="max-w-[1280px] mx-auto px-4 py-4 pb-6">
      <div className="bg-gray-100 rounded-xl flex items-stretch divide-x divide-gray-200">
        {benefits.map((benefit, idx) => {
          const Icon = benefit.icon;
          return (
            <div
              key={idx}
              className="flex-1 flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors rounded-xl"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Icon size={20} color="#0066D6" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-gray-800">{benefit.title}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{benefit.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
