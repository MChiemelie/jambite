import { LucideIcon } from 'lucide-react';

export type StatProps = {
  icon: LucideIcon;
  color: string;
  value: string;
  title: string;
  subtitle: string;
};

export default function Stat({ icon: Icon, color, value, title, subtitle }: StatProps) {
  return (
    <div className="flex w-full items-center gap-4">
      <Icon className={`w-8 h-8 ${color}`} />
      <div className="grow">
        <p className="font-bold text-2xl text-gray-800">{value}</p>
        <p className="font-medium text-gray-600">{title}</p>
        <p className="text-gray-400 text-xs">{subtitle}</p>
      </div>
    </div>
  );
}
