import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmModal from "../components/ConfirmModal";
import { fetchReminders, deleteReminder } from "../api/lembretes";

function Lembretes() {
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(null);

  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados para o Modal de Confirmação
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    loadReminders();
  }, []);

  async function loadReminders() {
    try {
      setLoading(true);
      setError("");
      const data = await fetchReminders();
      setReminders(data || []);
    } catch (err) {
      setError(err.message || "Erro ao carregar lembretes.");
    } finally {
      setLoading(false);
    }
  }

  const handleAddReminder = () => {
    navigate("/lembretes/novo");
  };

  const handleEditReminder = (id) => {
    navigate(`/lembretes/${id}`);
  };

  // Abre o modal em vez de usar window.confirm
  const confirmDelete = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleDeleteReminder = async () => {
    if (!selectedId) return;
    setIsModalOpen(false); // fecha modal visualmente rápido

    try {
      await deleteReminder(selectedId);
      setReminders((prev) => prev.filter((r) => r.id !== selectedId));
    } catch (err) {
      alert(err.message || "Erro ao excluir lembrete.");
    } finally {
      setSelectedId(null);
    }
  };

  const changeDay = (delta) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + delta);
      return newDate;
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    return dateString.slice(11, 16);
  };

  const isSameDay = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const getIconClass = (tipo) => {
    switch (tipo) {
      case "medicamento":
        return "fas fa-pills";
      case "refeicao":
        return "fas fa-utensils";
      case "consulta":
        return "fas fa-user-md";
      default:
        return "fas fa-bell";
    }
  };

  const remindersOfDay = reminders.filter((reminder) => {
    if (!reminder.data_hora) return false;
    const d = new Date(reminder.data_hora);
    return isSameDay(d, currentDate);
  });

  const today = new Date();
  const isToday = currentDate.toDateString() === today.toDateString();
  const dateLabel = isToday
    ? `Hoje – ${formatDate(currentDate)}`
    : formatDate(currentDate);

  const openDatePicker = () => {
    setTempDate(formatDateForInput(currentDate));
    setShowDatePicker(true);
  };

  const confirmDatePicker = () => {
    if (tempDate) {
      const [year, month, day] = tempDate.split("-");
      const newDate = new Date(Number(year), Number(month) - 1, Number(day));
      setCurrentDate(newDate);
    }
    setShowDatePicker(false);
  };

  return (
    <div className="container relative">
      <Header />

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteReminder}
        title="Excluir Lembrete?"
        message="Você tem certeza que deseja apagar este lembrete? Esta ação não pode ser desfeita."
      />

      <header className="mb-4 pb-3 flex items-center border-b border-gray-200">
        <Link
          to="/dashboard"
          className="text-primary text-2xl mr-2.5 cursor-pointer"
        >
          <i className="fas fa-arrow-left"></i>
        </Link>
        <h1 className="flex-1 text-center text-2xl font-semibold text-gray-900">
          Meus Lembretes
        </h1>
        <div className="bg-white rounded-full w-10 h-10 flex justify-center items-center shadow text-primary">
          <i className="fas fa-calendar-alt"></i>
        </div>
      </header>

      <div className="flex flex-col items-center mb-4">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => changeDay(-1)}
            className="text-primary text-lg px-2"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button
            onClick={openDatePicker}
            className="text-sm font-medium text-gray-800 underline underline-offset-4"
          >
            {dateLabel}
          </button>
          <button
            onClick={() => changeDay(1)}
            className="text-primary text-lg px-2"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        {showDatePicker && (
          <div className="mt-2 w-full flex justify-center z-10">
            <div className="bg-white rounded-xl p-3 shadow-lg border border-gray-200 w-[90%]">
              <input
                type="date"
                value={tempDate || formatDateForInput(currentDate)}
                onChange={(e) => setTempDate(e.target.value)}
                className="w-full px-2 py-2 mb-2 rounded border border-gray-300"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="px-3 py-1 text-sm bg-gray-100 rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDatePicker}
                  className="px-3 py-1 text-sm bg-primary text-white rounded"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3 mb-8 flex-1 overflow-y-auto">
        {loading && <LoadingSpinner />}

        {error && !loading && (
          <p className="text-center text-red-600">{error}</p>
        )}

        {!loading && !error && remindersOfDay.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">Nenhum lembrete para este dia.</p>
          </div>
        )}

        {!loading &&
          !error &&
          remindersOfDay.map((reminder) => (
            <div
              key={reminder.id}
              className="bg-white rounded-3xl p-4 flex items-center shadow-md relative"
            >
              <i
                className={`${getIconClass(
                  reminder.tipo
                )} text-primary mr-4 text-xl`}
              ></i>
              <div className="flex-1 pr-14">
                <p className="text-gray-800 leading-snug">
                  <span className="font-bold text-primary mr-1">
                    {formatTime(reminder.data_hora)}
                  </span>
                  {reminder.titulo}
                </p>
              </div>

              <div className="absolute right-4 flex gap-3">
                <button
                  onClick={() => handleEditReminder(reminder.id)}
                  className="text-gray-400 hover:text-primary p-1"
                >
                  <i className="fas fa-pen"></i>
                </button>
                <button
                  onClick={() => confirmDelete(reminder.id)}
                  className="text-gray-400 hover:text-red-600 p-1"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
      </div>

      <button
        onClick={handleAddReminder}
        className="bg-[#3A5FCD] text-white rounded-lg py-3.5 w-full text-lg font-semibold shadow-md mb-2 active:scale-[0.98] transition-transform"
      >
        Adicionar Lembrete
      </button>
    </div>
  );
}

export default Lembretes;
