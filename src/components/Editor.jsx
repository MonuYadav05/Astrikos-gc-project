import { useState, useCallback, useRef } from 'react'
import { Canvas, useLoader, useFrame, extend } from '@react-three/fiber'
import { OrbitControls, Html, useGLTF } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import { v4 as uuidv4 } from 'uuid'

function Annotation({ position, text, onDelete }) {
  return (
    <Html position={position} center>
      <div className="bg-black bg-opacity-75 text-white p-2 rounded">
        <p>{text}</p>
        <button
          className="mt-2 bg-red-500 text-white px-2 py-1 rounded text-sm"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </Html>
  )
}

function Model({ url }) {
  const gltf = useLoader(GLTFLoader, url)
  return <primitive object={gltf.scene} />
}

function Editor() {
  const [annotations, setAnnotations] = useState([])
  const [selectedModel, setSelectedModel] = useState(null)
  const [isAddingAnnotation, setIsAddingAnnotation] = useState(false)
  const [annotationText, setAnnotationText] = useState('')
  const [modelUrl, setModelUrl] = useState(null)

  const handleAddAnnotation = useCallback(
    (e) => {
      if (!isAddingAnnotation) return
      const point = e.point
      const newAnnotation = {
        id: uuidv4(),
        position: [point.x, point.y, point.z],
        text: annotationText || 'New Annotation'
      }
      setAnnotations((prev) => [...prev, newAnnotation])
      setIsAddingAnnotation(false)
      setAnnotationText('')
    },
    [isAddingAnnotation, annotationText]
  )

  const handleDeleteAnnotation = (id) => {
    setAnnotations((prev) => prev.filter((ann) => ann.id !== id))
  }

  const handleModelUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setModelUrl(url)
    }
  }

  return (
    <div className="grid grid-cols-4 gap-4 h-[calc(100vh-100px)]">
      <div className="col-span-3 bg-white rounded-lg shadow-lg overflow-hidden">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} />
          <mesh onClick={handleAddAnnotation}>
            <planeGeometry args={[100, 100]} />
            <meshBasicMaterial visible={false} />
          </mesh>

          {modelUrl && <Model url={modelUrl} />}

          {annotations.map((annotation) => (
            <Annotation
              key={annotation.id}
              position={annotation.position}
              text={annotation.text}
              onDelete={() => handleDeleteAnnotation(annotation.id)}
            />
          ))}
          <OrbitControls />
        </Canvas>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Editor Tools</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Model
            </label>
            <input
              type="file"
              accept=".glb,.gltf"
              onChange={handleModelUpload}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          <div>
            <button
              className={`w-full px-4 py-2 rounded ${isAddingAnnotation ? 'bg-green-500' : 'bg-blue-500'
                } text-black`}
              onClick={() => setIsAddingAnnotation(!isAddingAnnotation)}
            >
              {isAddingAnnotation ? 'Cancel Annotation' : 'Add Annotation'}
            </button>
          </div>

          {isAddingAnnotation && (
            <div>
              <input
                type="text"
                value={annotationText}
                onChange={(e) => setAnnotationText(e.target.value)}
                placeholder="Annotation text"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          )}

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Annotations</h3>
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {annotations.map((ann) => (
                <li
                  key={ann.id}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-black truncate">{ann.text}</span>
                  <button
                    onClick={() => handleDeleteAnnotation(ann.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Editor
