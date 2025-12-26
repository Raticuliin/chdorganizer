import React from 'react'
// 2. IMPORTAMOS EL STORE (Tu "Cerebro")
import { useFileStore } from './ui/store/useFileStore'

function App(): React.JSX.Element {
  // ---------------------------------------------------------
  // 3. CONEXIÓN AL STORE
  // "Abrimos la mochila" y sacamos lo que necesitamos:
  // - rootName, games, status: Para PINTAR (Leer)
  // - setFolderContent: Para ACTUALIZAR (Escribir)
  // ---------------------------------------------------------
  const { rootName, games, status, scanFolder } = useFileStore()

  // Esta función maneja el click del botón
  const handleOpenFolder = async (): Promise<void> => {
    await scanFolder()
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* --- HEADER --- */}
        <header className="flex justify-between items-center border-b border-slate-700 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-400">chdorganizer</h1>
            <p className="text-slate-500 text-sm">Organizador de ROMs Multidisco</p>
          </div>

          <button
            onClick={handleOpenFolder}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-all active:scale-95"
          >
            {/* Cambiamos el texto según el estado */}
            {status === 'idle' ? '📂 Abrir Carpeta' : '📂 Cambiar Carpeta'}
          </button>
        </header>

        {/* --- MAIN CONTENT --- */}
        <main>
          {/* CASO 1: ESTADO 'IDLE' (Esperando) */}
          {status === 'idle' && (
            <div className="text-center py-20 border-2 border-dashed border-slate-700 rounded-xl bg-slate-800/30">
              <p className="text-xl text-slate-400">
                Selecciona una carpeta con archivos .chd para empezar
              </p>
            </div>
          )}

          {/* CASO 2: ESTADO 'LOADING' (Cargando) */}
          {status === 'loading' && (
            <div className="text-center py-20">
              <p className="text-xl text-blue-400 animate-pulse">Analizando archivos...</p>
            </div>
          )}

          {/* CASO 3: ESTADO 'READY' (Tenemos datos) */}
          {status === 'ready' && (
            <div className="space-y-4">
              {/* Barra de info */}
              <div className="flex justify-between items-end px-2">
                <h2 className="text-lg text-slate-400">
                  Carpeta: <span className="text-white font-mono">{rootName}</span>
                </h2>
                <span className="bg-green-900 text-green-300 px-3 py-1 rounded-full text-sm font-bold border border-green-700">
                  {games.length} Juegos Detectados
                </span>
              </div>

              {/* Lista de Tarjetas */}
              <div className="grid gap-3">
                {games.map((game, idx) => (
                  <div key={idx} className="bg-slate-800 p-4 rounded-lg ...">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-white">💿 {game.gameName}</h3>

                      {/* BOTÓN DE PRUEBA */}
                      <button
                        onClick={() => useFileStore.getState().organizeTest(game)}
                        className="text-xs bg-blue-600 px-2 py-1 rounded hover:bg-blue-500 transition-colors"
                      >
                        Test Mover
                      </button>
                    </div>
                    {/* ... resto de tu tarjeta de juego */}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
