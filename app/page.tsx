// app/page.tsx
"use client";

import Header from "@/components/header";
import { TaskHeader } from "@/components/tasks/TaskHeader";
import { TaskStats } from "@/components/tasks/TaskStats";
import { TaskInput } from "@/components/tasks/TaskInput";
import { TaskList } from "@/components/tasks/TaskList";
import { AccessibilityTip } from "@/components/ui/AccessibilityTip";
import { QuickActions } from "@/components/tasks/QuickActions";
import { TaskFeedback } from "@/components/tasks/TaskFeedback";
import { useTasks } from "@/hooks/useTasks";
import { useTaskFilters } from "@/hooks/useTaskFilters";
import { useTaskStats } from "@/hooks/useTaskStats";
import { useAccessibilitySettings } from "@/hooks/useAccessibilitySettings";
import { TutorialOverlay } from "@/components/tutorial/TutorialOverlay";
import { useState } from "react";

export default function Home() {
  const [showTutorial, setShowTutorial] = useState(true);

  const {
    extraConfirmation,
    isLoading,
    mode,
    toggleMode,
  } = useAccessibilitySettings();

  const {
    tasks,
    newTask,
    setNewTask,
    newTaskPriority,
    setNewTaskPriority,
    editingId,
    editText,
    setEditText,
    showSubtasks,
    setShowSubtasks,
    newSubtask,
    setNewSubtask,
    showNotes,
    setShowNotes,
    editingPriority,
    setEditingPriority,
    showAlert,
    alertMessage,
    alertType,
    closeAlert,
    showModal,
    modalAction,
    modalTaskName,
    addTask,
    deleteTask,
    toggleTask,
    startEdit,
    saveEdit,
    cancelEdit,
    changePriority,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    markAllComplete,
    clearCompleted,
    updateTaskNotes,
    confirmDelete,
    confirmEdit,
    confirmCompleteAll,
    confirmClearCompleted,
    confirmDeleteSubtask,
    closeModal,
  } = useTasks(extraConfirmation, isLoading);

  const {
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    filteredTasks,
  } = useTaskFilters(tasks);

  const stats = useTaskStats(tasks);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TutorialOverlay onComplete={handleTutorialComplete} />
      <Header />

      {/* Feedback Global (Alarme + Modal) */}
      <TaskFeedback
        showAlert={showAlert}
        alertMessage={alertMessage}
        alertType={alertType}
        closeAlert={closeAlert}
        showModal={showModal}
        modalAction={modalAction}
        modalTaskName={modalTaskName}
        closeModal={closeModal}
        confirmDelete={confirmDelete}
        confirmDeleteSubtask={confirmDeleteSubtask}
        confirmEdit={confirmEdit}
        confirmCompleteAll={confirmCompleteAll}
        confirmClearCompleted={confirmClearCompleted}
      />

      <main className="flex-1 max-w-4xl mx-auto w-full p-6 space-y-6">
        <TaskHeader
          mode={mode}
          extraConfirmation={extraConfirmation}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onToggleMode={toggleMode}
        />

        <TaskStats
          totalTasks={stats.totalTasks}
          activeTasks={stats.activeTasks}
          completedTasks={stats.completedTasks}
          completionRate={stats.completionRate}
        />

        <TaskInput
          newTask={newTask}
          onNewTaskChange={setNewTask}
          newTaskPriority={newTaskPriority}
          onPriorityChange={setNewTaskPriority}
          onAddTask={addTask}
          onKeyPress={handleKeyPress}
          mode={mode}
          filter={filter}
          sortBy={sortBy}
          onFilterChange={setFilter}
          onSortChange={setSortBy}
        />

        <TaskList
          tasks={tasks}
          filteredTasks={filteredTasks}
          searchTerm={searchTerm}
          filter={filter}
          mode={mode}
          editingId={editingId}
          editText={editText}
          onEditTextChange={setEditText}
          onSaveEdit={saveEdit}
          onCancelEdit={cancelEdit}
          onToggleTask={toggleTask}
          onStartEdit={startEdit}
          onDeleteTask={deleteTask}
          onUpdateNotes={updateTaskNotes}
          onAddSubtask={addSubtask}
          onToggleSubtask={toggleSubtask}
          onDeleteSubtask={deleteSubtask}
          showSubtasks={showSubtasks}
          setShowSubtasks={setShowSubtasks}
          showNotes={showNotes}
          setShowNotes={setShowNotes}
          newSubtask={newSubtask}
          setNewSubtask={setNewSubtask}
          editingPriority={editingPriority}
          setEditingPriority={setEditingPriority}
          onChangePriority={changePriority}
          onKeyPress={handleKeyPress}
        />

        <AccessibilityTip mode={mode} />

        {mode === "simplificado" && (
          <QuickActions
            tasksLength={tasks.length}
            onMarkAllComplete={markAllComplete}
            onClearCompleted={clearCompleted}
          />
        )}
      </main>
    </div>
  );
}