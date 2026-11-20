import React, { useState } from 'react';
import {
  Laptop,
  Tablet,
  Smartphone,
  RefreshCw,
  Plus,
  Shield,
  ShieldOff,
} from 'lucide-react';
import type { DeviceType, SyncedDevice } from '../types/schoolPrepared';

interface DevicesViewProps {
  devices: SyncedDevice[];
  isDeviceLocked: boolean;
  onToggleDeviceShield: (deviceId: string) => void;
  onSyncAllDevices: () => void;
  onAddDevice: (name: string, type: DeviceType) => void;
}

function DeviceTypeIcon({ type }: { type: DeviceType }) {
  switch (type) {
    case 'laptop':
      return <Laptop className="w-5 h-5" aria-hidden="true" />;
    case 'ipad':
      return <Tablet className="w-5 h-5" aria-hidden="true" />;
    case 'phone':
      return <Smartphone className="w-5 h-5" aria-hidden="true" />;
  }
}

export function DevicesView({
  devices,
  isDeviceLocked,
  onToggleDeviceShield,
  onSyncAllDevices,
  onAddDevice,
}: DevicesViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState<DeviceType>('ipad');
  const [formError, setFormError] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const handleSync = () => {
    onSyncAllDevices();
    setSyncMessage('All devices synced just now');
    setTimeout(() => setSyncMessage(null), 2500);
  };

  const handleSubmitDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (deviceName.trim().length < 2) {
      setFormError('Enter a device name (at least 2 characters).');
      return;
    }
    onAddDevice(deviceName.trim(), deviceType);
    setDeviceName('');
    setFormError(null);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Cross-Device Sync & Shield
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Assignments and app lock rules sync automatically across your laptop, iPad, and phone.
          </p>
          {syncMessage && (
            <p role="status" className="mt-1.5 text-xs font-medium text-emerald-700">
              {syncMessage}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleSync}
            className="min-h-[40px] px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors inline-flex items-center gap-2 whitespace-nowrap"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            <span>Sync All</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAddForm((prev) => !prev)}
            className="min-h-[40px] px-4 py-2 text-sm font-semibold text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Connect Device</span>
          </button>
        </div>
      </section>

      {/* Optional Add Device Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmitDevice}
          className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4"
        >
          <h3 className="text-sm font-bold text-slate-900">
            Pair Another Laptop, iPad, or Phone
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label
                htmlFor="new-device-name"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Device Name
              </label>
              <input
                id="new-device-name"
                type="text"
                value={deviceName}
                onChange={(e) => {
                  setDeviceName(e.target.value);
                  if (formError) setFormError(null);
                }}
                placeholder="e.g. School Chromebook or Study iPad"
                className="w-full min-h-[40px] px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              {formError && (
                <p role="alert" className="mt-1 text-xs font-medium text-red-700">
                  {formError}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="new-device-type"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Device Type
              </label>
              <select
                id="new-device-type"
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value as DeviceType)}
                className="w-full min-h-[40px] px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="laptop">Laptop</option>
                <option value="ipad">iPad / Tablet</option>
                <option value="phone">Phone</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setFormError(null);
              }}
              className="min-h-[38px] px-3.5 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[38px] px-4 py-1.5 text-sm font-semibold text-white bg-indigo-700 rounded-lg hover:bg-indigo-800"
            >
              Pair Device
            </button>
          </div>
        </form>
      )}

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {devices.map((device) => {
          const activeLockOnDevice = device.shieldEnabled && isDeviceLocked;

          return (
            <article
              key={device.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl border flex items-center justify-center ${
                      activeLockOnDevice
                        ? 'bg-amber-50 border-amber-200 text-amber-800'
                        : device.shieldEnabled
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-slate-100 border-slate-200 text-slate-500'
                    }`}
                  >
                    <DeviceTypeIcon type={device.type} />
                  </div>

                  <span
                    className={`text-xs font-medium inline-flex items-center gap-1 ${
                      activeLockOnDevice
                        ? 'text-amber-800'
                        : device.shieldEnabled
                        ? 'text-emerald-700'
                        : 'text-slate-500'
                    }`}
                  >
                    {device.shieldEnabled ? (
                      <>
                        <Shield className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{isDeviceLocked ? 'Apps Locked' : 'Shield Ready'}</span>
                      </>
                    ) : (
                      <>
                        <ShieldOff className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Shield Paused</span>
                      </>
                    )}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{device.name}</h3>
                  <p className="text-xs text-slate-500 tabular-nums mt-0.5">
                    {device.platform} · Synced{' '}
                    {new Date(device.lastSyncedAt).toLocaleTimeString([], {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={device.shieldEnabled}
                aria-label={`Toggle app lock shield for ${device.name}`}
                onClick={() => onToggleDeviceShield(device.id)}
                className={`w-full min-h-[42px] px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg border transition-colors ${
                  device.shieldEnabled
                    ? 'bg-slate-900 border-slate-900 text-white hover:bg-slate-800'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {device.shieldEnabled ? 'Shield Enabled' : 'Enable Shield'}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
