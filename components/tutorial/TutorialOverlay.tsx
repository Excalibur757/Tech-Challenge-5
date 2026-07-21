// components/tutorial/TutorialOverlay.tsx
"use client";

import { useState, useEffect } from 'react';
import { tutorialService } from '@/services/tutorial.service';
import Modal from '@/utils/modal';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  target?: string;
}

interface TutorialOverlayProps {
  onComplete?: () => void;
}

export function TutorialOverlay({ onComplete }: TutorialOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado para o Modal de confirmação de pular
  const [showSkipModal, setShowSkipModal] = useState(false);

  const steps: TutorialStep[] = [
    {
      id: 'welcome',
      title: '👋 Bem-vindo ao Gerenciador de Tarefas!',
      description: 'Vamos te mostrar como usar todas as funcionalidades incríveis da plataforma. Clique em "Próximo" para continuar.',
      icon: '🎉'
    },
    {
      id: 'add-task',
      title: '📝 Adicionar Tarefas',
      description: 'Digite o nome da sua tarefa aqui e clique em "Adicionar". Você também pode definir a prioridade antes de adicionar!',
      icon: '✏️',
      target: 'input[placeholder*="Digite sua tarefa"]'
    },
    {
      id: 'priorities',
      title: '🎯 Prioridades',
      description: 'Use as cores para definir prioridades: 🔴 Alta (urgente), 🟡 Média (importante) e 🟢 Baixa (simples).',
      icon: '🏷️',
      target: 'button:has(span:contains("🔴 Alta"))'
    },
    {
      id: 'complete-task',
      title: '✅ Concluir Tarefas',
      description: 'Clique no círculo ao lado da tarefa para marcar como concluída. Tarefas concluídas ficam com um risco!',
      icon: '✔️',
      target: '.rounded-full.border-2'
    },
    {
      id: 'filters',
      title: '🔍 Filtrar e Buscar',
      description: 'Use a busca para encontrar tarefas rapidamente e os filtros para ver apenas ativas ou concluídas.',
      icon: '🔎',
      target: 'input[placeholder*="Buscar tarefas"]'
    },
    {
      id: 'mode-toggle',
      title: '🔄 Modos de Visualização',
      description: 'Alterne entre o modo Simplificado (foco no essencial) e o modo Completo (todas as funcionalidades).',
      icon: '🔧',
      target: 'button:has(span:contains("Completo"))'
    },
    {
      id: 'history',
      title: '📜 Histórico de Atividades',
      description: 'Acompanhe todas as ações realizadas no histórico. As tarefas removidas ainda permanecem no histórico!',
      icon: '📜',
      target: 'button[title="Histórico"]'
    },
    {
      id: 'notifications',
      title: '🔔 Notificações',
      description: 'Receba notificações sobre suas tarefas e lembretes importantes. Configure as preferências nas configurações.',
      icon: '🔔',
      target: 'button[title="Notificações"]'
    },
    {
      id: 'complete',
      title: '🚀 Tudo Pronto!',
      description: 'Agora você já sabe como usar todas as funcionalidades. Comece a organizar suas tarefas agora mesmo!',
      icon: '🎯'
    }
  ];

  useEffect(() => {
    const loadTutorial = () => {
      const shouldShow = tutorialService.shouldShowTutorial();
      setIsVisible(shouldShow);
      setIsLoading(false);
    };

    loadTutorial();
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    tutorialService.markTutorialAsCompleted();
    setIsVisible(false);
    if (onComplete) {
      onComplete();
    }
  };

  // Função para abrir o modal de confirmação de pular
  const handleSkip = () => {
    setShowSkipModal(true);
  };

  // Função para confirmar o pular
  const confirmSkip = () => {
    setShowSkipModal(false);
    handleComplete();
  };

  // Função para cancelar o pular
  const cancelSkip = () => {
    setShowSkipModal(false);
  };

  if (isLoading || !isVisible) {
    return null;
  }

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <>
      {/* Overlay escuro */}
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />

      {/* Card do tutorial */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 pointer-events-none">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl pointer-events-auto animate-in fade-in zoom-in duration-300">
          {/* Progresso */}
          <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-t-2xl overflow-hidden">
            <div 
              className="h-full bg-linear-to-r from-purple-500 to-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Conteúdo */}
          <div className="p-6">
            {/* Ícone e título */}
            <div className="text-center mb-4">
              <div className="text-6xl mb-3 animate-bounce">
                {step.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {step.title}
              </h2>
            </div>

            {/* Descrição */}
            <p className="text-gray-600 dark:text-gray-300 text-center text-sm leading-relaxed">
              {step.description}
            </p>

            {/* Indicador de passos */}
            <div className="flex justify-center gap-1.5 mt-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'w-6 bg-purple-500'
                      : index < currentStep
                      ? 'w-3 bg-blue-400'
                      : 'w-3 bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-2 mt-6">
              {/* Indicador de passo */}
              <div className="text-xs text-gray-400 dark:text-gray-500 text-center sm:text-left flex-1 flex items-center justify-center sm:justify-start">
                {currentStep + 1} de {steps.length}
              </div>

              <div className="flex gap-2 flex-1 justify-center sm:justify-end">
                {!isFirstStep && (
                  <button
                    onClick={handlePrevious}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Voltar
                  </button>
                )}

                {!isLastStep ? (
                  <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-purple-600/25"
                  >
                    Próximo →
                  </button>
                ) : (
                  <button
                    onClick={handleComplete}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-green-600/25"
                  >
                    🚀 Começar!
                  </button>
                )}

                {!isLastStep && (
                  <button
                    onClick={handleSkip}
                    className="px-3 py-2 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    Pular
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmação para pular tutorial */}
      <Modal
        visible={showSkipModal}
        title="Pular Tutorial"
        description="Tem certeza que deseja pular o tutorial? Você pode acessá-lo novamente nas configurações."
        confirmLabel="Sim, pular"
        cancelLabel="Cancelar"
        onConfirm={confirmSkip}
        onCancel={cancelSkip}
      />
    </>
  );
}