import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/Addons.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import gsap from 'gsap';


//Loader

let loadingManager;
let loadingContainer;


function initializeLoadingManager() {
  loadingContainer = document.getElementById('loading-container');
  
  loadingManager = new THREE.LoadingManager();
  
  loadingManager.onLoad = () => {
      if (loadingContainer) {
          // Use GSAP for smooth fade out
          gsap.to(loadingContainer, {
              opacity: 0,
              duration: 2,
              ease: "power2.inOut",
              onComplete: () => {
                  if (loadingContainer && loadingContainer.parentNode) {
                      loadingContainer.parentNode.removeChild(loadingContainer);
                  }
              }
          });
      }
  };

  loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progress = Math.min((itemsLoaded / itemsTotal) * 100, 100).toFixed(0);
      console.log(`Loading: ${progress}%`);
  };

  loadingManager.onError = (url) => {
      console.error('Error loading:', url);
  };

  return loadingManager;
}

// Initialize the loading manager before creating any loaders
loadingManager = initializeLoadingManager();



// Declaring meshes
let textMesh;
let textMesh2;
let textMesh3;



// initialize the renderer
const canvas = document.querySelector('canvas.threejs');
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
});


//Render settings
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setClearColor(0x009693);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio , 2));

document.body.appendChild(renderer.domElement);



// creating a scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/ window.innerHeight,0.2,300);
camera.position.set(26.09,8.70,-10.87);





// Creating Geometry And Materials
const planeGeometry = new THREE.PlaneGeometry(1,1,1);
const planeMaterial = new THREE.MeshStandardMaterial({
  side: THREE.DoubleSide,
  color: 0xffffff
});

//Reference planes
const planeMesh = new THREE.Mesh(planeGeometry,planeMaterial);
planeMesh.position.set(2.85,0.79,0.74);
planeMesh.rotation.set(-2.82, 0.87,2.89);


const planeMesh2 = new THREE.Mesh(planeGeometry,planeMaterial);
planeMesh2.position.set(-1.30,0.85,3.91);
planeMesh2.rotation.set(-0.46, 1.29, 0.45);


const planeMesh3 = new THREE.Mesh(planeGeometry,planeMaterial);
planeMesh3.position.set(2.00 ,0.65, -2.61);
planeMesh3.rotation.y = -Math.PI/2;



// Click function meshes 
const cubeGeometry = new THREE.BoxGeometry(1,1,1);
const cubeMaterial = new THREE.MeshBasicMaterial({  
  color: 0x00ff00,             
  transparent: true,         
  opacity: 0              
})
const clickCubeMail = new THREE.Mesh(cubeGeometry,cubeMaterial)

clickCubeMail.position.set(2.29 ,0.57, -2.65);
clickCubeMail.scale.set(0.50,0.25,0.25);
scene.add(clickCubeMail);

const clickCubePj = new THREE.Mesh(cubeGeometry,cubeMaterial)
clickCubePj.position.set(-0.84,0.92,4.02);
clickCubePj.scale.set(0.65,-1.09,1.41);
scene.add(clickCubePj);

const clickCubeMe = new THREE.Mesh(cubeGeometry,cubeMaterial)
clickCubeMe.position.set(2.20,0.65,1.30);
clickCubeMe.scale.set(-0.25,0.45,0.25);
scene.add(clickCubeMe);





// Blender Model
const loader = new GLTFLoader(loadingManager);
loader.load(
    '/PuttingOnTextures.glb',
    (gltf) => {
        scene.add(gltf.scene);
    }
);
 



//lighting

// Ambient light for overall scene illumination with teal tint
const ambientLight = new THREE.AmbientLight(0x009693, 1);
scene.add(ambientLight);

// Main directional light (sun)
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Warm spotlight for the house
const houseLight = new THREE.SpotLight(0xffa500, 3);
houseLight.position.set(-2, 5, 5);
houseLight.angle = Math.PI / 6;
houseLight.penumbra = 0.3;
scene.add(houseLight);

const pointLight = new THREE.PointLight(0xffffff, 7);
pointLight.position.set(8.91, 0.43, 3.04);
scene.add(pointLight);

const pointLightC = new THREE.PointLight(0xffffff, 7.5);
pointLightC.position.set(0.11, -0.43, 5.00);
pointLightC.distance = 20;
scene.add(pointLightC);


const LIGHT_INTENSITY = {
  AMBIENT: 0.5,      
  DIRECTIONAL: 1.0,  
  TREE: 3.0,         // Increased intensity for brighter sakura glow
  HOUSE: 1.0         
};

