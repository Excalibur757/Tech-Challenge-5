// app/perfil/page.tsx
"use client";

import Header from "@/components/header";
import { useProfile } from "./hooks/useProfile";
import { useAccessibilitySettings } from "@/hooks/useAccessibilitySettings";
import ProfileHeader from "./components/ProfileHeader";
import ProfileForm from "./components/ProfileForm";
import ActionButtons from "./components/ActionButtons";
import StatusBar from "./components/StatusBar";
import Botao from "@/utils/botao";
import Alarme from "@/utils/alarme";
import Modal from "@/utils/modal";
import LoadingScreen from "@/components/LoadingScreen";

export default function PerfilPage() {
  const { isLoading: isLoadingAccessibility } = useAccessibilitySettings();
  
  const {
    profileData,
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
    isLoading: isLoadingProfile,
    handleFieldChange,
    setWantChangePassword,
    setCurrentPassword,
    closeAlert, // <-- Adicionado
    attemptSave,
    attemptReset,
    handleConfirmAction,
    handleCancelAction,
    goToHome,
  } = useProfile();

  if (isLoadingAccessibility || isLoadingProfile) {
    return <LoadingScreen />;
  }

  return (
    <main>
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
            onClick={goToHome}
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
          onClose={closeAlert} // <-- Usando a função do hook
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