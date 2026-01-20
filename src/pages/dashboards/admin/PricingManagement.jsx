import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  DollarSign,
  Users,
  TrendingUp,
  Package,
} from 'lucide-react';

const PricingManagement = () => {
  // Sample pricing data
  const [pricingTiers, setPricingTiers] = useState([
    {
      id: 1,
      tier: 'Tier A',
      basePrice: 41.67,
      vat: 8.33,
      totalPrice: 50.0,
      weightUnit: '800kg',
      maxDistance: 45,
      surchargeRate: 0.5,
      description: 'Premium tier for high-volume customers',
      isDefault: false,
      customers: ['Topps Newcastle'],
    },
    {
      id: 2,
      tier: 'Tier B',
      basePrice: 37.5,
      vat: 7.5,
      totalPrice: 45.0,
      weightUnit: '800kg',
      maxDistance: 45,
      surchargeRate: 0.5,
      description: 'Standard tier for regular customers',
      isDefault: true,
      customers: [
        'Topps Chester',
        'Topps Nantwich',
        'Topps Northwich',
        'Topps Rhyl',
        'Topps Wrexham',
      ],
    },
  ]);

  const [customPricing, setCustomPricing] = useState([
    {
      id: 1,
      customerId: 'T022',
      customerName: 'Topps Chester',
      pricingType: 'Standard',
      tierName: 'Tier B',
      basePrice: 37.5,
      customRate: null,
      flatRate: null,
      notes: 'Using standard Tier B pricing',
      effectiveDate: '2024-01-01',
      lastUpdated: '2024-01-15',
    },
    {
      id: 2,
      customerId: 'T167',
      customerName: 'Topps Newcastle',
      pricingType: 'Standard',
      tierName: 'Tier A',
      basePrice: 41.67,
      customRate: null,
      flatRate: null,
      notes: 'Premium tier due to high volume',
      effectiveDate: '2024-01-01',
      lastUpdated: '2024-01-15',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showTierModal, setShowTierModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteType, setDeleteType] = useState('tier'); // 'tier' or 'custom'
  const [editingTier, setEditingTier] = useState(null);
  const [editingCustom, setEditingCustom] = useState(null);
  const [viewMode, setViewMode] = useState('tiers'); // 'tiers' or 'custom'

  // Calculate stats
  const stats = {
    totalTiers: pricingTiers.length,
    customPricing: customPricing.filter((p) => p.pricingType === 'Custom').length,
    avgPrice: (
      pricingTiers.reduce((sum, tier) => sum + tier.totalPrice, 0) / pricingTiers.length
    ).toFixed(2),
    totalCustomers: customPricing.length,
  };

  // Filter pricing tiers
  const filteredTiers = pricingTiers.filter((tier) => {
    const matchesSearch =
      tier.tier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tier.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Filter custom pricing
  const filteredCustom = customPricing.filter((custom) => {
    const matchesSearch =
      custom.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      custom.customerId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === 'all' || custom.pricingType.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // Handle Tier Edit
  const handleEditTier = (tier) => {
    setEditingTier({ ...tier });
    setShowTierModal(true);
  };

  // Handle Tier Save
  const handleSaveTier = () => {
    if (editingTier.id) {
      setPricingTiers(pricingTiers.map((t) => (t.id === editingTier.id ? editingTier : t)));
    } else {
      setPricingTiers([...pricingTiers, { ...editingTier, id: Date.now() }]);
    }
    setShowTierModal(false);
    setEditingTier(null);
  };

  // Handle Custom Pricing Edit
  const handleEditCustom = (custom) => {
    setEditingCustom({ ...custom });
    setShowCustomModal(true);
  };

  // Handle Custom Pricing Save
  const handleSaveCustom = () => {
    if (editingCustom.id) {
      setCustomPricing(customPricing.map((c) => (c.id === editingCustom.id ? editingCustom : c)));
    } else {
      setCustomPricing([...customPricing, { ...editingCustom, id: Date.now() }]);
    }
    setShowCustomModal(false);
    setEditingCustom(null);
  };

  // Handle Delete Tier
  const handleDeleteTier = (tier) => {
    setSelectedItem(tier);
    setDeleteType('tier');
    setShowDeleteModal(true);
  };

  // Handle Delete Custom
  const handleDeleteCustom = (custom) => {
    setSelectedItem(custom);
    setDeleteType('custom');
    setShowDeleteModal(true);
  };

  // Confirm Delete
  const confirmDelete = () => {
    if (deleteType === 'tier') {
      setPricingTiers(pricingTiers.filter((t) => t.id !== selectedItem.id));
    } else {
      setCustomPricing(customPricing.filter((c) => c.id !== selectedItem.id));
    }
    setShowDeleteModal(false);
    setSelectedItem(null);
  };

  return (
    <div className="p-2 sm:p-6 md:p-8 lg:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            Pricing Management
          </h1>
          <p className="mt-2 text-gray-600">Manage pricing tiers and custom customer rates</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pricing Tiers</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.totalTiers}</p>
            </div>
            <div className="rounded-lg bg-teal-50 p-3">
              <Package className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Custom Pricing</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.customPricing}</p>
            </div>
            <div className="rounded-lg bg-teal-50 p-3">
              <DollarSign className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Price</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">£{stats.avgPrice}</p>
            </div>
            <div className="rounded-lg bg-teal-50 p-3">
              <TrendingUp className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
            </div>
            <div className="rounded-lg bg-teal-50 p-3">
              <Users className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('tiers')}
              className={`rounded-lg px-4 py-2 font-medium transition-all ${
                viewMode === 'tiers'
                  ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Pricing Tiers
            </button>
            <button
              onClick={() => setViewMode('custom')}
              className={`rounded-lg px-4 py-2 font-medium transition-all ${
                viewMode === 'custom'
                  ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Custom Pricing
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder={viewMode === 'tiers' ? 'Search tiers...' : 'Search customers...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {viewMode === 'custom' && (
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Types</option>
              <option value="standard">Standard</option>
              <option value="custom">Custom</option>
            </select>
          )}

          <button
            onClick={() => {
              if (viewMode === 'tiers') {
                setEditingTier({
                  tier: '',
                  basePrice: 0,
                  vat: 0,
                  totalPrice: 0,
                  weightUnit: '800kg',
                  maxDistance: 45,
                  surchargeRate: 0.5,
                  description: '',
                  isDefault: false,
                  customers: [],
                });
                setShowTierModal(true);
              } else {
                setEditingCustom({
                  customerId: '',
                  customerName: '',
                  pricingType: 'Standard',
                  tierName: '',
                  basePrice: 0,
                  customRate: null,
                  flatRate: null,
                  notes: '',
                  effectiveDate: '',
                  lastUpdated: '',
                });
                setShowCustomModal(true);
              }
            }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg sm:w-auto sm:px-6"
          >
            <Plus className="h-5 w-5" />
            <span>Add {viewMode === 'tiers' ? 'Tier' : 'Custom Pricing'}</span>
          </button>
        </div>
      </div>

      {/* Pricing Tiers View */}
      {viewMode === 'tiers' && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredTiers.map((tier) => (
            <div
              key={tier.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 text-lg font-bold text-white shadow-md">
                    {tier.tier.charAt(tier.tier.length - 1)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{tier.tier}</h3>
                    {tier.isDefault && (
                      <span className="mt-1 inline-block rounded bg-teal-100 px-2 py-1 text-xs font-semibold text-teal-600">
                        Default
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditTier(tier)}
                    className="rounded-lg p-2 text-teal-600 transition-colors hover:bg-teal-50"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  {!tier.isDefault && (
                    <button
                      onClick={() => handleDeleteTier(tier)}
                      className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              <p className="mb-4 text-sm text-gray-600">{tier.description}</p>

              <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-teal-50 p-3">
                  <p className="mb-1 text-xs text-gray-600">Base Price</p>
                  <p className="text-lg font-bold text-teal-600">£{tier.basePrice.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">per {tier.weightUnit}</p>
                </div>
                <div className="rounded-lg bg-teal-50 p-3">
                  <p className="mb-1 text-xs text-gray-600">Total (inc VAT)</p>
                  <p className="text-lg font-bold text-teal-600">£{tier.totalPrice.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">VAT: £{tier.vat.toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-2 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Max Distance:</span>
                  <span className="font-semibold text-gray-900">{tier.maxDistance} miles</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Surcharge Rate:</span>
                  <span className="font-semibold text-gray-900">
                    {tier.surchargeRate * 100}% per 45mi
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active Customers:</span>
                  <span className="font-semibold text-teal-600">{tier.customers.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Pricing View */}
      {viewMode === 'custom' && (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Tier/Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Effective Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustom.map((custom) => (
                  <tr key={custom.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{custom.customerName}</p>
                        <p className="text-sm text-gray-500">{custom.customerId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          custom.pricingType === 'Custom'
                            ? 'bg-teal-100 text-teal-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {custom.pricingType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {custom.pricingType === 'Custom' ? 'Custom Rate' : custom.tierName}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-teal-600">
                        £{(custom.flatRate || custom.customRate || custom.basePrice).toFixed(2)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{custom.effectiveDate}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditCustom(custom)}
                          className="rounded-lg p-2 text-teal-600 transition-colors hover:bg-teal-50"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustom(custom)}
                          className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Tier Modal */}
      {showTierModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingTier?.id ? 'Edit Pricing Tier' : 'Add New Pricing Tier'}
              </h2>
              <button
                onClick={() => {
                  setShowTierModal(false);
                  setEditingTier(null);
                }}
                className="rounded-lg p-2 transition-colors hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Tier Name
                  </label>
                  <input
                    type="text"
                    value={editingTier?.tier || ''}
                    onChange={(e) => setEditingTier({ ...editingTier, tier: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g., Tier A"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Weight Unit
                  </label>
                  <input
                    type="text"
                    value={editingTier?.weightUnit || ''}
                    onChange={(e) => setEditingTier({ ...editingTier, weightUnit: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g., 800kg"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  value={editingTier?.description || ''}
                  onChange={(e) => setEditingTier({ ...editingTier, description: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  rows="2"
                  placeholder="Brief description of this tier"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Base Price (£)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingTier?.basePrice || ''}
                    onChange={(e) => {
                      const basePrice = parseFloat(e.target.value) || 0;
                      const vat = basePrice * 0.2;
                      const totalPrice = basePrice + vat;
                      setEditingTier({ ...editingTier, basePrice, vat, totalPrice });
                    }}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">VAT (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingTier?.vat || ''}
                    readOnly
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2"
                    placeholder="Auto-calculated"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Total Price (£)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingTier?.totalPrice || ''}
                    readOnly
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2"
                    placeholder="Auto-calculated"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Max Distance (miles)
                  </label>
                  <input
                    type="number"
                    value={editingTier?.maxDistance || ''}
                    onChange={(e) =>
                      setEditingTier({ ...editingTier, maxDistance: parseInt(e.target.value) || 0 })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                    placeholder="45"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Surcharge Rate (0-1)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingTier?.surchargeRate || ''}
                    onChange={(e) =>
                      setEditingTier({
                        ...editingTier,
                        surchargeRate: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                    placeholder="0.5"
                  />
                  <p className="mt-1 text-xs text-gray-500">0.5 = 50% of base price per 45mi</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingTier?.isDefault || false}
                  onChange={(e) => setEditingTier({ ...editingTier, isDefault: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <label className="text-sm font-semibold text-gray-700">Set as default tier</label>
              </div>
            </div>

            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
              <button
                onClick={() => {
                  setShowTierModal(false);
                  setEditingTier(null);
                }}
                className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTier}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-2 text-white shadow-md transition-all hover:shadow-lg"
              >
                <Save className="h-5 w-5" />
                Save Tier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Custom Pricing Modal */}
      {showCustomModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingCustom?.id ? 'Edit Custom Pricing' : 'Add Custom Pricing'}
              </h2>
              <button
                onClick={() => {
                  setShowCustomModal(false);
                  setEditingCustom(null);
                }}
                className="rounded-lg p-2 transition-colors hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Customer ID
                  </label>
                  <input
                    type="text"
                    value={editingCustom?.customerId || ''}
                    onChange={(e) =>
                      setEditingCustom({ ...editingCustom, customerId: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g., T022"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={editingCustom?.customerName || ''}
                    onChange={(e) =>
                      setEditingCustom({ ...editingCustom, customerName: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g., Topps Chester"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Pricing Type
                </label>
                <select
                  value={editingCustom?.pricingType || 'Standard'}
                  onChange={(e) =>
                    setEditingCustom({ ...editingCustom, pricingType: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Standard">Standard Tier</option>
                  <option value="Custom">Custom Rate</option>
                </select>
              </div>

              {editingCustom?.pricingType === 'Standard' ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">Tier</label>
                    <select
                      value={editingCustom?.tierName || ''}
                      onChange={(e) => {
                        const tier = pricingTiers.find((t) => t.tier === e.target.value);
                        setEditingCustom({
                          ...editingCustom,
                          tierName: e.target.value,
                          basePrice: tier?.basePrice || 0,
                        });
                      }}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select Tier</option>
                      {pricingTiers.map((tier) => (
                        <option key={tier.id} value={tier.tier}>
                          {tier.tier} - £{tier.totalPrice}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Base Price (£)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingCustom?.basePrice || ''}
                      readOnly
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Custom Rate (£)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingCustom?.customRate || ''}
                      onChange={(e) =>
                        setEditingCustom({
                          ...editingCustom,
                          customRate: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Flat Rate (Optional)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingCustom?.flatRate || ''}
                      onChange={(e) =>
                        setEditingCustom({
                          ...editingCustom,
                          flatRate: parseFloat(e.target.value) || null,
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Notes</label>
                <textarea
                  value={editingCustom?.notes || ''}
                  onChange={(e) => setEditingCustom({ ...editingCustom, notes: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  rows="2"
                  placeholder="Additional notes about this pricing"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Effective Date
                </label>
                <input
                  type="date"
                  value={editingCustom?.effectiveDate || ''}
                  onChange={(e) =>
                    setEditingCustom({ ...editingCustom, effectiveDate: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
              <button
                onClick={() => {
                  setShowCustomModal(false);
                  setEditingCustom(null);
                }}
                className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCustom}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-2 text-white shadow-md transition-all hover:shadow-lg"
              >
                <Save className="h-5 w-5" />
                Save Pricing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedItem && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900">Confirm Delete</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <h3 className="mb-2 text-center text-lg font-semibold text-gray-900">
                {deleteType === 'tier' ? 'Delete Pricing Tier' : 'Delete Custom Pricing'}
              </h3>
              <p className="mb-4 text-center text-sm text-gray-600">
                Are you sure you want to delete{' '}
                <strong>
                  {deleteType === 'tier' ? selectedItem.tier : selectedItem.customerName}
                </strong>
                ? This action cannot be undone and will remove all{' '}
                {deleteType === 'tier' ? 'tier' : 'pricing'} data.
              </p>

              {/* Summary */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="space-y-2 text-sm">
                  {deleteType === 'tier' ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tier Name:</span>
                        <span className="font-medium text-gray-900">{selectedItem.tier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base Price:</span>
                        <span className="font-medium text-gray-900">
                          £{selectedItem.basePrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Price:</span>
                        <span className="font-medium text-gray-900">
                          £{selectedItem.totalPrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active Customers:</span>
                        <span className="font-medium text-gray-900">
                          {selectedItem.customers?.length || 0}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customer:</span>
                        <span className="font-medium text-gray-900">
                          {selectedItem.customerName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customer ID:</span>
                        <span className="font-medium text-gray-900">{selectedItem.customerId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pricing Type:</span>
                        <span className="font-medium text-gray-900">
                          {selectedItem.pricingType}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base Price:</span>
                        <span className="font-medium text-gray-900">
                          £{selectedItem.basePrice?.toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="inline-flex items-center space-x-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-red-700 hover:shadow-lg"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>{deleteType === 'tier' ? 'Delete Tier' : 'Delete Pricing'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingManagement;
