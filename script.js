import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// יצירת סצנה
let scene, camera, renderer, plane;
let dealScenes = [], dealRenderers = [], dealObjects = [];

window.addEventListener('DOMContentLoaded', () => {
    initPlaneAnimation();
    initDealIcons();
});

// *** תיקון: בדיקת קיום אלמנט לפני הפעלת קוד ***
function initPlaneAnimation() {
    const container = document.getElementById('plane-animation');
    if (!container) {
        console.error('❌ Plane animation container not found!');
        return;
    }

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 500 / 500, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(500, 500);
    renderer.setPixelRatio(window.devicePixelRatio);

    container.appendChild(renderer.domElement);

    // הוספת תאורה
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // טעינת מודל המטוס
    loadPlaneModel();

    camera.position.z = 5;
}

// *** תיקון: ווידוא שהנתיב נכון ושקובץ ה-GLB נמצא ***
function loadPlaneModel() {
    const loader = new GLTFLoader();
    const modelPath = './models/plane3d.glb';

    console.log('🛠️ מנסה לטעון את המודל מ:', modelPath);
    
    loader.load(
        modelPath,
        function (gltf) {
            plane = gltf.scene;
            scene.add(plane);
            
            plane.scale.set(2, 2, 2);  // הגדלה
            plane.position.set(0, 0, -2);

            console.log('✅ המודל נטען בהצלחה!');
            animate();
        },
        function (xhr) {
            console.log(`⏳ ${xhr.loaded / xhr.total * 100}% נטען`);
        },
        function (error) {
            console.error('❌ שגיאה בטעינת המודל:', error);
            console.error('🔎 בדוק אם הקובץ נמצא כאן:', modelPath);
        }
    );
}

// *** אנימציה של הגלילה נשארת ללא שינוי ***
let scrollPercent = 0;
window.addEventListener('scroll', () => {
    const heightToScroll = document.documentElement.scrollHeight - window.innerHeight;
    scrollPercent = window.scrollY / heightToScroll;
});

function animate() {
    requestAnimationFrame(animate);
    
    if (plane) {
        plane.rotation.y = scrollPercent * Math.PI * 2;
        plane.rotation.x = Math.sin(scrollPercent * Math.PI) * 0.3;
        plane.position.y = Math.sin(scrollPercent * Math.PI * 2) * 0.5;
    }
    
    renderer.render(scene, camera);
}

// *** תיקון: בדיקת קיום אלמנטים לפני הפעלת קוד ***
window.addEventListener('resize', () => {
    if (camera && renderer) {
        const width = Math.min(500, window.innerWidth * 0.4);
        const height = width;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }
});

// *** תיקון: ווידוא שקיימים אלמנטים לפני ניסיון להפעיל אותם ***
function initDealIcons() {
    const dealContainers = document.querySelectorAll('.deal-3d-icon');
    
    if (dealContainers.length === 0) {
        console.warn("⚠️ לא נמצאו אלמנטים עם .deal-3d-icon");
        return;
    }

    dealContainers.forEach((container, index) => {
        const scene = new THREE.Scene();
        dealScenes.push(scene);
        
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        camera.position.z = 2;
        
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(60, 60);
        container.appendChild(renderer.domElement);
        dealRenderers.push(renderer);
        
        const geometry = new THREE.BoxGeometry(1, 1, 1, 4, 4, 4);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x3498db,
            specular: 0x555555,
            shininess: 30
        });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        dealObjects.push(cube);
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 1, 1);
        scene.add(directionalLight);
    });

    animateDealIcons();
}

// *** תיקון: ווידוא שהאלמנטים קיימים לפני שמנסים לשנות אותם ***
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileNavToggle && navLinks) {
    mobileNavToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !e.target.closest('.nav-links') && 
            !e.target.closest('.mobile-nav-toggle')) {
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
} else {
    console.warn("⚠️ תפריט הניווט לא נמצא");
}

// *** תיקון: ווידוא שטעינת המודל לא נכשלת ***
if (!THREE || !GLTFLoader) {
    console.error("❌ Three.js או GLTFLoader לא נטענו כראוי!");
}
