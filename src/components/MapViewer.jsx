import { useEffect } from "react";
import { Viewer, Entity } from "resium";
import { Cartesian3, Ion } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

// Initialize Cesium access token
Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZmVlZmU2MS00ODU3LTQ0YTYtYTVmMS0yYzViMzYxYTBlMmYiLCJpZCI6MjkyMTA0LCJpYXQiOjE3NDQxMjk3ODl9.eSbwfGiwUDWfl8hrmEVIAQt_GPu-qKflFfn93MWVEKY";
window.CESIUM_BASE_URL = "/cesium";
export default function MapViewer() {
    useEffect(() => {
        window.CESIUM_BASE_URL = '/';
    }, []);

    const units = [
        {
            id: 1,
            type: "fire",
            position: Cartesian3.fromDegrees(77.894569, 29.864611, 100),
            description: "Fire Truck Unit 1",
        },
        {
            id: 2,
            type: "police",
            position: Cartesian3.fromDegrees(77.894569, 29.864611, 100),
            description: "Police Unit 2",
        },
    ];

    return (
        <div className="w-full h-full relative">
            <Viewer full
            >
                {units.map((unit) => (
                    <Entity
                        key={unit.id}
                        position={unit.position}
                        point={{ pixelSize: 10, color: unit.type === "fire" ? "red" : "blue" }}
                        description={unit.description}
                    />
                ))}
            </Viewer>
        </div>
    );
}