import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";

function Lembretes() {
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(null);

  const handleAddReminder = () => {
    navigate("/lembretes/novo");
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

  const cancelDatePicker = () => {
    setShowDatePicker(false);
  };

  const backToToday = () => {
    setCurrentDate(new Date());
    setShowDatePicker(false);
  };

  return (
    <div className="container">
      {/* Header geral (usuário + sair) */}
      <Header username="Usuário" />

      {/* Cabeçalho da página de lembretes */}
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

      {/* Seletor de data */}
      <div className="flex flex-col items-center mb-4">
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => changeDay(-1)}
            className="text-primary text-lg"
            aria-label="Dia anterior"
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          <button
            type="button"
            onClick={openDatePicker}
            className="text-sm font-medium text-gray-800 underline-offset-2"
            style={{ textDecoration: "underline" }}
          >
            {dateLabel}
          </button>

          <button
            type="button"
            onClick={() => changeDay(1)}
            className="text-primary text-lg"
            aria-label="Próximo dia"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        {/* Painel de seleção de data inline */}
        {showDatePicker && (
          <div className="mt-2 w-full flex justify-center">
            <div className="bg-white rounded-xl p-3 shadow-md border border-gray-200 w-[85%]">
              <p className="text-xs font-medium text-gray-700 mb-2 text-center">
                Selecionar data
              </p>

              <input
                type="date"
                value={tempDate || formatDateForInput(currentDate)}
                onChange={(e) => setTempDate(e.target.value)}
                className="w-full px-2 py-1.5 mb-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#3A5FCD]"
              />

              <button
                type="button"
                onClick={backToToday}
                className="w-full py-2 mb-2 rounded-lg bg-[#e9edff] text-[#3A5FCD] text-xs font-medium border border-[#3A5FCD]/30"
              >
                Voltar para Hoje
              </button>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={cancelDatePicker}
                  className="px-3 py-1 text-xs rounded-lg border border-gray-300 text-gray-700 bg-white"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={confirmDatePicker}
                  className="px-3 py-1 text-xs rounded-lg bg-[#3A5FCD] text-white"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lista de lembretes (mock) */}
      <div className="space-y-3 mb-8">
        <div className="bg-white rounded-3xl p-4 flex items-center shadow-md">
          <i className="fas fa-pills text-primary mr-4 text-xl"></i>
          <p>
            <span className="font-medium">08:00</span> – Tomar medicamento da
            pressão
          </p>
        </div>

        <div className="bg-white rounded-3xl p-4 flex items-center shadow-md">
          <i className="fas fa-utensils text-primary mr-4 text-xl"></i>
          <p>
            <span className="font-medium">12:00</span> – Almoço
          </p>
        </div>

        <div className="bg-white rounded-3xl p-4 flex items-center shadow-md relative">
          <i className="fas fa-pills text-primary mr-4 text-xl"></i>
          <p>
            <span className="font-medium">14:30</span> – Tomar medicamento para
            diabetes
          </p>

          <button className="absolute right-4 bg-primary text-white text-xs px-3 py-1 rounded-lg">
            AGORA
          </button>
        </div>

        <div className="bg-white rounded-3xl p-4 flex items-center shadow-md">
          <i className="fas fa-utensils text-primary mr-4 text-xl"></i>
          <p>
            <span className="font-medium">18:00</span> – Jantar
          </p>
        </div>

        <div className="bg-white rounded-3xl p-4 flex items-center shadow-md">
          <i className="fas fa-user-md text-primary mr-4 text-xl"></i>
          <p>
            <span className="font-medium">15:00</span> – Consulta com Dr. Silva
          </p>
        </div>
      </div>

      {/* Botão principal */}
      <button
        onClick={handleAddReminder}
        className="bg-[#3A5FCD] text-white rounded-lg py-3 w-full text-base font-medium shadow-md mb-2"
      >
        Adicionar Lembrete
      </button>
    </div>
  );
}

export default Lembretes;