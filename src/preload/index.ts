import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('electronAPI', {
      selectFolder: () => ipcRenderer.invoke('dialog:openDirectory'),
      createDirectory: (parentPath: string, name: string) =>
        ipcRenderer.invoke('fs:createDirectory', parentPath, name),
      moveFile: (filePath: string, destPath: string) =>
        ipcRenderer.invoke('fs:moveFile', filePath, destPath),
      writeFile: (fileName: string, content: string, subFolderName?: string) =>
        ipcRenderer.invoke('fs:writeFile', fileName, content, subFolderName)
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
