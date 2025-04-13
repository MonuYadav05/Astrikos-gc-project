import { useEffect, useRef, useState } from "react";
import { Viewer, Entity, ModelGraphics, LabelGraphics } from "resium";
import { Cartesian3, createOsmBuildingsAsync, Ion, Math as CesiumMath, createWorldTerrainAsync, SampledPositionProperty, JulianDate, ClockRange, ClockStep, VelocityOrientationProperty, PathGraphics, TimeIntervalCollection, TimeInterval, Clock, Color, Ellipsoid, LabelStyle, VerticalOrigin, HorizontalOrigin, Cartesian2, HeadingPitchRoll, CallbackProperty, Transforms, Quaternion } from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import { treesLocation } from "../data/trees";
import { ambulancePath } from "../data/ambulanceData";
import { fireTruckPath } from "../data/fireTruckData";

// Initialize Cesium access token
Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NDYzODI3Mi00OTlmLTRlNjctOTczOC0wYzA3MmI1ODgxMGIiLCJpZCI6MjkyMTA0LCJpYXQiOjE3NDQxODQwOTB9.NwrWo2AlyRVVNFb5H_OXnMkRUR5bt_HxxQJjpOQVUC4";
window.CESIUM_BASE_URL = "/";

export default function MapViewer() {
    const viewerRef = useRef(null);
    const [terrainProvider, setTerrainProvider] = useState(null);
    const [modelEntity, setModelEntity] = useState(null);
    const [clockProps, setClockProps] = useState(null);
    const emergencyCoords = [77.896710156385822, 29.864097266133999];
    const [distanceLeft, setDistanceLeft] = useState(0);
    const [speed, setSpeed] = useState(0);
    const [eta, setEta] = useState(0);
    const fireEmergencyCoords = [77.893290717873057, 29.867112103202281];
    const [fireTruckEntity, setFireTruckEntity] = useState(null);
    const [fireTruckDistanceLeft, setFireTruckDistanceLeft] = useState(0);
    const [fireTruckSpeed, setFireTruckSpeed] = useState(0);
    const [fireTruckEta, setFireTruckEta] = useState(0);

    useEffect(() => {
        createWorldTerrainAsync().then(setTerrainProvider);
    }, []);


    useEffect(() => {
        const viewer = viewerRef.current?.cesiumElement;

        if (!viewer || !terrainProvider) return;

        // const trackedEntity = viewer.entities.add(modelEntity);
        // viewer.trackedEntity = trackedEntity;

        viewer.camera.flyTo({
            destination: Cartesian3.fromDegrees(77.894569, 29.864611, 400),
            orientation: {
                heading: CesiumMath.toRadians(20.0),
                pitch: CesiumMath.toRadians(-20.0),
            },
        });

        createOsmBuildingsAsync().then((tileset) => {
            viewer.scene.primitives.add(tileset);
        });
    }, [terrainProvider, modelEntity]);


    function getDistance(lat1, lon1, lat2, lon2) {
        const cart1 = Cartesian3.fromDegrees(lon1, lat1);
        const cart2 = Cartesian3.fromDegrees(lon2, lat2);
        return Cartesian3.distance(cart1, cart2); // in meters
    }

    function getTotalDistance(path) {
        let total = 0;
        for (let i = 1; i < path.length; i++) {
            const [lon1, lat1] = path[i - 1].coordinates;
            const [lon2, lat2] = path[i].coordinates;
            total += getDistance(lat1, lon1, lat2, lon2);
        }
        return total;
    }


    useEffect(() => {
        const timeStepInSeconds = 10;
        const fireTimeStepInSeconds = 1;
        const start = JulianDate.now();
        const totalSeconds = timeStepInSeconds * (ambulancePath.length - 1);
        const stop = JulianDate.addSeconds(start, totalSeconds, new JulianDate());
        const fireTruckTotalSeconds = fireTimeStepInSeconds * (fireTruckPath.length - 1);
        const fireTruckStop = JulianDate.addSeconds(start, fireTruckTotalSeconds, new JulianDate());

        const totalDistance = getTotalDistance(ambulancePath);

        const positionProperty = new SampledPositionProperty();
        for (let i = 0; i < ambulancePath.length; i++) {
            const [lon, lat] = ambulancePath[i].coordinates;
            const position = Cartesian3.fromDegrees(lon, lat, 220);
            const time = JulianDate.addSeconds(start, i * timeStepInSeconds, new JulianDate());
            positionProperty.addSample(time, position);
        }


        const firePositionProperty = new SampledPositionProperty();
        for (let i = 0; i < fireTruckPath.length; i++) {
            const [lon, lat] = fireTruckPath[i].coordinates;
            const position = Cartesian3.fromDegrees(lon, lat, 220);
            const time = JulianDate.addSeconds(start, i * fireTimeStepInSeconds, new JulianDate());
            firePositionProperty.addSample(time, position);
        }
        const baseOrientation = new VelocityOrientationProperty(firePositionProperty);

        const offsetHPR = new HeadingPitchRoll(CesiumMath.toRadians(180), 0, 0);
        const orientation = new CallbackProperty((time, result) => {
            const baseQuat = baseOrientation.getValue(time, result);
            const offsetQuat = Transforms.headingPitchRollQuaternion(Cartesian3.ZERO, offsetHPR);
            return Quaternion.multiply(baseQuat, offsetQuat, result);
        }, false);

        const fireTruckEntity = {
            availability: new TimeIntervalCollection([new TimeInterval({ start, stop: fireTruckStop })]),
            position: firePositionProperty,
            orientation: orientation,
            path: new PathGraphics({ width: 3, material: Color.ORANGE }),
            model: {
                uri: "/FireTruck.glb",
                scale: 1.0,
                minimumPixelSize: 240,
                maximumPixelSize: 280,
                maximumScale: 30
            },
        };
        setFireTruckEntity(fireTruckEntity);

        const clock = new Clock();
        clock.startTime = start.clone();
        clock.stopTime = stop.clone();
        clock.currentTime = start.clone();
        clock.clockRange = ClockRange.CLAMPED;
        clock.clockStep = ClockStep.SYSTEM_CLOCK_MULTIPLIER;
        clock.multiplier = 50; // Speed of simulation
        clock.shouldAnimate = true;

        setClockProps(clock);

        const ambulanceEntity = {
            availability: new TimeIntervalCollection([new TimeInterval({ start, stop })]),
            position: positionProperty,
            orientation: new VelocityOrientationProperty(positionProperty),
            path: new PathGraphics({ width: 3, material: Color.RED }),
            model: {
                uri: "/ambulance_car.glb",
                scale: 1.0,
                minimumPixelSize: 140,
                maximumPixelSize: 180,
                maximumScale: 10
            },
        };

        setModelEntity(ambulanceEntity);

        const interval = setInterval(() => {
            const viewer = viewerRef.current?.cesiumElement;
            if (!viewer) return;
            const clock = viewer.clock;

            const currentTime = clock.currentTime;
            const currentPosition = positionProperty.getValue(currentTime);
            if (!currentPosition) return;

            let distanceLeft = 0;
            for (let i = 1; i < ambulancePath.length; i++) {
                const time = JulianDate.addSeconds(start, i * timeStepInSeconds, new JulianDate());
                const futurePos = positionProperty.getValue(time);
                if (futurePos && JulianDate.compare(currentTime, time) < 0) {
                    distanceLeft += Cartesian3.distance(currentPosition, futurePos);
                    for (let j = i + 1; j < ambulancePath.length; j++) {
                        const [lon1, lat1] = ambulancePath[j - 1].coordinates;
                        const [lon2, lat2] = ambulancePath[j].coordinates;
                        distanceLeft += getDistance(lat1, lon1, lat2, lon2);
                    }
                    break;
                }
            }

            const elapsedSeconds = JulianDate.secondsDifference(currentTime, start);
            if (elapsedSeconds <= 0 || isNaN(elapsedSeconds)) return;

            const numericSpeed = (totalDistance - distanceLeft) / elapsedSeconds;
            if (!isFinite(numericSpeed) || numericSpeed <= 0) return;

            const speedValue = numericSpeed.toFixed(2);
            const etaValue = (distanceLeft / numericSpeed).toFixed(1);

            setDistanceLeft(distanceLeft.toFixed(2));
            setSpeed(speedValue);
            setEta(etaValue);
        }, 1000);

        const fireTruckTotalDistance = getTotalDistance(fireTruckPath);

        const fireInterval = setInterval(() => {
            const viewer = viewerRef.current?.cesiumElement;
            if (!viewer) return;
            const clock = viewer.clock;

            const currentTime = clock.currentTime;
            const currentPosition = firePositionProperty.getValue(currentTime);
            if (!currentPosition) return;

            let distanceLeft = 0;
            for (let i = 1; i < fireTruckPath.length; i++) {
                const time = JulianDate.addSeconds(start, i * fireTimeStepInSeconds, new JulianDate());
                const futurePos = firePositionProperty.getValue(time);
                if (futurePos && JulianDate.compare(currentTime, time) < 0) {
                    distanceLeft += Cartesian3.distance(currentPosition, futurePos);
                    for (let j = i + 1; j < fireTruckPath.length; j++) {
                        const [lon1, lat1] = fireTruckPath[j - 1].coordinates;
                        const [lon2, lat2] = fireTruckPath[j].coordinates;
                        distanceLeft += getDistance(lat1, lon1, lat2, lon2);
                    }
                    break;
                }
            }

            const elapsedSeconds = JulianDate.secondsDifference(currentTime, start);
            if (elapsedSeconds <= 0 || isNaN(elapsedSeconds)) return;

            const numericSpeed = (fireTruckTotalDistance - distanceLeft) / elapsedSeconds;
            if (!isFinite(numericSpeed) || numericSpeed <= 0) return;

            setFireTruckDistanceLeft(distanceLeft.toFixed(2));
            setFireTruckSpeed(numericSpeed.toFixed(2));
            setFireTruckEta((distanceLeft / numericSpeed).toFixed(1));
        }, 1000);

        return () => {
            clearInterval(interval);
            clearInterval(fireInterval);
        }
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
                    {fireTruckEntity && <Entity {...fireTruckEntity} />}
                    <Entity
                        name="Emergency Location"
                        position={Cartesian3.fromDegrees(emergencyCoords[0], emergencyCoords[1], 220)}
                        point={{ pixelSize: 16, color: Color.RED }} >
                        <LabelGraphics
                            text="Ambulance Emergency Location"
                            font="18px Helvetica"
                            style={LabelStyle.FILL_AND_OUTLINE}
                            outlineWidth={2}
                            outlineColor={Color.BLACK}
                            verticalOrigin={VerticalOrigin.BOTTOM}
                            horizontalOrigin={HorizontalOrigin.CENTER}
                            pixelOffset={new Cartesian2(0, -20)} // Offset to place label above the point
                        />
                    </Entity>
                    <Entity
                        name="Fire Emergency Location"
                        position={Cartesian3.fromDegrees(fireEmergencyCoords[0], fireEmergencyCoords[1], 220)}
                        point={{ pixelSize: 16, color: Color.ORANGE }}

                    >
                        <LabelGraphics
                            text="Fire Emergency Location"
                            font="18px Helvetica"
                            style={LabelStyle.FILL_AND_OUTLINE}
                            outlineWidth={2}
                            outlineColor={Color.BLACK}
                            verticalOrigin={VerticalOrigin.BOTTOM}
                            horizontalOrigin={HorizontalOrigin.CENTER}
                            pixelOffset={new Cartesian2(0, -20)} // Offset to place label above the point
                        />
                    </Entity>
                    <div className="absolute top-4 left-4 bg-white p-4 rounded shadow-md z-10 space-y-2">
                        <div>
                            <h2 className="font-bold">🚑 Ambulance</h2>
                            <p>Distance Left: {distanceLeft} m</p>
                            <p>Speed: {speed} m/s</p>
                            <p>ETA: {eta} s</p>
                        </div>
                        <div>
                            <h2 className="font-bold mt-2">🚒 Fire Truck</h2>
                            <p>Distance Left: {fireTruckDistanceLeft} m</p>
                            <p>Speed: {fireTruckSpeed} m/s</p>
                            <p>ETA: {fireTruckEta} s</p>
                        </div>
                    </div>
                </Viewer>)}
        </div>
    );
}





