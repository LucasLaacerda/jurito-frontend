"use client"

import { useState } from "react"
import { Loader2, Copy, RefreshCcw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Head from "next/head"

export default function JuritoApp() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState("")

  async function handleSubmit() {
    if (!file) {
      setResult("Nenhum arquivo foi selecionado.")
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("https://web-production-192c4.up.railway.app/analisar", {
        method: "POST",
        body: formData
      })
      const data = await response.json()
      setResult(data?.resumo || "Não foi possível gerar o resumo.")
    } catch (err) {
      setResult("Erro ao se comunicar com o servidor.")
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    if (result) {
      navigator.clipboard.writeText(result)
    }
  }

  function reset() {
    setResult("")
    setFile(null)
  }

  return (
    <>
      <Head>
        <title>Jurito — Análise inteligente de contratos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-[#f4f4f4] to-[#e5ecf6] flex flex-col items-center justify-start px-4 py-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-[#1F2937] mb-2"
        >
          🦅 Jurito
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-600 mb-8"
        >
          Entenda qualquer contrato com a ajuda da IA.
        </motion.p>

        <AnimatePresence>
          {!result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }} 
              className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-xl flex flex-col items-center gap-4"
            >
              <label className="text-md font-medium text-gray-700">Faça upload do seu contrato (PDF):</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files && e.target.files.length > 0 ? e.target.files[0] : null)}
                className="file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1F2937] file:text-white hover:file:bg-[#374151] cursor-pointer"
              />

              <button
                onClick={handleSubmit}
                disabled={loading || !file}
                className="mt-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-2 px-6 rounded-xl shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : null}
                {loading ? "Analisando..." : "Analisar contrato"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-10 w-full max-w-2xl bg-white p-6 rounded-2xl shadow-xl text-gray-800"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Resumo do contrato</h2>
                <div className="flex gap-3">
                  <button onClick={handleCopy} className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg flex items-center gap-1">
                    <Copy className="w-4 h-4" /> Copiar
                  </button>
                  <button onClick={reset} className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg flex items-center gap-1">
                    <RefreshCcw className="w-4 h-4" /> Novo
                  </button>
                </div>
              </div>
              <pre className="whitespace-pre-wrap text-sm leading-relaxed bg-[#f9fafb] p-4 rounded-lg border text-gray-700">
                {result}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  )
}
