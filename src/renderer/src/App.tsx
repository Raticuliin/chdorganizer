import { useState } from 'react'

import { WebFileSystemAdapter } from './core/infrastructure/WebFileSystemAdapter'
import { FileEntry } from './core/domain/types'

const fileSystem = new WebFileSystemAdapter()

function App(): React.JSX.Element {
  const [files, setFiles] = useState<FileEntry[]>([])
  const [folderName, setFolderName] = useState<string>('')

  const handleOpenFolder = async (): Promise<void> => {
    const result = await fileSystem.selectAndReadFolder()

    if (result) {
      setFolderName(result.rootName)
      setFiles(result.files)
    } else {
      console.log('User cancelled selection')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10 font-sans">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 border-b border-slate-700 pb-4">
          <h1 className="text-3xl font-bold text-blue-400 mb-2">chdorganizer</h1>
          <p className="text-slate-400">Organizador de ROMs multidisco</p>
        </header>

        <div className="space-y-6">
          {/* Botón de Acción */}
          <button
            onClick={handleOpenFolder}
            className="bg-blue-600 hover:bg-blue-500 transition-colors text-white px-6 py-3 rounded-lg font-semibold shadow-lg flex items-center gap-2"
          >
            📂 Seleccionar Carpeta
          </button>

          {/* Resultados */}
          {folderName && (
            <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
              <h2 className="text-xl font-semibold mb-4 text-slate-200">
                Contenido de: <span className="text-blue-300">{folderName}</span>
              </h2>

              <div className="max-h-125 overflow-y-auto pr-2">
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 p-2 hover:bg-slate-700/50 rounded transition-colors border-b border-slate-700/50 last:border-0"
                    >
                      <span className="text-2xl">{file.isDirectory ? '📁' : '📄'}</span>
                      <span
                        className={`truncate ${file.isDirectory ? 'text-yellow-400' : 'text-slate-300'}`}
                      >
                        {file.name}
                      </span>
                    </li>
                  ))}
                </ul>

                {files.length === 0 && (
                  <p className="text-center text-slate-500 py-4">La carpeta está vacía</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
