import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils' // Utilidad opcional pero recomendada en electron-vite

import { registerIpcHandlers } from './ipcHandlers'

function createWindow(): void {
  // 1. Configuración de la Ventana
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false, // No mostrar hasta que esté lista para evitar "pantallazo blanco"
    autoHideMenuBar: true,
    webPreferences: {
      // 2. Conexión con el Preload (CRÍTICO)
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // Mostrar la ventana cuando esté lista
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // 3. Cargar el contenido (React)
  // Si estamos en modo desarrollo, cargamos la URL local (HMR)
  // Si es producción, cargamos el archivo html compilado
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// 4. Ciclo de Vida de la App
app.whenReady().then(() => {
  registerIpcHandlers()

  createWindow()

  app.on('activate', function () {
    // En macOS, volver a crear ventana si se hace click en el dock
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  // En Windows/Linux, cerrar la app al cerrar todas las ventanas
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
