import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Stage,
  PresentationControls,
} from "@react-three/drei";
import { useState, useEffect, Suspense } from "react";
import handleDrop from "./utils/handleDrop.js";
import HierarchyTree from "./components/HierarchyTree/HierarchyTree";
import "./App.css";

function App() {
  const [sceneChildren, setSceneChildren] = useState([]);
  const [model, setModel] = useState(null);

  function handleDragOver(event) {
    event.preventDefault();
  }

  function ModelViewer({ modelPath }) {
    const { scene } = useGLTF(modelPath, true);
    
    useEffect(() => {
      if (scene) {
        setSceneChildren(scene.children);
      }
    }, [scene]);

    const click = (e) => {
      e.stopPropagation();
      alert(`You clicked on ${e.object.name}`);
    };

    return <primitive object={scene} onPointerDown={click} />;
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
          <PresentationControls
            speed={1.5}
            global
            zoom={0.5}
            polar={[-0.1, Math.PI / 4]}
          >
            <Stage environment={"sunset"}>
              {model && (
                <Suspense fallback={null}>
                  <ModelViewer modelPath={model} />
                </Suspense>
              )}
            </Stage>
          </PresentationControls>
          <OrbitControls panSpeed={3} rotateSpeed={3} />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
