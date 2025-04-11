import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function ModelLibrary() {
  const [models, setModels] = useState([
    {
      id: 1,
      name: 'Building Model',
      type: '3D',
      format: 'glb',
      thumbnail: '/models/building-thumb.jpg',
    },
    {
      id: 2,
      name: 'City Map',
      type: '2D',
      format: 'svg',
      thumbnail: '/models/city-thumb.jpg',
    },
    {
      id: 3,
      name: 'Factory Equipment',
      type: '3D',
      format: 'gltf',
      thumbnail: '/models/factory-thumb.jpg',
    },
  ])

  const navigate = useNavigate()

  const handleModelUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const format = file.name.split('.').pop().toLowerCase()
      const newModel = {
        id: Date.now(), // unique ID
        name: file.name,
        type: ['svg'].includes(format) ? '2D' : '3D',
        format: format,
        thumbnail: '/models/default-thumb.jpg',
        file: URL.createObjectURL(file), // store file preview
      }
      setModels((prev) => [...prev, newModel])
    }
  }

  const handleModelSelect = (model) => {
    navigate('/', { state: { selectedModel: model } })
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Model Library</h1>
        <div>
          <input
            type="file"
            accept=".glb,.gltf,.fbx,.svg"
            onChange={handleModelUpload}
            className="hidden"
            id="model-upload"
          />
          <label
            htmlFor="model-upload"
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
          >
            Upload Model
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <div
            key={model.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition hover:scale-105"
            onClick={() => handleModelSelect(model)}
          >
            <img
              src={model.thumbnail}
              alt={model.name}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.src = '/models/default-thumb.jpg'
              }}
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{model.name}</h3>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Type: {model.type}</span>
                <span>Format: {model.format}</span>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                  onClick={(e) => {
                    e.stopPropagation()
                    alert('Preview not implemented yet')
                  }}
                >
                  Preview
                </button>
                <button
                  className="px-3 py-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleModelSelect(model)
                  }}
                >
                  Use
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ModelLibrary
