import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function Model({ url }) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} />;
}

export default function ModelViewer({ modelUrl }) {
    return (
        <div className="h-full w-full bg-gray-900">
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Model url={modelUrl} />
                <OrbitControls />
            </Canvas>
        </div>
    );
}