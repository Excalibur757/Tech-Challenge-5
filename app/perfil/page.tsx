"use client";

import { useEffect, useState } from "react";
import Header from "@/components/header";
import ProfileHeader from "./components/ProfileHeader";
import SavedMessage from "./components/SavedMessage";
import ProfileForm from "./components/ProfileForm";
import ActionButtons from "./components/ActionButtons";
import StatusBar from "./components/StatusBar";

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
  const [wantChangePassword, setWantChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
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

  function handleSave() {
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
    setShowSavedMessage(true);

    window.setTimeout(() => {
      setShowSavedMessage(false);
    }, 2200);
  }

  function handleReset() {
    setProfileData({ ...initialValues, password: "" });
    setCurrentPassword("");
    setWantChangePassword(false);
    setPasswordError("");
    setIsSaved(true);
    setShowSavedMessage(false);
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
          minHeight: 'calc(100vh - 4rem)',
        }}
      >
        <ProfileHeader isSaved={isSaved} isEdited={!isSaved} />
        <SavedMessage visible={showSavedMessage} />
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
        <ActionButtons onSave={handleSave} onReset={handleReset} />
        <StatusBar isSaved={isSaved} isEdited={!isSaved} />
      </div>
    </main>
  );
}
