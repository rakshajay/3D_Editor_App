import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stage, Grid, GizmoHelper, GizmoViewport, PivotControls } from "@react-three/drei";
import { useState, useEffect, useRef, Suspense } from "react";
import { Box3, Vector3 } from "three";
import { useControls } from "leva";
import handleDrop from "./utils/handleDrop.js";
import HierarchyTree from "./components/HierarchyTree/HierarchyTree";
import "./App.css";

function App() {
  const [sceneChildren, setSceneChildren] = useState([]);
  const [model, setModel] = useState(null);
  const [pivotScale, setPivotScale] = useState(1);
  const [orbitEnabled, setOrbitEnabled] = useState(true);
  const modelRef = useRef();

  function handleDragOver(event) {
    event.preventDefault();
  }

  function ModelViewer({ modelPath }) {
    const { scene } = useGLTF(modelPath, true);
    const modelRef = useRef();

    useEffect(() => {
      if (scene) {
        setSceneChildren(scene.children);
      }
    }, [scene]);

    useEffect(() => {
      if (scene) {
        const box = new Box3().setFromObject(scene);
        const size = new Vector3();
        box.getSize(size);

        // Dynamically adjust PivotControls scale
        const maxSize = Math.max(size.x, size.y, size.z);
        setPivotScale(maxSize * 0.1);
      }
    }, [scene]);

    // Leva UI Controls (Position, Rotation, Scale)
    const { position, rotation, scale } = useControls("Transform Controls", {
      position: { value: [0, 0, 0], step: 0.1 },
      rotation: { value: [0, 0, 0], step: 0.1 },
      scale: { value: [1, 1, 1], step: 0.1, min: 0.1, max: 5 },
    });

    return (
      <PivotControls
        scale={pivotScale}
        lineWidth={2}
        depthTest={false}
        onDragStart={() => setOrbitEnabled(false)} // Disable OrbitControls
        onDragEnd={() => setOrbitEnabled(true)} // Enable OrbitControls
      >
        <primitive object={scene} ref={modelRef} position={position} rotation={rotation} scale={scale} />
      </PivotControls>
    );
  }

  return (
    <div>
      <HierarchyTree sceneChildren={sceneChildren} />
      <div>
        <Canvas
          dpr={[1, 2]}
          shadows
          camera={{ fov: 45 }}
          style={{ position: "absolute" }}
          onDrop={(event) => handleDrop(event, setModel)}
          onDragOver={handleDragOver}
        >
          <color attach="background" args={["#101010"]} />

          <Stage environment={"sunset"}>
            {model && (
              <Suspense fallback={null}>
                <ModelViewer modelPath={model} />
              </Suspense>
            )}
          </Stage>

          <Grid args={[1000, 1000]} sectionColor={"pink"} cellColor={"gray"} sectionSize={1000} fadeDistance={2000} />

          <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
            <GizmoViewport labelColor="white" axisHeadScale={1} />
          </GizmoHelper>

          <OrbitControls enabled={orbitEnabled} panSpeed={1} rotateSpeed={1} />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
