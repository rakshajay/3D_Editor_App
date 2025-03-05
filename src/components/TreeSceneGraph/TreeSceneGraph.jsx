import { useState, useEffect } from "react";

const TreeSceneGraph = ({ node, onNodeSelect, searchQuery }) => {
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

  //show matching nodes and their parents
  const matchesSearch = node.name
    .toLowerCase()
    .includes(searchQuery.toLowerCase());
  const filteredChildren = node.children
    .map((child) => ({
      ...child,
      children: child.children,
    }))
    .filter(
      (child) =>
        child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        child.children.length > 0
    );

  // Hide rest of nodes
  if (!matchesSearch && filteredChildren.length === 0) return null;

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
            <div>
              {filteredChildren.map((child) => (
                <TreeSceneGraph
                  key={child.id}
                  node={child}
                  searchQuery={searchQuery}
                  onNodeSelect={onNodeSelect}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TreeSceneGraph;