// Adjusted the tree light color to be more sakura pink
const treeLight = new THREE.SpotLight(0xFFB7C5, LIGHT_INTENSITY.TREE); // More saturated pink color
treeLight.position.set(8, 5, 0.5);
treeLight.angle = Math.PI / 4;
treeLight.penumbra = 0.5;
treeLight.distance = 20; // Controlling the light fall-off
scene.add(treeLight);




// Creating a background for the menu 

const menuGroup = new THREE.Group();
const menuGeometry = new THREE.PlaneGeometry(1,1)
const menuMaterial = new THREE.MeshStandardMaterial({
  color: 0xCDA07F, 
  transparent: true, 
  opacity: 0.5,
  side: THREE.DoubleSide
}
)

const menuBackground = new THREE.Mesh(
  menuGeometry,
  menuMaterial
);
menuBackground.position.set(10,-0.22,-4.40);
menuBackground.scale.set(8.04,6.96,1.00);
menuBackground.rotation.x = -Math.PI/2;

camera.lookAt(menuBackground);






//   Making a font loader
{
const fontLoader = new FontLoader();

// Load the font (you'll need to provide the correct path to your font file)
fontLoader.load(
    '/ObjectTextures/fonts/Jua_Regular.json',
    (font) => {
        // Create text geometry
        const textGeometry = new TextGeometry('ABOUT ME', {
            font: font,
            size: 1,
            depth: 0.05,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.01,
            bevelOffset: 0,
            bevelSegments: 5
        });

        // Create material for the text
        const textMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x000000,
            metalness: 0.3,
            roughness: 0.4
        });

        // Create text mesh
        textMesh = new THREE.Mesh(textGeometry, textMaterial);

        textMesh2 = new THREE.Mesh(
          new TextGeometry('PROJECTS',{
            font: font,
            size: 1,
            depth: 0.05,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.01,
            bevelOffset: 0,
            bevelSegments: 5
          }),
          textMaterial);
        
          textMesh3 = new THREE.Mesh(
            new TextGeometry('CONTACT',{
              font: font,
              size: 1,
              depth: 0.05,
              curveSegments: 12,
              bevelEnabled: true,
              bevelThickness: 0.1,
              bevelSize: 0.01,
              bevelOffset: 0,
              bevelSegments: 5
            }),
            textMaterial);

            const textMesh4 = new THREE.Mesh(
              new TextGeometry('EXPLORE',{
                font: font,
                size: 1.5,
                depth: 0.05,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.1,
                bevelSize: 0.01,
                bevelOffset: 0,
                bevelSegments: 5
              }),
              textMaterial);

        // Center the text
        textGeometry.computeBoundingBox();
        const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
        
        // Position the text above the menu background
        textMesh.position.set(10, -0.22, -2.30);
        textMesh.scale.set(0.64,0.63,1.00);

        textMesh2.position.set(11.52, -0.22, -2.30);
        textMesh2.scale.set(0.64,0.63,1.00);

        textMesh3.position.set(13.04, -0.22, -2.30);
        textMesh3.scale.set(0.64,0.63,1.00);

        textMesh4.position.set(8.26, -0.22, -1.74);
        textMesh4.scale.set(0.64,0.63,1.00);

        // Rotate the text to match menu orientation
        textMesh.rotation.x = -Math.PI / 2;
        textMesh.rotation.y = Math.PI/6;
        textMesh.rotation.z = Math.PI/2;

        textMesh2.rotation.x = -Math.PI / 2;
        textMesh2.rotation.y = Math.PI/6;
        textMesh2.rotation.z = Math.PI/2;

        textMesh3.rotation.x = -Math.PI / 2;
        textMesh3.rotation.y = Math.PI/6;
        textMesh3.rotation.z = Math.PI/2;

        textMesh4.rotation.x = -Math.PI/2;
        textMesh4.rotation.y = Math.PI/6;
        textMesh4.rotation.z = Math.PI/2;

        // scene.add(textMesh3);
        menuGroup.add(menuBackground,textMesh2, textMesh3, textMesh4);
        scene.add(menuGroup);
        scene.add(textMesh)

    },
);
}


// camera animations

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Event listener for click
window.addEventListener('click', onClick, false);


