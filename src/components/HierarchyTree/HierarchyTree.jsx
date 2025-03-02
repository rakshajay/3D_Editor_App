import { Tree } from "react-arborist";
import { useEffect, useState } from "react";

const HierarchyTree = ({ sceneChildren }) => {
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    if (!sceneChildren || !Array.isArray(sceneChildren)) return;

    const mapSceneToTree = (object) => ({
      id: object.uuid || Math.random().toString(36).substr(2, 9), 
      name: object.name || "Unnamed Object", 
      material:object.material || "unnamed",
      children: object.children ? object.children.map(mapSceneToTree) : [],
    });

    setTreeData(sceneChildren.map(mapSceneToTree));
  }, [sceneChildren]);

  return (
    <div >
      <h3>Hierarchy Tree</h3>
      <Tree
        data={treeData}
        openByDefault={true}
        renderNode={({ node }) => <div>{node.data.name}</div>} 
        //onSelect={(node) => console.log("Selected:", node[0].data) }
      />
    </div>
  );
};

export default HierarchyTree;