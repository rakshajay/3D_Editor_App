import React, { useEffect } from "react";
import { useControls } from "leva";
import Swal from "sweetalert2";

const TransControls = ({ scale, position, rotation, onChange }) => {
  const controls = useControls("Transform Controls", {
    scaleX: { value: scale?.x || 1, min: 0.1, max: 150, step: 0.1 },
    scaleY: { value: scale?.y || 1, min: 0.1, max: 150, step: 0.1 },
    scaleZ: { value: scale?.z || 1, min: 0.1, max: 150, step: 0.1 },
    posX: { value: position?.x || 0, min: -100, max: 100, step: 0.1 },
    posY: { value: position?.y || 0, min: -100, max: 100, step: 0.1 },
    posZ: { value: position?.z || 0, min: -100, max: 100, step: 0.1 },
    rotX: { value: rotation?.x || 0, min: -Math.PI, max: Math.PI, step: 0.1 },
    rotY: { value: rotation?.y || 0, min: -Math.PI, max: Math.PI, step: 0.1 },
    rotZ: { value: rotation?.z || 0, min: -Math.PI, max: Math.PI, step: 0.1 },
  });

  useEffect(() => {
    const values = [
      controls.scaleX,
      controls.scaleY,
      controls.scaleZ,
      controls.posX,
      controls.posY,
      controls.posZ,
    ];

    if (values.some((val) => val > 100)) {
      Swal.fire({
        icon: "warning",
        title: "Input Limit Exceeded",
        text: "Values should not exceed 100.",
      });
    }

    if (onChange) {
      onChange("scale", "x", controls.scaleX);
      onChange("scale", "y", controls.scaleY);
      onChange("scale", "z", controls.scaleZ);
      onChange("position", "x", controls.posX);
      onChange("position", "y", controls.posY);
      onChange("position", "z", controls.posZ);
      onChange("rotation", "x", controls.rotX);
      onChange("rotation", "y", controls.rotY);
      onChange("rotation", "z", controls.rotZ);
    }
  }, [controls, onChange]);

  return null;
};

export default TransControls;
