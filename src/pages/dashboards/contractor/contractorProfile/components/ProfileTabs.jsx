import { User, Truck, CreditCard } from 'lucide-react';

const tabs = [
  { id: 'personal', label: 'Personal Details', icon: User },
  { id: 'vehicle', label: 'Vehicle Details', icon: Truck },
  { id: 'bank', label: 'Bank & Pay', icon: CreditCard },
];

const ProfileTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex flex-wrap gap-2 border-b border-gray-200">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              active
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default ProfileTabs;
