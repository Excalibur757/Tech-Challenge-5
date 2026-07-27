type BotaoProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  title?: string;
};

export default function Botao({
  children,
  onClick,
  type = "button",
  className = "",
  title,
}: BotaoProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      title={title}
      className={`inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-white shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-slate-700 ${className}`.trim()}
    >
      {children}
    </button>
  );
}
