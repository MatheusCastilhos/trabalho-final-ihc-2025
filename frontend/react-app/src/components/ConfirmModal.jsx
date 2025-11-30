export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-fadeIn">
        {/* Ícone de Alerta */}
        <div className="mb-4">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto text-2xl">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6 text-base leading-relaxed">
          {message}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full py-3.5 rounded-xl bg-red-600 text-white font-bold text-lg shadow-md active:scale-[0.98] transition-transform"
          >
            Sim, excluir
          </button>

          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl bg-gray-100 text-gray-700 font-semibold text-lg border border-gray-200 active:scale-[0.98] transition-transform"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
