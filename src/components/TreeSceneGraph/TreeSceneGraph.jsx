import { useState, useEffect } from "react";

const TreeSceneGraph = ({ node, onNodeSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [originalColor, setOriginalColor] = useState(null);

  const handleClick = (event) => {
    event.stopPropagation(); // avoid bubbling

    if (!node.reference || !node.reference.isMesh || !node.reference.material)
      return;

    if (!originalColor) {
      setOriginalColor(node.reference.material.color.getStyle());
    }

    //selcted object highlight
    node.reference.material.color.set("#39FF14");
    node.reference.material.needsUpdate = true;

    setSelectedNode(node.reference);
    onNodeSelect(
      node.reference.scale,
      node.reference.position,
      node.reference.rotation,
      node.reference.material.color,
      node.reference.animation,
      node.reference
    );
  };

  //selected object gets back its original color once clicked outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (selectedNode && !event.target.closest(".tree-node")) {
        if (selectedNode.isMesh && selectedNode.material && originalColor) {
          selectedNode.material.color.set(originalColor);
          selectedNode.material.needsUpdate = true;
        }
        setSelectedNode(null);
        setOriginalColor(null);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [selectedNode, originalColor]);

  return (
    <div>
      <div className="tree-node" style={{ marginLeft: "20px" }}>
        <div
          onClick={(event) => {
            setIsOpen(!isOpen);
            handleClick(event);
          }}
        >
          {node.children.length > 0 ? (isOpen ? "▼" : "▶") : "•"} {node.name}
        </div>
        {isOpen && (
          <div>
            {node.children.map((child) => (
              <TreeSceneGraph
                key={child.id}
                node={child}
                onNodeSelect={onNodeSelect} // passing selected mesh values to pass it to TransControl
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TreeSceneGraph;
