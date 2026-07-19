// services/notification.service.ts
"use client";

type NotificationPreference = "reminders" | "notifications" | "both" | "none";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "reminder" | "notification";
  timestamp: Date;
  read: boolean;
  taskId?: string;
}

class NotificationService {
  private static instance: NotificationService;
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];
  private preference: NotificationPreference = "both";
  private isBrowser = typeof window !== 'undefined';

  private constructor() {
    if (this.isBrowser) {
      this.loadNotifications();
      this.loadPreference();
    }
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private loadNotifications() {
    try {
      const saved = localStorage.getItem("notifications");
      if (saved) {
        this.notifications = JSON.parse(saved).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
      }
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    }
  }

  private loadPreference() {
    try {
      // Tentar carregar das configurações de acessibilidade
      const settings = localStorage.getItem("accessibilitySettings");
      if (settings) {
        const parsed = JSON.parse(settings);
        if (parsed.notificationPreference) {
          this.preference = parsed.notificationPreference;
        }
      }
    } catch (error) {
      console.error("Erro ao carregar preferência:", error);
    }
  }

  private saveNotifications() {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem("notifications", JSON.stringify(this.notifications));
    } catch (error) {
      console.error("Erro ao salvar notificações:", error);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.getVisibleNotifications()));
  }

  getVisibleNotifications(): Notification[] {
    const filtered = this.notifications.filter(n => !n.read);
    
    switch (this.preference) {
      case "reminders":
        return filtered.filter(n => n.type === "reminder");
      case "notifications":
        return filtered.filter(n => n.type === "notification");
      case "both":
        return filtered;
      case "none":
        return [];
      default:
        return filtered;
    }
  }

  setPreference(preference: NotificationPreference) {
    this.preference = preference;
    if (this.isBrowser) {
      try {
        // Atualizar nas configurações de acessibilidade
        const settings = localStorage.getItem("accessibilitySettings");
        if (settings) {
          const parsed = JSON.parse(settings);
          parsed.notificationPreference = preference;
          localStorage.setItem("accessibilitySettings", JSON.stringify(parsed));
        }
      } catch (error) {
        console.error("Erro ao salvar preferência:", error);
      }
    }
    this.notifyListeners();
  }

  addNotification(title: string, message: string, type: "reminder" | "notification", taskId?: string): Notification | null {
    // Verificar se deve mostrar baseado na preferência
    if (this.preference === "none") return null;
    if (type === "reminder" && this.preference === "notifications") return null;
    if (type === "notification" && this.preference === "reminders") return null;

    const notification: Notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date(),
      read: false,
      taskId,
    };

    this.notifications.unshift(notification);
    this.saveNotifications();
    this.notifyListeners();

    // Mostrar notificação do navegador
    this.showBrowserNotification(title, message);

    return notification;
  }

  private showBrowserNotification(title: string, message: string) {
    if (!this.isBrowser) return;
    
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body: message,
          icon: '/favicon.ico',
        });
      } else if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }

  markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.saveNotifications();
    this.notifyListeners();
  }

  clearAll() {
    this.notifications = [];
    this.saveNotifications();
    this.notifyListeners();
  }

  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getUnreadCount(): number {
    return this.getVisibleNotifications().filter(n => !n.read).length;
  }

  // Sincronizar com as configurações de acessibilidade
  syncWithSettings() {
    if (!this.isBrowser) return;
    try {
      const settings = localStorage.getItem("accessibilitySettings");
      if (settings) {
        const parsed = JSON.parse(settings);
        if (parsed.notificationPreference && parsed.notificationPreference !== this.preference) {
          this.setPreference(parsed.notificationPreference);
        }
      }
    } catch (error) {
      console.error("Erro ao sincronizar configurações:", error);
    }
  }
}

export const notificationService = NotificationService.getInstance();