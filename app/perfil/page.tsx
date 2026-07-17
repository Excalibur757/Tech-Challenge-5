"use client";

import { useEffect, useState } from "react";
import Header from "@/components/header";
import ProfileHeader from "./components/ProfileHeader";
import ProfileForm from "./components/ProfileForm";
import ActionButtons from "./components/ActionButtons";
import StatusBar from "./components/StatusBar";
import Botao from "@/utils/botao";
import Alarme from "@/utils/alarme";
import Modal from "@/utils/modal";

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

export default function PerfilPage() {
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
  }, []);

  function handleFieldChange(field: keyof ProfileData, value: string) {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    setIsSaved(false);
    setShowSavedMessage(false);
  }

  function performSave() {
    const hasProfileChanges =
      profileData.name !== initialValues.name ||
      profileData.age !== initialValues.age ||
      profileData.email !== initialValues.email ||
      profileData.phone !== initialValues.phone;

    if (!hasProfileChanges && !wantChangePassword) {
      setSaveMessageType("warning");
      setSaveMessageText("Não há alterações para serem salvas");
      setShowSavedMessage(true);
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
    setSaveMessageType("success");
    setSaveMessageText("Perfil atualizado com sucesso!");
    setShowSavedMessage(true);

    window.setTimeout(() => {
      setShowSavedMessage(false);
    }, 2200);
  }

  function attemptSave() {
    setPendingAction("save");
    setShowConfirmModal(true);
  }

  function performReset() {
    const hasResettableChanges =
      !isSaved ||
      wantChangePassword ||
      currentPassword.trim().length > 0 ||
      profileData.password.trim().length > 0;

    if (!hasResettableChanges) {
      setSaveMessageType("warning");
      setSaveMessageText("Não há alterações para serem restauradas");
      setShowSavedMessage(true);

      window.setTimeout(() => {
        setShowSavedMessage(false);
      }, 2200);
      return;
    }

    setProfileData({ ...initialValues, password: "" });
    setCurrentPassword("");
    setWantChangePassword(false);
    setPasswordError("");
    setIsSaved(true);
    setSaveMessageType("success");
    setSaveMessageText("Alterações restauradas com sucesso!");
    setShowSavedMessage(true);

    window.setTimeout(() => {
      setShowSavedMessage(false);
    }, 2200);
  }

  function attemptReset() {
    setPendingAction("reset");
    setShowConfirmModal(true);
  }

  function handleConfirmAction() {
    setShowConfirmModal(false);
    if (pendingAction === "save") {
      performSave();
    } else if (pendingAction === "reset") {
      performReset();
    }
    setPendingAction(null);
  }

  function handleCancelAction() {
    setShowConfirmModal(false);
    setPendingAction(null);
  }

  return (
    <main >
      <Header />

      <div
        className="mx-auto max-w-4xl space-y-8 p-6"
        style={{
          backgroundImage: 'url(/capa-home.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          minHeight: 'calc(100vh - 4rem)',
        }}
      >
        <div className="flex justify-start">
          <Botao
            onClick={() => window.location.href = "/"}
            title="Apertando este botão, você voltará para a home"
          >
            <span className="text-lg">←</span>
            <span>Voltar</span>
          </Botao>
        </div>

        <ProfileHeader isSaved={isSaved} isEdited={!isSaved} />
        <Alarme
          visible={showSavedMessage}
          message={saveMessageText}
          type={saveMessageType}
          onClose={() => setShowSavedMessage(false)}
        />
        <ProfileForm
          profileData={profileData}
          onFieldChange={handleFieldChange}
          wantChangePassword={wantChangePassword}
          onWantChangePasswordChange={setWantChangePassword}
          currentPassword={currentPassword}
          onCurrentPasswordChange={setCurrentPassword}
          passwordError={passwordError}
          savedPassword={savedPassword}
        />
        <ActionButtons onSave={attemptSave} onReset={attemptReset} />
        <StatusBar isSaved={isSaved} isEdited={!isSaved} />
        <Modal
          visible={showConfirmModal}
          title={pendingAction === "save" ? "Confirmar salvamento" : "Confirmar restauração"}
          description={
            pendingAction === "save"
              ? "Tem certeza de que deseja salvar as alterações no seu perfil?"
              : "Tem certeza de que deseja restaurar os valores e cancelar as alterações?"
          }
          confirmLabel={pendingAction === "save" ? "Sim, salvar" : "Sim, restaurar"}
          cancelLabel="Cancelar"
          onConfirm={handleConfirmAction}
          onCancel={handleCancelAction}
        />
      </div>
    </main>
  );
}