function onClick(event) {
  // Convert the mouse position to normalized device coordinates (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the raycaster
  raycaster.setFromCamera(mouse, camera);

  // Get the list of intersected objects
  const intersects = raycaster.intersectObjects(scene.children);

  // Check if the clicked object is the specific mesh (textMesh)
  if (intersects.length > 0 && intersects[0].object === textMesh|| intersects[0].object === clickCubeMe) {
      // Call the transition to move the camera
      cameraLookAtObject(planeMesh);
  }
  else if (intersects.length > 0 && intersects[0].object === textMesh2 || intersects[0].object === clickCubePj){
    cameraLookAtObject(planeMesh2);
  }
  else if (intersects.length > 0 && intersects[0].object === textMesh3||intersects[0].object === clickCubeMail){
    cameraLookAtObject(planeMesh3);
  }
}



// Function to move the camera to focus on the object
async function cameraLookAtObject(targetObject) {
  // Disable camera controls during the transition
  controls.enableRotate = false;
  controls.enableZoom = false;

  // Get the position of the clicked object
  const targetPosition = targetObject.position;

  if(targetObject == planeMesh){

  // Animate the camera to move towards the target object
  gsap.to(camera.position, {
    duration: 2,
    ease: "power1.inOut",
    x: targetPosition.x + 1.05,  
    y: targetPosition.y + 0.5,   
    z: targetPosition.z - 0.3   
});

// Animate the control's target to focus on the object
gsap.to(controls.target, {
    duration: 2,
    ease: "power1.inOut",
    x: targetPosition.x,
    y: targetPosition.y,
    z: targetPosition.z
});
}
 else if(targetObject == planeMesh2){

  // Animate the camera to move towards the target object
  gsap.to(camera.position, {
    duration: 2,
    ease: "power1.inOut",
    x: targetPosition.x + 2,  
    y: targetPosition.y + 0.2,  
    z: targetPosition.z + 1   
});

// Animate the control's target to focus on the object
gsap.to(controls.target, {
    duration: 2,
    ease: "power1.inOut",
    x: targetPosition.x,
    y: targetPosition.y,
    z: targetPosition.z
});

 }

 else if(targetObject == planeMesh3){

  // Animate the camera to move towards the target object
  gsap.to(camera.position, {
    duration: 2,
    ease: "power1.inOut",
    x: targetPosition.x + 2,  
    y: targetPosition.y + 0.2,  
    z: targetPosition.z + 1   
});

// Animate the control's target to focus on the object
gsap.to(controls.target, {
    duration: 2,
    ease: "power1.inOut",
    x: targetPosition.x,
    y: targetPosition.y,
    z: targetPosition.z
});

 }

 

  // Wait for the animation to complete
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Re-enable camera controls after the transition
  controls.enableRotate = true;
  controls.enableZoom = true;
}

// camera animations end




// Text Mesh Color Change

const originalColor = new THREE.Color(0x000000);
const hoverColor = new THREE.Color(0x5c7586);

// Create separate materials for each mesh to avoid shared materials
const createNewMaterial = () => new THREE.MeshStandardMaterial({ 
    color: originalColor.clone(),
    metalness: 0.3,
    roughness: 0.4
});

// Function to update materials once meshes are created
function updateMeshMaterials() {
    if (textMesh) textMesh.material = createNewMaterial();
    if (textMesh2) textMesh2.material = createNewMaterial();
    if (textMesh3) textMesh3.material = createNewMaterial();
}

// Add event listeners for mouse movement
window.addEventListener('mousemove', onMouseMove);

function onMouseMove(event) {
    // Make sure meshes exist
    if (!textMesh || !textMesh2 || !textMesh3) return;

    // Update mouse coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster
    raycaster.setFromCamera(mouse, camera);

    // Create an array of meshes to check for intersection
    const meshesToCheck = [textMesh, textMesh2, textMesh3];
    
    // Check for intersections
    const intersects = raycaster.intersectObjects(meshesToCheck);

    // Reset all meshes to original color first
    meshesToCheck.forEach(mesh => 
      {
        if (mesh && mesh.material && !mesh.material.isAnimating) {
            gsap.to(mesh.material.color, {
                r: originalColor.r,
                g: originalColor.g,
                b: originalColor.b,
                duration: 0.3,
                onStart: () => { mesh.material.isAnimating = true; },
                onComplete: () => { mesh.material.isAnimating = false; }
            });
        }
    });

    // Change color of intersected mesh
    if (intersects.length > 0) {
        const intersectedMesh = intersects[0].object;
        if (intersectedMesh.material && !intersectedMesh.material.isAnimating) {
            gsap.to(intersectedMesh.material.color, {
                r: hoverColor.r,
                g: hoverColor.g,
                b: hoverColor.b,
                duration: 0.3,
                onStart: () => { intersectedMesh.material.isAnimating = true; },
                onComplete: () => { intersectedMesh.material.isAnimating = false; }
            });
        }
    }
}

