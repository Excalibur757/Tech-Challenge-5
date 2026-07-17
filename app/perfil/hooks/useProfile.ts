// app/hooks/useProfile.ts
"use client";

import { useEffect, useState, useCallback } from "react";

type ProfileData = {
  name: string;
  age: string;
  email: string;
  phone: string;
  password: string;
};

const initialProfile: ProfileData = {
  name: "",
  age: "",
  email: "",
  phone: "",
  password: "",
};

interface UseProfileReturn {
  // Estados
  profileData: ProfileData;
  initialValues: ProfileData;
  isSaved: boolean;
  showSavedMessage: boolean;
  saveMessageType: "success" | "error" | "info" | "warning";
  saveMessageText: string;
  wantChangePassword: boolean;
  currentPassword: string;
  pendingAction: "save" | "reset" | null;
  showConfirmModal: boolean;
  savedPassword: string;
  passwordError: string;
  isLoading: boolean;

  // Handlers
  handleFieldChange: (field: keyof ProfileData, value: string) => void;
  setWantChangePassword: (value: boolean) => void;
  setCurrentPassword: (value: string) => void;
  
  // Ações
  closeAlert: () => void; // <-- Adicionado
  attemptSave: () => void;
  attemptReset: () => void;
  handleConfirmAction: () => void;
  handleCancelAction: () => void;
  goToHome: () => void;
}

export function useProfile(): UseProfileReturn {
  const [profileData, setProfileData] = useState<ProfileData>(initialProfile);
  const [initialValues, setInitialValues] = useState<ProfileData>(initialProfile);
  const [isSaved, setIsSaved] = useState(true);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [saveMessageType, setSaveMessageType] = useState<"success" | "error" | "info" | "warning">("success");
  const [saveMessageText, setSaveMessageText] = useState("Perfil atualizado com sucesso!");
  const [wantChangePassword, setWantChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [pendingAction, setPendingAction] = useState<"save" | "reset" | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [savedPassword, setSavedPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Carregar perfil
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedName = localStorage.getItem("authName") || localStorage.getItem("authUser") || "";
    const storedPassword = localStorage.getItem("authPassword") || localStorage.getItem("profilePassword") || "";

    const loadedProfile: ProfileData = {
      name: storedName,
      age: localStorage.getItem("profileAge") || "",
      email: localStorage.getItem("profileEmail") || "",
      phone: localStorage.getItem("profilePhone") || "",
      password: "",
    };

    setProfileData(loadedProfile);
    setInitialValues(loadedProfile);
    setSavedPassword(storedPassword);
    setCurrentPassword("");
    setWantChangePassword(false);
    setPasswordError("");
    setIsSaved(true);
    setIsLoading(false);
  }, []);

  // Função para fechar o alarme
  const closeAlert = useCallback(() => {
    setShowSavedMessage(false);
  }, []);

  // Handlers
  const handleFieldChange = useCallback((field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    setIsSaved(false);
    setShowSavedMessage(false);
  }, []);

  // Funções de utilidade para mensagens
  const showMessage = useCallback((type: "success" | "error" | "info" | "warning", text: string) => {
    setSaveMessageType(type);
    setSaveMessageText(text);
    setShowSavedMessage(true);

    setTimeout(() => {
      setShowSavedMessage(false);
    }, 2200);
  }, []);

  // Ações principais
  const performSave = useCallback(() => {
    const hasProfileChanges =
      profileData.name !== initialValues.name ||
      profileData.age !== initialValues.age ||
      profileData.email !== initialValues.email ||
      profileData.phone !== initialValues.phone;

    if (!hasProfileChanges && !wantChangePassword) {
      showMessage("warning", "Não há alterações para serem salvas");
      return;
    }

    if (wantChangePassword) {
      if (!currentPassword.trim()) {
        setPasswordError("Informe a senha atual para alterar a senha.");
        return;
      }

      if (currentPassword !== savedPassword) {
        setPasswordError("A senha atual informada não confere.");
        return;
      }

      if (!profileData.password.trim()) {
        setPasswordError("Informe a nova senha.");
        return;
      }

      setPasswordError("");
    }

    const valuesToSave = { ...profileData };

    if (typeof window !== "undefined") {
      localStorage.setItem("authName", valuesToSave.name);
      localStorage.setItem("authUser", valuesToSave.name);
      localStorage.setItem("profileAge", valuesToSave.age);
      localStorage.setItem("profileEmail", valuesToSave.email);
      localStorage.setItem("profilePhone", valuesToSave.phone);

      if (wantChangePassword && valuesToSave.password.trim()) {
        localStorage.setItem("authPassword", valuesToSave.password);
        localStorage.setItem("profilePassword", valuesToSave.password);
        setSavedPassword(valuesToSave.password);
      }

      window.dispatchEvent(new Event("storage"));
    }

    setInitialValues({ ...valuesToSave, password: "" });
    setProfileData((prev) => ({ ...prev, password: "" }));
    setCurrentPassword("");
    setIsSaved(true);
    showMessage("success", "Perfil atualizado com sucesso!");
  }, [profileData, initialValues, wantChangePassword, currentPassword, savedPassword, showMessage]);

  const performReset = useCallback(() => {
    const hasResettableChanges =
      !isSaved ||
      wantChangePassword ||
      currentPassword.trim().length > 0 ||
      profileData.password.trim().length > 0;

    if (!hasResettableChanges) {
      showMessage("warning", "Não há alterações para serem restauradas");
      return;
    }

    setProfileData({ ...initialValues, password: "" });
    setCurrentPassword("");
    setWantChangePassword(false);
    setPasswordError("");
    setIsSaved(true);
    showMessage("success", "Alterações restauradas com sucesso!");
  }, [isSaved, wantChangePassword, currentPassword, profileData.password, initialValues, showMessage]);

  // Ações do modal
  const attemptSave = useCallback(() => {
    setPendingAction("save");
    setShowConfirmModal(true);
  }, []);

  const attemptReset = useCallback(() => {
    setPendingAction("reset");
    setShowConfirmModal(true);
  }, []);

  const handleConfirmAction = useCallback(() => {
    setShowConfirmModal(false);
    if (pendingAction === "save") {
      performSave();
    } else if (pendingAction === "reset") {
      performReset();
    }
    setPendingAction(null);
  }, [pendingAction, performSave, performReset]);

  const handleCancelAction = useCallback(() => {
    setShowConfirmModal(false);
    setPendingAction(null);
  }, []);

  // Navegação
  const goToHome = useCallback(() => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }, []);

  return {
    // Estados
    profileData,
    initialValues,
    isSaved,
    showSavedMessage,
    saveMessageType,
    saveMessageText,
    wantChangePassword,
    currentPassword,
    pendingAction,
    showConfirmModal,
    savedPassword,
    passwordError,
    isLoading,

    // Handlers
    handleFieldChange,
    setWantChangePassword,
    setCurrentPassword,
    
    // Ações
    closeAlert, // <-- Adicionado
    attemptSave,
    attemptReset,
    handleConfirmAction,
    handleCancelAction,
    goToHome,
  };
}