import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Viewer from './components/Viewer'
import Editor from './components/Editor'
import ModelLibrary from './components/ModelLibrary'
import MapViewer from './components/MapViewer'
import EmergencyViewer from './components/EmergencyViewer'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <span className="text-xl font-bold text-gray-800">3D Visualization Platform</span>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/"
                    className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
                  >
                    Home
                  </Link>
                  <Link
                    to="/emergency"
                    className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
                  >
                    Emergency System
                  </Link>
                  <Link
                    to="/viewer"
                    className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
                  >
                    Viewer
                  </Link>
                  <Link
                    to="/editor"
                    className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
                  >
                    Editor
                  </Link>
                  <Link
                    to="/library"
                    className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
                  >
                    Library
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="">
          <Routes>
            <Route path="/" element={<MapViewer />} />
            <Route path="/viewer" element={<Viewer />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/library" element={<ModelLibrary />} />
            <Route path="/emergency" element={<EmergencyViewer />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App