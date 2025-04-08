

export const City = () => {
    return (
        <>
            {/* Gorund */}
            <mesh receiveShadow position={[0, -0.5, 0]}>
                <boxGeometry args={[50, 0.5, 50]} />
                <meshStandardMaterial color="#666" />
            </mesh>

            {/* Simple Buildings */}
            {[...Array(20)].map((_, i) => (
                <mesh key={i} position={[Math.random() * 45 - 23, 0.5, Math.random() * 45 - 23]}>
                    <boxGeometry args={[2, Math.random() * 5 + 1, 2]} />
                    <meshStandardMaterial color="lightblue" />
                </mesh>
            ))}
        </>
    )
}