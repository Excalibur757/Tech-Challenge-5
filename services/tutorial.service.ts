// services/tutorial.service.ts
"use client";

class TutorialService {
  private static instance: TutorialService;
  private readonly STORAGE_KEY = "tutorial_completed";

  private constructor() {}

  static getInstance(): TutorialService {
    if (!TutorialService.instance) {
      TutorialService.instance = new TutorialService();
    }
    return TutorialService.instance;
  }

  /**
   * Verifica se o tutorial já foi mostrado
   */
  isTutorialCompleted(): boolean {
    if (typeof window === 'undefined') return true;
    
    try {
      const completed = localStorage.getItem(this.STORAGE_KEY);
      return completed === 'true';
    } catch (error) {
      console.error("Erro ao verificar tutorial:", error);
      return true; // Se der erro, assume que já foi mostrado
    }
  }

  /**
   * Marca o tutorial como concluído
   */
  markTutorialAsCompleted(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.STORAGE_KEY, 'true');
    } catch (error) {
      console.error("Erro ao marcar tutorial como concluído:", error);
    }
  }

  /**
   * Reseta o tutorial (para testes)
   */
  resetTutorial(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error("Erro ao resetar tutorial:", error);
    }
  }

  /**
   * Verifica se deve mostrar o tutorial
   */
  shouldShowTutorial(): boolean {
    return !this.isTutorialCompleted();
  }
}

export const tutorialService = TutorialService.getInstance();