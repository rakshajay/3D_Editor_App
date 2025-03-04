import { useEffect, useState } from "react";
import TransControls from "../TransControls/TransControls";
import TreeSceneGraph from "../TreeSceneGraph/TreeSceneGraph";

function HierarchyTree({ scene }) {
  const [treeData, setTreeData] = useState([]);
  const [scale, setScale] = useState(null);
  const [position, setPosition] = useState(null);
  const [rotation, setRotation] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    if (!scene || !scene.children) return;

    const extractNodes = (object) => {
      return {
        id: object.uuid,
        name: object.name || "Unnamed Object",
        children: object.children.map(extractNodes), // Recursively extract children
        reference: object, // Store a direct reference to the object
      };
    };

    setTreeData(scene.children.map(extractNodes));
  }, [scene]);

  const handleNodeSelection = (newScale, newPosition, newRotation, selectedObject) => {
    setScale(newScale);
    setPosition(newPosition);
    setRotation(newRotation);
    setSelectedNode(selectedObject); // Ensure selected node is stored properly
  };
  
  const handleTransformChange = (type, axis, value) => {
    if (!selectedNode || !selectedNode[type]) return; // Ensure selected node exists
  
    // Update transformation directly on the Three.js object
    selectedNode[type][axis] = value;
  
    // Ensure Three.js applies the update
    if (typeof selectedNode.updateMatrixWorld === "function") {
      selectedNode.updateMatrixWorld(true);
    }
  
    // Do NOT call setSelectedNode({ ...selectedNode }) — it causes infinite re-renders
  };
  
  
  return (
    <div>
      <h3>Hierarchy Tree</h3>
      <div>
        {treeData.map((node) => (
          <TreeSceneGraph key={node.id} node={node} onNodeSelect={handleNodeSelection}  />
        ))}
      </div>
      <div>
        <TransControls scale={scale} position={position} rotation={rotation} onChange={handleTransformChange}/>
      </div>
    </div>
  );
}

export default HierarchyTree;
