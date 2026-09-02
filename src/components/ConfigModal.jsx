import React, { useState } from 'react';
import { X, Key, Globe, FileText, Loader2 } from 'lucide-react';
import { testKoboConnection } from '../services/api.js';
import { SERVER_OPTIONS, buildConfigPayload } from '../utils/configModalHelpers.js';
import ConfigFormField from './ConfigModal/ConfigFormField.jsx';
import TestResultAlert from './ConfigModal/TestResultAlert.jsx';

export default function ConfigModal({
  isOpen = false,
  onClose = () => {},
  config = {},
  onSaveConfig = () => {}
}) {
  const [serverUrl, setServerUrl] = useState(config.serverUrl || 'https://kf.kobotoolbox.org');
  const [assetUid, setAssetUid] = useState(config.assetUid || '');
  const [token, setToken] = useState(config.token || '');

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const payload = buildConfigPayload({ serverUrl, assetUid, token });
      const res = await testKoboConnection(payload);
      setTestResult(res);
    } catch (err) {
      setTestResult({ success: false, error: err.message });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = buildConfigPayload({ serverUrl, assetUid, token });
    onSaveConfig(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Key size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">Configuración de KoboToolbox API</h3>
              <p className="text-xs text-slate-400">Parámetros de autenticación segura (v2 API)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          {/* Server URL select */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Globe size={14} className="text-blue-600" />
              <span>Servidor KoboToolbox</span>
            </label>
            <select
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer font-sans text-xs"
            >
              {SERVER_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Asset UID input */}
          <ConfigFormField
            label="Asset UID (ID del Formulario)"
            icon={FileText}
            placeholder="Ej. aX9kL3mP9qZ..."
            value={assetUid}
            helperText="Identificador único que se encuentra en la URL de tu proyecto en KoboToolbox."
            onChange={setAssetUid}
          />

          {/* API Token input */}
          <ConfigFormField
            label="KOBO API Token"
            icon={Key}
            type="password"
            placeholder="Ej. 7f8a9b0c1d2e3f4a5b6c..."
            value={token}
            helperText="Obtén tu token personal en Account Settings > API Tokens en Kobo."
            onChange={setToken}
          />

          {/* Test Result Message */}
          <TestResultAlert testResult={testResult} />

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing || !token || !assetUid}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-semibold rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              {testing ? <Loader2 size={14} className="animate-spin text-blue-600" /> : null}
              <span>Probar Conexión</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-600 font-semibold rounded-lg border border-slate-300 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm cursor-pointer"
              >
                Guardar Configuración
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
