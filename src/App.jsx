import React, { useState } from 'react';
import { Layers, Box, BarChart3, Upload, Eye } from 'lucide-react';
import MapViewer from './components/MapViewer';
import ModelViewer from './components/ModelViewer';
import Dashboard from './components/Dashboard';

function App() {
  const [activeTab, setActiveTab] = useState('map');

  const tabs = [
    { id: 'map', icon: Layers, label: 'Map Viewer' },
    { id: '3d', icon: Box, label: '3D Viewer' },
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'creator', icon: Upload, label: 'Creator Mode' },
    { id: 'viewer', icon: Eye, label: 'Viewer Mode' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl   sm:px-6 lg:px-8">
        <div className="h-[calc(100vh-8rem)]">
          {activeTab === 'map' && <MapViewer />}
          {activeTab === '3d' && (
            <ModelViewer modelUrl="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF/BoxAnimated.gltf" />
          )}
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'creator' && (
            <div className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Creator Mode</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Drag and drop your 3D models here, or click to select files
                </p>
              </div>
            </div>
          )}
          {activeTab === 'viewer' && (
            <div className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Viewer Mode</h2>
              <p>Select a saved scene to view</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;





// import { OrbitControls } from "@react-three/drei"
// import { Canvas } from "@react-three/fiber"
// import { City } from "./components/City";
// import { Vehicle } from "./components/Vehicle";

// function Box() {
//   return (
//     <mesh>
//       <boxGeometry args={[1, 1, 1]} />
//       <meshStandardMaterial color="hotpink" />
//     </mesh>
//   )
// }
// function App() {

//   return (
//     <Canvas camera={{ position: [1, 10, 20], fov: 50 }} className="w-screen h-screen">
//       <ambientLight intensity={0.5} />
//       <directionalLight position={[5, 10, 5]} />
//       <City />
//       <Vehicle />
//       <OrbitControls />
//     </Canvas>
//   )
// }

// export default App
