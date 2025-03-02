import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls } from "@react-three/drei";
import { useState } from "react";
import Swal from "sweetalert2";
import "./App.css";

function App() {
  const [model, setModel] = useState(null);

  function OnClickUpload(event) {
    const file = event.target.files[0];
    if (file && (file.name.endsWith(".glb") || file.name.endsWith(".gltf"))) {
      const url = URL.createObjectURL(file);
      setModel(url);
    } else {
      Swal.fire({
        title: "Invalid file!",
        text: "Please upload a .glb or .gltf file.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }

  function ModelViewer({ modelPath }) {
    const { scene } = useGLTF(modelPath);
    return <primitive object={scene} />;
  }

  return (
    <div>
      <div>
        <input
          type="file"
          accept=".glb, .gltf"
          onChange={OnClickUpload}
          id="fileInput"
        />
      </div>
      <div>
        <Canvas dpr={[1,2]} shadows camera={{ fov: 45 }} style={{"position": "absolute"}}>
  
      <color attach="background" args={["#101010"]} />
      <PresentationControls speed={1.5} global zoom={.5} polar={[-0.1, Math.PI / 4]}>
        <Stage environment={"sunset"}>
        {model && <ModelViewer modelPath={model} />}
        </Stage>
      </PresentationControls>
    </Canvas>
      </div>
    </div>
  );
}

export default App;
