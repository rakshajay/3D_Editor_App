import { useEffect, useState } from "react";
import TransControls from "../TransControls/TransControls";
import TreeSceneGraph from "../TreeSceneGraph/TreeSceneGraph";
import "./HierarchyTree.scss";

function HierarchyTree({ scene }) {
  const [treeData, setTreeData] = useState([]);
  const [scale, setScale] = useState(null);
  const [position, setPosition] = useState(null);
  const [rotation, setRotation] = useState(null);
  //const [color, setColor] = useState(null);
  //const [animation, setAnimation] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  

  useEffect(() => {
    if (!scene || !scene.children) return;

    //if scene avaiable traverse the 3d object and get values for tree
    const extractNodes = (object) => {
      return {
        id: object.uuid,
        name: object.name || "Unnamed Object",
        children: object.children.map(extractNodes),
        reference: object,
      };
    };

    setTreeData(scene.children.map(extractNodes));
  }, [scene]);

  //selected node from TreeSceneGrph is stored 
  const handleNodeSelection = (
    newScale,
    newPosition,
    newRotation,
    newColor,
    newAnimation,
    selectedObject
  ) => {
    setScale(newScale);
    setPosition(newPosition);
    setRotation(newRotation);
    setColor(newColor);
    setAnimation(newAnimation);
    setSelectedNode(selectedObject);
  };


  //changes made on leva-UI should reflect in 3dModel- update directly on Three.js
  const handleTransformChange = (type, axis, value) => {
    if (!selectedNode || !selectedNode[type]) return;
    selectedNode[type][axis] = value;
    if (typeof selectedNode.updateMatrixWorld === "function") {
      selectedNode.updateMatrixWorld(true);
    }
    // Don't setSelectedNode({ ...selectedNode }) — it causes infinite re-renders
  };

  return (
    <div>
      Hierarchy Tree
      <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      </div>
      <div  className="scrollable-div">   
             {/* maps each item of TreeSceneGraph to TreeData to be rendered */}
        {treeData.map((node) => (
          <TreeSceneGraph
            key={node.id}
            node={node}
            onNodeSelect={handleNodeSelection}
            searchQuery={searchQuery}
          />
        ))}
      </div>
      <div>
        <TransControls
          scale={scale}
          position={position}
          rotation={rotation}
          onChange={handleTransformChange}
          
        />
      </div>
    </div>
  );
}

export default HierarchyTree;