// Call updateMeshMaterials after the font is loaded and meshes are created
const fontLoader = new FontLoader();

fontLoader.load(
    '/ObjectTextures/fonts/Jua_Regular.json',
    (font) => {
        // Your existing font loading code...
        
        // Add this at the end of the font loading callback
        updateMeshMaterials();
    },
    // ... rest of your font loading code
);









//controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxDistance= 40;
controls.minDistance = 1;
controls.minPolarAngle = Math.PI / 6;     
controls.maxPolarAngle = Math.PI / 2.1;
controls.enablePan = false;



// Adding the popup functionality

{
const popup = document.getElementById('popup');
const closePopupButton = document.getElementById('closePopup');
let popupActive = false;

// Show popup function
function showPopup() {
    popup.style.display = 'block';
    popupActive = true;
}

// Hide popup function
function hidePopup() {
    popup.style.display = 'none';
    popupActive = false;
    gsap.to(camera.position , {
      duration: 2,
      ease: "power1.inOut",
      x: 26.09,  //26.09,4.35,-10.87
      y: 8.70,  // Adjust camera offset if needed
      z: -10.87   // Adjust camera offset if needed
  });
}

// Close popup on button click
closePopupButton.addEventListener('click',(event)=>{
  event.stopPropagation();
  hidePopup()});


window.addEventListener('click', (event) => {
  if (popupActive && event.target !== popup && !popup.contains(event.target)) {
      hidePopup();
  }
});

// Show popup when "CONTACT" is clicked
function popUpClick(event) {
    if (popupActive) return;
    // Convert the mouse position to normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster
    raycaster.setFromCamera(mouse, camera);

    // Get the list of intersected objects
    const intersects = raycaster.intersectObjects(scene.children);

    // Show popup when clicking on the CONTACT text or cube
    if (intersects.length > 0 && (intersects[0].object === textMesh3 || intersects[0].object === clickCubeMail)) {
      setTimeout(() => {
        showPopup();
    }, 2000); 
    } else {
        // Handle other cases (e.g., move camera)
        // (keep the existing camera logic for other objects)
    }
}

window.addEventListener('click', popUpClick);

//----------------------------------------------//

function SendMail(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Fetch email and message values
  const name = document.getElementById('name').value;
  const message = document.getElementById('message').value;

  if (name && message) {
      emailjs.send('service_m65ip42', 'template_dba6f0n', {
          email_id: name,
          message: message
      })
      .then(() => {
          alert('Email sent successfully!');
          document.getElementById('emailForm').reset(); // Clear the form
      })
      .catch(error => {
          console.error('Error sending email:', error);
      });
  } else {
      alert('Please fill in all fields.');
  }
}

document.getElementById('emailForm').addEventListener('submit', (event) => {
  event.preventDefault();
  SendMail(event); // Call your send email function
});

}

//--------------------------------//

//---------About Me------------- //

