import { useEffect, useRef, useState } from "react";
import { Viewer, Entity, ModelGraphics } from "resium";
import { Cartesian3, createOsmBuildingsAsync, Ion, Math as CesiumMath, createWorldTerrainAsync, SampledPositionProperty, JulianDate, ClockRange, ClockStep, VelocityOrientationProperty, PathGraphics, TimeIntervalCollection, TimeInterval, Clock } from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import { treesLocation } from "../data/trees";
import { ambulancePath } from "../data/ambulanceData";

// Initialize Cesium access token
Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NDYzODI3Mi00OTlmLTRlNjctOTczOC0wYzA3MmI1ODgxMGIiLCJpZCI6MjkyMTA0LCJpYXQiOjE3NDQxODQwOTB9.NwrWo2AlyRVVNFb5H_OXnMkRUR5bt_HxxQJjpOQVUC4";
window.CESIUM_BASE_URL = "/";

export default function MapViewer() {
    const viewerRef = useRef(null);
    const [terrainProvider, setTerrainProvider] = useState(null);
    const [modelEntity, setModelEntity] = useState(null);
    const [clockProps, setClockProps] = useState(null);

    useEffect(() => {
        createWorldTerrainAsync().then(setTerrainProvider);
    }, []);


    useEffect(() => {
        const viewer = viewerRef.current?.cesiumElement;
        console.log(viewerRef.current);
        console.log(terrainProvider)
        if (!viewer) return;

        // Fly to San Francisco
        viewer.camera.flyTo({
            destination: Cartesian3.fromDegrees(77.894569, 29.864611, 400),
            orientation: {
                heading: CesiumMath.toRadians(20.0),
                pitch: CesiumMath.toRadians(-20.0),
            },
        });

        // Add 3D buildings
        createOsmBuildingsAsync().then((tileset) => {
            viewer.scene.primitives.add(tileset);
        });
    }, [terrainProvider]);

    useEffect(() => {
        const timeStepInSeconds = 30;
        const totalSeconds = timeStepInSeconds * (ambulancePath.length - 1);
        const start = JulianDate.now();
        const stop = JulianDate.addSeconds(start, totalSeconds, new JulianDate());

        // Set clock configuration
        const clock = new Clock();
        clock.startTime = start.clone();
        clock.stopTime = stop.clone();
        clock.currentTime = start.clone();
        clock.clockRange = ClockRange.CLAMPED;
        clock.clockStep = ClockStep.SYSTEM_CLOCK_MULTIPLIER;
        clock.multiplier = 50;
        clock.shouldAnimate = true;
        setClockProps(clock);

        // Set up position data
        const positionProperty = new SampledPositionProperty();
        for (let i = 0; i < ambulancePath.length; i++) {
            const latitude = ambulancePath[i].coordinates[1];
            const longitude = ambulancePath[i].coordinates[0];
            const height = 220;
            const time = JulianDate.addSeconds(start, i * timeStepInSeconds, new JulianDate());
            const position = Cartesian3.fromDegrees(longitude, latitude, height);
            positionProperty.addSample(time, position);
        }

        // Add model with animation path
        const airplaneEntity = {
            availability: new TimeIntervalCollection([
                new TimeInterval({ start, stop }),
            ]),
            position: positionProperty,
            model: {
                uri: "/ambulance_car.glb", // ✅ LOCAL PATH to your .glb file in public/models
                scale: 1.0,
                minimumPixelSize: 64,
            },
            orientation: new VelocityOrientationProperty(positionProperty),
            path: new PathGraphics({ width: 3 }),
        };

        setModelEntity(airplaneEntity);
    }, []);

    return (
        <div className="w-screen h-screen relative">
            {terrainProvider && (
                <Viewer
                    full
                    ref={viewerRef}
                    terrainProvider={terrainProvider}
                    timeline
                    clock={clockProps}
                >
                    {treesLocation.map((tree, index) => (
                        <Entity
                            key={index}
                            position={Cartesian3.fromDegrees(tree.coordinates[0], tree.coordinates[1], 220)}>
                            <ModelGraphics
                                uri="/tree.glb"
                                minimumPixelSize={340}
                                maximumPixelSize={180}
                                maximumScale={10}
                            />
                        </Entity>
                    ))}
                    {modelEntity && <Entity {...modelEntity} />}


                </Viewer>)}
        </div>
    );
}





