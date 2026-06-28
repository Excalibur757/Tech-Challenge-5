import { Settings } from "../../../types/settings";

interface TextSettingsProps {
  settings: Settings;

  handleFontSizeChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;

  handleLineHeightChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;

  handleLetterSpacingChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

export default function TextSettings({
  settings,
  handleFontSizeChange,
  handleLineHeightChange,
  handleLetterSpacingChange,
}: TextSettingsProps) {  return (
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white border-b dark:border-gray-700 pb-2">
            Personalizar Texto
          </h2>

          {/* Controle: Tamanho da Fonte */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="fontSize" className="font-medium text-gray-700 dark:text-gray-300">
                Tamanho da Fonte
              </label>
              <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                {settings.fontSize}px
              </span>
            </div>
            <input
              type="range"
              id="fontSize"
              min="12"
              max="32"
              step="1"
              value={settings.fontSize}
              onChange={handleFontSizeChange}
              className="w-full h-2 bg-blue-200 dark:bg-blue-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
              <span>Menor</span>
              <span>Maior</span>
            </div>
          </div>

          {/* Controle: Espaçamento entre linhas */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="lineHeight" className="font-medium text-gray-700 dark:text-gray-300">
                Espaçamento entre Linhas
              </label>
              <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                {settings.lineHeight.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              id="lineHeight"
              min="1"
              max="2.5"
              step="0.1"
              value={settings.lineHeight}
              onChange={handleLineHeightChange}
              className="w-full h-2 bg-blue-200 dark:bg-blue-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
              <span>Compacto</span>
              <span>Espaçado</span>
            </div>
          </div>

          {/* Controle: Espaçamento entre letras */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="letterSpacing" className="font-medium text-gray-700 dark:text-gray-300">
                Espaçamento entre Letras
              </label>
              <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                {settings.letterSpacing}px
              </span>
            </div>
            <input
              type="range"
              id="letterSpacing"
              min="0"
              max="5"
              step="0.5"
              value={settings.letterSpacing}
              onChange={handleLetterSpacingChange}
              className="w-full h-2 bg-blue-200 dark:bg-blue-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
              <span>Junto</span>
              <span>Separado</span>
            </div>
          </div>
        </section>
    );
}