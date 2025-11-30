import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import { createContact, getContact, updateContact } from "../api/contatos";

export default function NovoContato() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    isEmergency: false,
    file: null, // foto

    // UI Only (não vai pro back)
    type: "familia",
    relation: "",
    notes: "",
  });

  const [preview, setPreview] = useState(null); // Para mostrar a foto selecionada
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (id) {
      async function loadData() {
        setLoadingData(true);
        try {
          const data = await getContact(id);
          if (data) {
            setForm((prev) => ({
              ...prev,
              name: data.nome,
              phone: data.telefone,
              isEmergency: data.is_emergencia,
            }));
            // Se já tem foto vinda do back, mostramos
            if (data.foto) {
              setPreview(data.foto);
            }
          }
        } catch (err) {
          setError("Erro ao carregar contato.");
        } finally {
          setLoadingData(false);
        }
      }
      loadData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setForm((prev) => ({ ...prev, file }));
      // Cria preview local
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleTypeChange = (newType) => {
    setForm((prev) => ({ ...prev, type: newType }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.phone.trim()) {
      setError("Nome e telefone são obrigatórios.");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("nome", form.name.trim());
      formData.append("telefone", form.phone.trim());
      formData.append("is_emergencia", form.isEmergency); // JS boolean -> FormData string "true"/"false" (DRF entende)

      if (form.file) {
        formData.append("foto", form.file);
      }

      if (id) {
        await updateContact(id, formData);
      } else {
        await createContact(formData);
      }

      navigate("/contatos");
    } catch (err) {
      setError(err.message || "Erro ao salvar contato.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) return <div className="p-4 text-center">Carregando...</div>;

  return (
    <div className="container">
      <Header />

      <header className="mb-4 pb-3 flex items-center border-b border-gray-200">
        <Link
          to="/contatos"
          className="text-primary text-2xl mr-3 cursor-pointer"
        >
          <i className="fas fa-arrow-left" />
        </Link>
        <h1 className="flex-1 text-center text-2xl font-semibold text-gray-900">
          {id ? "Editar contato" : "Novo contato"}
        </h1>
        <div className="bg-white rounded-full w-11 h-11 flex justify-center items-center shadow text-primary">
          <i className="fas fa-address-book" />
        </div>
      </header>

      {error && (
        <p className="mb-3 text-center text-sm text-red-600">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="mt-2 space-y-5">
        {/* Upload de Foto (Avatar) */}
        <div className="flex flex-col items-center mb-4">
          <label className="relative cursor-pointer group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <i className="fas fa-camera text-3xl text-gray-400 group-hover:text-primary transition-colors"></i>
              )}
            </div>
            <div className="absolute bottom-0 right-0 bg-[#3A5FCD] w-8 h-8 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm">
              <i className="fas fa-plus text-xs"></i>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          <span className="text-xs text-gray-500 mt-2">
            Toque para adicionar foto
          </span>
        </div>

        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-base"
            placeholder="Ex.: Maria"
          />
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefone
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-base"
            placeholder="(11) 99999-9999"
          />
        </div>

        {/* Contato de emergência */}
        <div className="pt-1 border-t border-gray-200">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isEmergency"
              checked={form.isEmergency}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-800">
              Marcar como contato de emergência
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-lg bg-[#3A5FCD] text-white text-lg font-semibold shadow-md mt-1 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Salvando..." : "Salvar contato"}
        </button>
      </form>
    </div>
  );
}
