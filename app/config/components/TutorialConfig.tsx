import { TutorialResetButton } from "./TutorialResetButton";

export function TutorialConfig() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white border-b dark:border-gray-700 pb-2 mb-4">
            🎓 Tutorial
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Se você quiser ver o tutorial novamente, clique no botão abaixo.
        </p>
        <TutorialResetButton />
    </div>
  )
}