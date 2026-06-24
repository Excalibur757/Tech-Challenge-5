// app/page.tsx
"use client";

import Header from "@/components/header";
import { useState, useEffect } from "react";

export default function Home() {
  // Estados para os controles
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [letterSpacing, setLetterSpacing] = useState(0);

  // Aplica as configurações no root da página
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    document.documentElement.style.lineHeight = lineHeight.toString();
    document.documentElement.style.letterSpacing = `${letterSpacing}px`;
  }, [fontSize, lineHeight, letterSpacing]);

  // Funções para manipular os ranges
  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFontSize(Number(e.target.value));
  };

  const handleLineHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLineHeight(Number(e.target.value));
  };

  const handleLetterSpacingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLetterSpacing(Number(e.target.value));
  };

  // Reset para valores padrão
  const resetDefaults = () => {
    setFontSize(16);
    setLineHeight(1.5);
    setLetterSpacing(0);
  };

  return (
    <main className="min-h-screen dark:bg-black">
        <Header />
      {/* Container principal com padding */}
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <header className="bg-blue-600 text-white p-6 rounded-lg">
          <h1 className="text-2xl font-bold">Configurações de Acessibilidade</h1>
          <p className="opacity-90">Ajuste o texto para melhor leitura</p>
        </header>

        {/* Painel de Configurações */}
        <section className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
            Personalizar Texto
          </h2>

          {/* Controle: Tamanho da Fonte */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="fontSize" className="font-medium text-gray-700">
                Tamanho da Fonte
              </label>
              <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {fontSize}px
              </span>
            </div>
            <input
              type="range"
              id="fontSize"
              min="12"
              max="32"
              step="1"
              value={fontSize}
              onChange={handleFontSizeChange}
              className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 px-1">
              <span>Menor</span>
              <span>Maior</span>
            </div>
          </div>

          {/* Controle: Espaçamento entre linhas */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="lineHeight" className="font-medium text-gray-700">
                Espaçamento entre Linhas
              </label>
              <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {lineHeight.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              id="lineHeight"
              min="1"
              max="2.5"
              step="0.1"
              value={lineHeight}
              onChange={handleLineHeightChange}
              className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 px-1">
              <span>Compacto</span>
              <span>Espaçado</span>
            </div>
          </div>

          {/* Controle: Espaçamento entre letras */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="letterSpacing" className="font-medium text-gray-700">
                Espaçamento entre Letras
              </label>
              <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {letterSpacing}px
              </span>
            </div>
            <input
              type="range"
              id="letterSpacing"
              min="0"
              max="5"
              step="0.5"
              value={letterSpacing}
              onChange={handleLetterSpacingChange}
              className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 px-1">
              <span>Junto</span>
              <span>Separado</span>
            </div>
          </div>

          {/* Botão Reset */}
          <button
            onClick={resetDefaults}
            className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Restaurar Padrões
          </button>
        </section>

        {/* Área de Visualização */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
            Visualização
          </h2>
          
          <div className="space-y-4">
            <p className="text-gray-800">
              Este é um exemplo de como o texto será exibido com as configurações atuais.
              Ajuste os controles acima para ver as mudanças em tempo real.
            </p>
            
            <p className="text-gray-700">
              <strong>Dica:</strong> Para idosos, recomenda-se fontes entre 18-22px, 
              espaçamento entre linhas de 1.5 a 2.0 e espaçamento entre letras de 1-2px 
              para melhor legibilidade.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-blue-800">
                📖 &quot;A acessibilidade não é um favor, é um direito.&quot;
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}