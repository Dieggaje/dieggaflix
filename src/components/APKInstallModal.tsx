import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  X,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Terminal,
  QrCode,
  Sparkles,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface APKInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const APKInstallModal: React.FC<APKInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, install, isInstalled, isAndroid, isIOS } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'direct' | 'cli' | 'qr'>('direct');

  if (!isOpen) return null;

  const appUrl = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#0f101d] border border-[#232541] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#212338] flex items-center justify-between bg-[#131424]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-violet-950/60">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>Instalar APK / App Android</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono border border-emerald-500/30">
                  ANDROID & PWA
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                DieggaFlix en tu móvil con pantalla completa y sin barras de navegador
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#212338] bg-[#0c0d17] px-5 pt-2">
          <button
            onClick={() => setActiveTab('direct')}
            className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'direct'
                ? 'border-violet-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Instalación Directa
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'qr'
                ? 'border-violet-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Abrir en Teléfono
          </button>
          <button
            onClick={() => setActiveTab('cli')}
            className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'cli'
                ? 'border-violet-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Compilar APK Nativo (.apk)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs text-slate-300">
          {activeTab === 'direct' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#161729] border border-[#262846] space-y-2">
                <div className="flex items-center gap-2 text-violet-400 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Instalación Nativa WebAPK</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Android Chrome y navegadores modernos compilan automáticamente DieggaFlix en una aplicación nativa <strong>WebAPK</strong> con icono en el escritorio, reproductor en pantalla completa y soporte sin conexión.
                </p>

                {isInstalled ? (
                  <div className="mt-3 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4" />
                    <span>¡DieggaFlix ya está instalado en este dispositivo!</span>
                  </div>
                ) : isInstallable ? (
                  <button
                    onClick={handleInstallClick}
                    className="mt-3 w-full py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-950/60 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>Instalar DieggaFlix Ahora en tu Dispositivo</span>
                  </button>
                ) : (
                  <div className="mt-3 space-y-2">
                    <p className="text-[11px] text-slate-400">
                      Para instalar en tu teléfono móvil Android:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1">
                      <li>Abre el enlace de la app en Chrome para Android.</li>
                      <li>Toca los tres puntos del menú <strong className="text-white">(⋮)</strong> arriba a la derecha.</li>
                      <li>Toca <strong className="text-violet-400">"Instalar aplicación"</strong> o <strong className="text-violet-400">"Añadir a pantalla de inicio"</strong>.</li>
                      <li>Android descargará y creará el APK funcional en tu cajón de apps.</li>
                    </ol>
                  </div>
                )}
              </div>

              {isIOS && (
                <div className="p-3.5 rounded-xl bg-[#1a1c30] border border-[#2a2c4a] space-y-1.5">
                  <span className="font-bold text-white">¿Estás en un iPhone / iPad?</span>
                  <p className="text-slate-400 text-[11px]">
                    Pulsa el botón <strong>Compartir</strong> en Safari y selecciona <strong>"Añadir a la pantalla de inicio"</strong>.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="space-y-4">
              <p className="text-slate-300">
                Abre esta URL en tu teléfono móvil para instalar DieggaFlix como app nativa:
              </p>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#161729] border border-[#262846]">
                <input
                  type="text"
                  readOnly
                  value={appUrl}
                  className="w-full bg-transparent text-slate-200 text-xs font-mono focus:outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#131422] border border-[#202236] text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center mx-auto">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-white">Acceso Móvil Instantáneo</h4>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  El diseño de DieggaFlix es totalmente responsive: barra lateral adaptable, reproductor táctil para móviles y aceleración por GPU.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'cli' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-violet-950/40 via-[#181a30] to-indigo-950/40 border border-violet-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-violet-300 font-bold text-sm">
                    <Download className="w-4 h-4 text-violet-400" />
                    <span>Método más fácil: Generar APK en PWABuilder (Sin instalar nada)</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                    RECOMENDADO
                  </span>
                </div>

                <p className="text-slate-300 leading-relaxed text-xs">
                  PWABuilder empaqueta automáticamente el manifiesto y Service Worker de DieggaFlix en un archivo binario <strong>.apk</strong> listo para instalar en cualquier Android:
                </p>

                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-xs pl-1">
                  <li>Haz clic en el botón morado de abajo para abrir PWABuilder con tu app cargada.</li>
                  <li>Pulsa en <strong>"Package for Android"</strong>.</li>
                  <li>Selecciona <strong>"Download APK"</strong> (o archivo firmado listo).</li>
                  <li>¡Pasa el archivo .apk a tu móvil o ábrelo directamente para instalar DieggaFlix!</li>
                </ol>

                <a
                  href={`https://www.pwabuilder.com/?url=${encodeURIComponent('https://ais-pre-qbsrpwr4hxyuloyw3vphig-702705267157.europe-west2.run.app')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-950/60 transition-all hover:scale-[1.01]"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Abrir Generador de APK en PWABuilder</span>
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-[#141525] border border-[#22243d] space-y-2">
                <div className="flex items-center gap-2 text-violet-400 font-bold">
                  <Terminal className="w-4 h-4" />
                  <span>Opción Avanzada: Compilar por Terminal con Bubblewrap (Google TWA)</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Si tienes Android SDK o Node.js en tu PC, puedes compilar el APK manualmente con Bubblewrap:
                </p>

                <div className="p-3 rounded-lg bg-black/70 border border-white/10 font-mono text-[11px] text-emerald-400 select-all overflow-x-auto leading-relaxed">
                  npx @bubblewrap/cli init --manifest="https://ais-pre-qbsrpwr4hxyuloyw3vphig-702705267157.europe-west2.run.app/manifest.webmanifest"<br />
                  npx @bubblewrap/cli build
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0d0e19] border-t border-[#212338] flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            DieggaFlix v1.0.0 · PWA & Android Compliant
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#1e2034] text-slate-300 hover:text-white text-xs font-medium transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
