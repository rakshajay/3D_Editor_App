import { useEffect, useState } from "react";
import TransControls from "../TransControls/TransControls";
import TreeSceneGraph from "../TreeSceneGraph/TreeSceneGraph";

function HierarchyTree({ scene }) {
  const [treeData, setTreeData] = useState([]);
  const [scale, setScale] = useState(null);
  const [position, setPosition] = useState(null);
  const [rotation, setRotation] = useState(null);

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

  const handleNodeSelection = (newScale, newPosition, newRotation) => {
    setScale(newScale);
    setPosition(newPosition);
    setRotation(newRotation);
  };
  const handleTransformChange = (type, axis, value) => {
    if (!selectedNode) return;
    
    selectedNode[type][axis] = value;
    selectedNode.updateMatrixWorld(true); // Ensure transformations apply
    setTreeData([...treeData]); // Force a re-render
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
