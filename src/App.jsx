import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stage, Grid, GizmoHelper, GizmoViewport, PivotControls, Outlines } from "@react-three/drei";
import { useState, useEffect, useRef, Suspense } from "react";
import { Box3, Vector3, MeshStandardMaterial } from "three";
import handleDrop from "./utils/handleDrop.js";
import HierarchyTree from "./components/HierarchyTree/HierarchyTree";
import "./App.css";

function App() {
  const [scene, setScene] = useState([]);
  const [model, setModel] = useState(null);
  const [pivotScale, setPivotScale] = useState(1);
  const [orbitEnabled, setOrbitEnabled] = useState(true);
  const [selected, setSelected] = useState(false);

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleSelect() {
    setSelected(!selected);
  }

  function ModelViewer({ modelPath }) {
    const { scene } = useGLTF(modelPath, true);
    const modelRef = useRef();

    useEffect(() => {
      if (scene) {
        setScene(scene);
      }
    }, [scene]);

    useEffect(() => {
      if (scene) {
        const box = new Box3().setFromObject(scene);
        const size = new Vector3();
        box.getSize(size);

        const maxSize = Math.max(size.x, size.y, size.z);
        setPivotScale(maxSize * 0.1);
      }
    }, [scene]);

      return (
      <PivotControls
        scale={pivotScale}
        lineWidth={2}
        depthTest={false}
        onDragStart={() => setOrbitEnabled(false)}
        onDragEnd={() => setOrbitEnabled(true)} 
      >
         <primitive
        object={scene}
        ref={modelRef}
        onClick={handleSelect}
        material={
          selected
            ? new MeshStandardMaterial({ color: "yellow", emissive: "yellow", emissiveIntensity: 0.5 })
            : undefined
        }
      />
      {selected && <Outlines color="yellow" width="20" />}
      </PivotControls>
    );
  }

  return (
    <div>
      <HierarchyTree scene={scene} />
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
