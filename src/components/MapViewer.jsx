import { useEffect, useRef } from "react";
import { Viewer, Entity } from "resium";
import { Cartesian3, Ion } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

// Initialize Cesium access token
Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZmVlZmU2MS00ODU3LTQ0YTYtYTVmMS0yYzViMzYxYTBlMmYiLCJpZCI6MjkyMTA0LCJpYXQiOjE3NDQxMjk3ODl9.eSbwfGiwUDWfl8hrmEVIAQt_GPu-qKflFfn93MWVEKY";
window.CESIUM_BASE_URL = "/cesium";
export default function MapViewer() {
    const viewerRef = useRef();

    useEffect(() => {
        window.CESIUM_BASE_URL = '/';
    }, []);


    useEffect(() => {
        if (viewerRef.current && viewerRef.current.cesiumElement) {
            const viewer = viewerRef.current.cesiumElement;

            viewer.selectedEntityChanged.addEventListener((entity) => {
                if (entity) {
                    console.log("Clicked entity:", entity.name);
                }
            });
            viewer.selectedEntityChanged.addEventListener((entity) => {
                if (entity) {
                    viewerRef.flyTo(entity, {
                        duration: 2, // seconds
                    });
                }
            });
        }

    }, []);

    const units = [
        {
            id: 1,
            type: "fire",
            position: Cartesian3.fromDegrees(77.894569, 29.864611, 0),
            description: "Fire Truck Unit 1",
            modelUrl: '/ambulance_car.glb'
        },

        {
            id: 2,
            type: "police",
            position: Cartesian3.fromDegrees(77.894569, 29.864611, 0),
            description: "Police Unit 2",
            modelUrl: '/ambulance_car.glb'
        }
    ];

    return (
        <div className="w-full h-full relative">
            <Viewer full
            >
                {units.map((unit) => (
                    <Entity
                        key={unit.id}
                        position={unit.position}
                        name={unit.type}
                        model={{
                            uri: unit.modelUrl,
                            minimumPixelSize: 64, // scales model when zoomed out
                            maximumScale: 200, // to avoid it becoming too huge
                        }}
                        description={unit.description}
                        label={{
                            text: unit.name,
                            font: "14pt sans-serif",
                            fillColor: 'white',
                            style: 'FILL',
                            outlineWidth: 2,
                            verticalOrigin: "BOTTOM",
                            pixelOffset: [0, -10],
                        }}
                    />
                ))}
            </Viewer>
        </div>
    );
}