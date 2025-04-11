import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Html } from '@react-three/drei'
import { Suspense, useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import DataChart from './DataChart'
import 'leaflet/dist/leaflet.css'
import { useLocation } from 'react-router-dom'
import React from 'react'

function Model({ url, onAnnotationClick }) {
  const { scene } = useGLTF(url)
  const [hoveredPart, setHoveredPart] = useState(null)

  const handlePointerOver = (event) => {
    event.stopPropagation()
    setHoveredPart(event.object)
  }

  const handlePointerOut = () => {
    setHoveredPart(null)
  }

  const handleClick = (event) => {
    event.stopPropagation()
    if (onAnnotationClick) {
      onAnnotationClick(event.object)
    }
  }

  scene.traverse((object) => {
    if (object.isMesh) {
      object.onClick = handleClick
      object.onPointerOver = handlePointerOver
      object.onPointerOut = handlePointerOut
    }
  })

  return (
    <>
      <primitive object={scene} />
      {hoveredPart && (
        <Html position={[0, 0, 0]}>
          <div className="annotation">
            <h3>{hoveredPart.name}</h3>
            <p>Temperature: 25°C</p>
          </div>
        </Html>
      )}
    </>
  )
}

export default function Viewer() {
  const location = useLocation()
  const selectedModel = location.state?.selectedModel
  const [selectedView, setSelectedView] = useState('3d')
  const [sensorData, setSensorData] = useState([])

  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData((prev) =>
        [...prev, {
          timestamp: new Date().toISOString(),
          temperature: Math.random() * 30 + 10,
          humidity: Math.random() * 50 + 30
        }].slice(-10)
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-3 gap-4 h-[calc(100vh-100px)]">
      <div className="col-span-2 bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="h-full">
          <div className="flex gap-2 p-2 bg-gray-100">
            <button
              className={`px-4 py-2 rounded ${selectedView === '3d' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setSelectedView('3d')}
            >
              3D View
            </button>
            <button
              className={`px-4 py-2 rounded ${selectedView === 'map' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setSelectedView('map')}
            >
              Map View
            </button>
          </div>

          {selectedView === '3d' ? (
            <Canvas camera={{ position: [0, 0, 5] }}>
              <Suspense fallback={<Html><p>Loading 3D Model...</p></Html>}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                {selectedModel ? (
                  <Model url={selectedModel.file || `/${selectedModel.name}`} />
                ) : (
                  <Html><p>No model selected</p></Html>
                )}
                <OrbitControls />
              </Suspense>
            </Canvas>
          ) : (
            <MapContainer center={[51.505, -0.09]} zoom={13} className="h-full">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[51.505, -0.09]}>
                <Popup>
                  Sensor Location <br />
                  Temperature: 25°C
                </Popup>
              </Marker>
            </MapContainer>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Sensor Data</h2>
        <DataChart data={sensorData} />
      </div>
    </div>
  )
}
