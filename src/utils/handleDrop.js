import Swal from "sweetalert2";

//to access in global scope 
let fileMap = {};
let mainGltfFile = null;
let mainGlbFile = null;

async function checkFileOrFolder(entry, path = "") {
  if (entry.isFile) {
    const file = await new Promise((resolve) => entry.file(resolve));
    const filePath = path ? `${path}/${file.name}` : file.name;
    const url = URL.createObjectURL(file);
    fileMap[filePath] = url;
    console.log(`File mapped: ${filePath} -> ${url}`);

    if (file.name.endsWith(".gltf")) {
      mainGltfFile = file;
    } else if (file.name.endsWith(".glb")) {
      mainGlbFile = url;
    }
  } else if (entry.isDirectory) {
    const reader = entry.createReader();
    const entries = await new Promise((resolve) => reader.readEntries(resolve));

    for (const subEntry of entries) {
      await checkFileOrFolder(subEntry, path ? `${path}/${entry.name}` : entry.name);
    }
  }
}

export default async function handleDrop(event, setModel) {
  event.preventDefault();

  fileMap = {};
  mainGltfFile = null;
  mainGlbFile = null;

  const items = event.dataTransfer.items;
  const processingTasks = [];

  for (const item of items) {
    const entry = item.webkitGetAsEntry();
    if (entry) {
      processingTasks.push(checkFileOrFolder(entry));
    }
  }

  await Promise.all(processingTasks);

  console.log("Final File Map:", fileMap);

  if (mainGlbFile) {
    console.log("Loading .glb file:", mainGlbFile);
    setModel(mainGlbFile);
    return;
  }

  if (mainGltfFile) {
    try {
      const gltfText = await mainGltfFile.text();
      let gltfJson = JSON.parse(gltfText);

      if (gltfJson.buffers) {
        gltfJson.buffers.forEach((buffer) => {
          const bufferFileName = buffer.uri.split("/").pop();
          if (fileMap[bufferFileName]) buffer.uri = fileMap[bufferFileName];
        });
      }

      if (gltfJson.images) {
        gltfJson.images.forEach((image) => {
          const imageFileName = image.uri;
          console.log("imageFileName", imageFileName)
          if (fileMap[imageFileName]) image.uri = fileMap[imageFileName];
        });
      }

      console.log("Updated glTF JSON:", gltfJson);

      const updatedGltfBlob = new Blob([JSON.stringify(gltfJson)], { type: "application/json" });
      const updatedGltfUrl = URL.createObjectURL(updatedGltfBlob);

      console.log("Updated glTF URL:", updatedGltfUrl);
      setModel(updatedGltfUrl);
    } catch (error) {
      console.error("Error processing .gltf file:", error);
      Swal.fire({
        title: "Invalid .gltf File!",
        text: "An error occurred while processing the file.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  } else {
    Swal.fire({
      title: "Invalid files!",
      text: "Please upload a valid .glb or .gltf file with dependencies.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
}

// Attach event listeners


// Attach event listeners

// export default async function handleDrop(event, setModel) {
//   event.preventDefault();

//   const files = event.dataTransfer.items 
//     ? [...event.dataTransfer.items] 
//     : [...event.dataTransfer.files];

//   const fileMap = {}; // Store file URLs
//   let mainGltfFile = null;
//   let mainGlbFile = null;

//   // Process each file
//   for (const fileItem of files) {
//     let file = fileItem.getAsFile ? fileItem.getAsFile() : fileItem;

//     if (file) {
//       const url = URL.createObjectURL(file);
//       fileMap[file.name] = url;

//       if (file.name.endsWith(".gltf")) {
//         mainGltfFile = file;
//       } else if (file.name.endsWith(".glb")) {
//         mainGlbFile = url;
//       }
//     }
//   }

//   if (mainGlbFile) {
//     // If a .glb file is present, use it directly
//     setModel(mainGlbFile);
//     return;
//   }

//   if (mainGltfFile) {
//     try {
//       const gltfText = await mainGltfFile.text();
//       let gltfJson = JSON.parse(gltfText);

//       // Update references for buffers and images
//       if (gltfJson.buffers) {
//         gltfJson.buffers.forEach((buffer) => {
//           if (buffer.uri && fileMap[buffer.uri]) buffer.uri = fileMap[buffer.uri];
//         });
//       }
//       if (gltfJson.images) {
//         gltfJson.images.forEach((image) => {
//           if (image.uri && fileMap[image.uri]) image.uri = fileMap[image.uri];
//         });
//       }

//       // Convert updated glTF JSON back to a blob
//       const updatedGltfBlob = new Blob([JSON.stringify(gltfJson)], { type: "application/json" });
//       const updatedGltfUrl = URL.createObjectURL(updatedGltfBlob);

//       console.log("Processed .gltf file:", mainGltfFile.name);
//       setModel(updatedGltfUrl);
//     } catch (error) {
//       console.error("Error processing .gltf file:", error);
//       Swal.fire({
//         title: "Invalid .gltf File!",
//         text: "An error occurred while processing the file.",
//         icon: "error",
//         confirmButtonText: "OK",
//       });
//     }
//   } else {
//     Swal.fire({
//       title: "Invalid files!",
//       text: "Please upload a valid .glb or .gltf file with dependencies.",
//       icon: "error",
//       confirmButtonText: "OK",
//     });
//   }
// }