{

  const aboutMe = document.getElementById('aboutMe');
  const aboutMeClose = document.getElementById('closeMe'); // Correct button ID

  // Show About Me function
  function showaboutMe() {
      aboutMe.style.display = 'block'; // Ensure the section is displayed
  }

  // Hide About Me function
  function hideaboutMe() {
      aboutMe.style.display = 'none'; 
      gsap.to(camera.position , {
        duration: 2,
        ease: "power1.inOut",
        x: 26.09,  //26.09,4.35,-10.87
        y: 8.70,  // Adjust camera offset if needed
        z: -10.87   // Adjust camera offset if needed
    });
  }

  aboutMe.addEventListener('click', (e) => e.stopPropagation());

  // Close About Me on button click
  aboutMeClose.addEventListener('click', hideaboutMe);

  // Close About Me when clicking outside the popup
  window.addEventListener('click', (e) => {
    // Close modal only if clicking outside the modal
    if (aboutMe.style.display === 'block' && !aboutMe.contains(e.target)) {
        hideaboutMe();
    }
  });


  // Show About Me when a specific element (like a button) is clicked
  function aboutMeClick(event) {
      // Update mouse coordinates
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Update raycaster
      raycaster.setFromCamera(mouse, camera);

      // Intersect objects
      const intersects = raycaster.intersectObjects(scene.children);

      // Show About Me section when clicking specific mesh
      if (intersects.length > 0 && intersects[0].object === textMesh || intersects[0].object === clickCubeMe) {
        setTimeout(() => {
          showaboutMe();
      }, 2000);  // Show the About Me popup
      }
  }

  // Add click listener for About Me
  window.addEventListener('click', aboutMeClick);

  //--------------------------------------//
  // -------Pictures transitions-------- //
  const images = [
    '/Menus/Your_paragraph_text/1.png',
    '/Menus/Your_paragraph_text/2.png',
    '/Menus/Your_paragraph_text/3.png'
  ];
  
  let currentIndex = 0; // Start with the first image

  // Get DOM elements
  const mainImage = document.getElementById('mainImage');
  const prevButton = document.querySelector('.prev');
  const nextButton = document.querySelector('.next');
  const closeButton = document.getElementById('closeMe');
  const aboutMe1 = document.getElementById('aboutMe');

  // Update the image based on the current index
  function updateImage() {
    mainImage.src = images[currentIndex];
  }

  // Go to the previous image
  prevButton.addEventListener('click', () => {
    // e.stopPropagation();
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
  });

  // Go to the next image
  nextButton.addEventListener('click', () => {
    // e.stopPropagation();
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
  });

  // Close the modal
  closeButton.addEventListener('click', () => {
    e.stopPropagation();
    aboutMe1.style.display = 'none';
  });
  
}

//--------------------------------//

//--------Projects----------//
{
  const projects = document.getElementById('projects');
  const ClosePj = document.getElementById('closePj'); // Correct button ID

  // Show About Me function
  function showPj() {
      projects.style.display = 'block'; // Ensure the section is displayed
  }

  // Hide About Me function
  function hidePj() {
      projects.style.display = 'none'; 
      gsap.to(camera.position , {
        duration: 2,
        ease: "power1.inOut",
        x: 26.09,  //26.09,4.35,-10.87
        y: 8.70,  // Adjust camera offset if needed
        z: -10.87   // Adjust camera offset if needed
    });
  }

  projects.addEventListener('click', (e) => e.stopPropagation());

  // Close About Me on button click
  ClosePj.addEventListener('click', hidePj);

  // Close About Me when clicking outside the popup
  window.addEventListener('click', (e) => {
    // Close modal only if clicking outside the modal
    if (projects.style.display === 'block' && !projects.contains(e.target)) {
        hidePj();
    }
  });

  // Show About Me when a specific element (like a button) is clicked
  function PjClick(event) {
      // Update mouse coordinates
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Update raycaster
      raycaster.setFromCamera(mouse, camera);

      // Intersect objects
      const intersects = raycaster.intersectObjects(scene.children);

      // Show About Me section when clicking specific mesh
      if (intersects.length > 0 && intersects[0].object === textMesh2 || intersects[0].object === clickCubePj) {
        setTimeout(() => {
          showPj();
      }, 2000);  
      }
  }

  // Add click listener for About Me
  window.addEventListener('click', PjClick);

  //--------------------------------------//
  // -------Pictures transitions-------- //
  const images = [
    '/Menus/Project_01/1.png',
    '/Menus/Project_01/2.png',
    '/Menus/Project_01/3.png',
    '/Menus/Project_01/4.png',
    '/Menus/Project_01/5.png'
  ];
  
  let currentIndex = 0; // Start with the first image

  // Get DOM elements
  const mainImagePj = document.getElementById('mainImagePj');
  const prevPj = document.querySelector('.prevPj');
  const nextPj = document.querySelector('.nextPj');
  const closePj = document.getElementById('closePj');
  const projects1 = document.getElementById('projects');

  // Update the image based on the current index
  function updateImage() {
    mainImagePj.src = images[currentIndex];
  }

  // Go to the previous image
  prevPj.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
  });

  // Go to the next image
  nextPj.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
  });

  // Close the modal
  closePj.addEventListener('click', () => {
    e.stopPropagation();
    projects1.style.display = 'none';
  });

}


// ------------------------//




//window resizeloop
window.addEventListener('resize',() => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

})



// renderloop();
const clock = new THREE.Clock();

const animate = () => {
    const elapsedTime = clock.getElapsedTime();
    controls.update();
    treeLight.intensity = LIGHT_INTENSITY.TREE + Math.sin(elapsedTime * 0.5) * 0.3; 
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}

// Start the animation loop
animate();





