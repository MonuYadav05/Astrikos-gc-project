import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react"


export const Vehicle = () => {
    const ambulanceRef = useRef();
    const { scene } = useGLTF("/ambulance_car.glb")
    const [position, setPosition] = useState([0, 0.5, 0])

    useFrame(() => {
        // Fake movement: move ahead
        setPosition(([x, y, z]) => {
            const newz = z + 0.05
            if (ambulanceRef.current) {
                ambulanceRef.current.position.set(x, y, newz)
            }
            return [x, y, newz]
        })
    })
    return (
        <primitive object={scene} ref={ambulanceRef} position={position} />
    )
}