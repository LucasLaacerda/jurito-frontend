"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function JuritoViagemForm() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    relato: "",
    nome: "",
    cpf: "",
    email: "",
    cia: "",
    voo: "",
    origem: "",
    destino: "",
    data_voo: "",
    oferecido: [],
    valor: "",
    cidade_estado: ""
  })

  const [loading, setLoading] = useState(false)
  const [peticao, setPeticao] = useState("")

  function updateField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleCheckbox(value) {
    setForm(prev => ({
      ...prev,
      oferecido: prev.oferecido.includes(value)
        ? prev.oferecido.filter(v => v !== value)
        : [...prev.oferecido, value]
    }))
  }

  const steps = [
    <div key="1" className="flex flex-col gap-4">
      <label className="text-md">Conte o que aconteceu com seu voo:</label>
      <textarea
        value={form.relato}
        onChange={(e) => updateField("relato", e.target.value)}
        className="w-full p-3 rounded-lg border border-gray-300"
        rows={5}
        placeholder="Ex: Meu voo atrasou 6 horas e perdi minha conexão..."
      />
    </div>,
    <div key="2" className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input placeholder="Nome completo" value={form.nome} onChange={(e) => updateField("nome", e.target.value)} className="input" />
      <input placeholder="CPF" value={form.cpf} onChange={(e) => updateField("cpf", e.target.value)} className="input" />
      <input placeholder="E-mail" value={form.email} onChange={(e) => updateField("email", e.target.value)} className="input" />
      <input placeholder="Companhia aérea" value={form.cia} onChange={(e) => updateField("cia", e.target.value)} className="input" />
      <input placeholder="Número do voo" value={form.voo} onChange={(e) => updateField("voo", e.target.value)} className="input" />
      <input placeholder="Aeroporto de origem" value={form.origem} onChange={(e) => updateField("origem", e.target.value)} className="input" />
      <input placeholder="Aeroporto de destino" value={form.destino} onChange={(e) => updateField("destino", e.target.value)} className="input" />
      <input type="datetime-local" value={form.data_voo} onChange={(e) => updateField("data_voo", e.target.value)} className="input" />
      <input placeholder="Cidade e estado onde abrirá o processo" value={form.cidade_estado} onChange={(e) => updateField("cidade_estado", e.target.value)} className="input col-span-2" />
    </div>,
    <div key="3" className="flex flex-col gap-3">
      <label className="text-md font-medium">O que a companhia ofereceu?</label>
      <div className="flex flex-wrap gap-3">
        {["Hotel", "Alimentação", "Novo voo", "Nada"].map((item) => (
          <label key={item} className="flex items-center gap-2">
            <input type="checkbox" checked={form.oferecido.includes(item)} onChange={() => handleCheckbox(item)} />
            {item}
          </label>
        ))}
      </div>
      <input placeholder="Quanto você gostaria de receber? (opcional)" value={form.valor} onChange={(e) => updateField("valor", e.target.value)} className="input mt-4" />
    </div>
  ]

  function handleNext() {
    if (step < steps.length - 1) setStep(step + 1)
  }

  function handleBack() {
    if (step > 0) setStep(step - 1)
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      const response = await fetch("https://web-production-5b8e.up.railway.app/gerar-peticao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
      const data = await response.json()
      setPeticao(data.peticao || "Erro ao gerar petição.")
    } catch (error) {
      setPeticao("Erro ao conectar com o servidor.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gradient-to-b from-[#f0f4ff] to-[#dbeafe]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">✈️ Jurito Viagens</h2>

        {!peticao ? (
          <>
            {steps[step]}
            <div className="flex justify-between mt-6">
              {step > 0 && <button onClick={handleBack} className="text-sm px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300">Voltar</button>}
              {step < steps.length - 1 ? (
                <button onClick={handleNext} className="ml-auto px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">Próximo</button>
              ) : (
                <button onClick={handleSubmit} disabled={loading} className="ml-auto px-6 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700">
                  {loading ? "Gerando..." : "Gerar documento"}
                </button>
              )}
            </div>
          </>
        ) : (
          <div>
            <h3 className="text-lg font-medium mb-4">📄 Petição gerada:</h3>
            <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-4 rounded-md border max-h-[60vh] overflow-auto">{peticao}</pre>
          </div>
        )}
      </motion.div>
    </main>
  )
}
