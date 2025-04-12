import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import { Icon } from 'leaflet'
import DataChart from './DataChart'
import React
    from 'react'
import MapViewer from './MapViewer'
const emergencyIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const resourceIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

function EmergencyViewer() {
    const [selectedView, setSelectedView] = useState('map')
    const [emergencies, setEmergencies] = useState([])
    const [resources, setResources] = useState([])
    const [responseMetrics, setResponseMetrics] = useState([])

    useEffect(() => {
        // Simulate real-time emergency data
        const mockEmergencies = [
            { id: 1, type: 'Fire', location: [51.505, -0.09], severity: 'High', timestamp: new Date() },
            { id: 2, type: 'Medical', location: [29.864097266133999, 77.896710156385822], severity: 'Medium', timestamp: new Date() },
        ]
        setEmergencies(mockEmergencies)

        // Simulate available resources
        const mockResources = [
            { id: 1, type: 'Fire Truck', location: [51.503, -0.087], status: 'Available' },
            {
                id: 2, type: 'Ambulance', location: [29.861865847761354, 77.892967097639158], status: 'En Route'
            },
        ]
        setResources(mockResources)

        // Simulate response time metrics
        const interval = setInterval(() => {
            setResponseMetrics(prev => [...prev, {
                timestamp: new Date().toISOString(),
                averageResponseTime: Math.random() * 10 + 5,
                activeEmergencies: mockEmergencies.length
            }].slice(-10))
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="grid grid-cols-3 gap-4 h-[calc(100vh-100px)]">

            <div className="col-span-2 bg-white rounded-lg shadow-lg overflow-hidden">

                <div className="h-full overflow-scroll">


                    {selectedView === '3d' ? (
                        <MapViewer />
                    ) : (
                        <MapContainer
                            center={[29.864097266133999, 77.896710156385822]}
                            zoom={40}
                            className="h-full"
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {emergencies.map((emergency) => (
                                <React.Fragment key={emergency.id}>
                                    <Marker
                                        position={emergency.location}
                                        icon={emergencyIcon}
                                    >
                                        <Popup>
                                            <strong>{emergency.type} Emergency</strong><br />
                                            Severity: {emergency.severity}<br />
                                            Time: {emergency.timestamp.toLocaleTimeString()}
                                        </Popup>
                                    </Marker>
                                    <Circle
                                        center={emergency.location}
                                        radius={50}
                                        pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.2 }}
                                    />
                                </React.Fragment>
                            ))}
                            {resources.map((resource) => (
                                <Marker
                                    key={resource.id}
                                    position={resource.location}
                                    icon={resourceIcon}
                                >
                                    <Popup>
                                        <strong>{resource.type}</strong><br />
                                        Status: {resource.status}
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4">
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
                <h2 className="text-xl font-bold mb-4">Emergency Response Metrics</h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-red-100 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-red-800">Active Emergencies</h3>
                            <p className="text-2xl font-bold text-red-600">{emergencies.length}</p>
                        </div>
                        <div className="bg-blue-100 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-blue-800">Available Resources</h3>
                            <p className="text-2xl font-bold text-blue-600">
                                {resources.filter(r => r.status === 'Available').length}
                            </p>
                        </div>
                    </div>
                    <DataChart
                        data={responseMetrics}
                    />
                </div>
            </div>
        </div>
    )
}

export default EmergencyViewer