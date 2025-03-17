import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// יצירת סצנה
let scene, camera, renderer, plane;
let dealScenes = [], dealRenderers = [], dealObjects = [];

window.addEventListener('DOMContentLoaded', () => {
    initPlaneAnimation();
    initDealIcons();
});

function initPlaneAnimation() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 500 / 500, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(500, 500);
    renderer.setPixelRatio(window.devicePixelRatio);

    const container = document.getElementById('plane-animation');
    if (!container) {
        console.error('❌ Plane animation container not found!');
        return;
    }
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

// טעינת מודל המטוס עם הנתיב החדש
function loadPlaneModel() {
    const loader = new GLTFLoader();
    const modelPath = './models/plane3d.glb';

    console.log('🛠️ מנסה לטעון את המודל מ:', modelPath);
    
    loader.load(
        modelPath,
        function (gltf) {
            plane = gltf.scene;
            scene.add(plane);
            
            // התאמת גודל ומיקום המטוס - הגדלת המודל
            plane.scale.set(2, 2, 2);  // הגדלת המודל פי 4
            plane.position.set(0, 0, -2);  // הזזה קדימה כדי שיהיה יותר בולט
            
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

// אנימציה על פי גלילה
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

// Handle window resize
window.addEventListener('resize', () => {
    if (camera && renderer) {
        const width = Math.min(500, window.innerWidth * 0.4);
        const height = width;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }
});

// Initialize deal icons
function initDealIcons() {
    const dealContainers = document.querySelectorAll('.deal-3d-icon');
    
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

// Animate deal icons
function animateDealIcons() {
    requestAnimationFrame(animateDealIcons);
    
    dealObjects.forEach((cube, index) => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        dealRenderers[index].render(dealScenes[index], camera);
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission handling
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        console.log('Form submitted:', formObject);
        alert('תודה! הודעתך התקבלה. נחזור אליך בהקדם.');
        this.reset();
    });
}

// Add scroll event listener for header
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // Scroll Down
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // Scroll Up
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Reviews Slider
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.reviews-slider');
    const cards = document.querySelectorAll('.review-card');
    const prevBtn = document.querySelector('.prev-review');
    const nextBtn = document.querySelector('.next-review');
    let currentIndex = 0;
    let isAnimating = false;

    function updateSlider() {
        if (isAnimating) return;
        isAnimating = true;

        // Remove active class from all cards
        cards.forEach(card => card.classList.remove('active'));
        
        // Add active class to current card with a slight delay
        setTimeout(() => {
            cards[currentIndex].classList.add('active');
        }, 50);

        // Calculate the translation
        const offset = currentIndex * -100;
        slider.style.transform = `translateX(${offset}%)`;
        
        // Reset animation flag after transition completes
        setTimeout(() => {
            isAnimating = false;
        }, 800); // Match this with the CSS transition duration
    }

    function showNext() {
        if (isAnimating) return;
        currentIndex = (currentIndex + 1) % cards.length;
        updateSlider();
    }

    function showPrev() {
        if (isAnimating) return;
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateSlider();
    }

    // Event listeners
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    // Initialize first card
    cards[currentIndex].classList.add('active');

    // Auto slide every 7 seconds (increased from 5 to give more reading time)
    let autoSlideInterval = setInterval(showNext, 7000);

    // Pause auto-slide on hover
    slider.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });

    // Resume auto-slide when mouse leaves
    slider.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(showNext, 7000);
    });

    // Handle touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    slider.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50; // minimum distance for a swipe
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                showNext();
            } else {
                showPrev();
            }
        }
    }
});

// Enhanced Team Member Animations
const teamMembers = document.querySelectorAll('.team-member');

teamMembers.forEach(member => {
    member.addEventListener('mouseenter', () => {
        member.querySelector('.member-image').style.transform = 'scale(1.1) rotate(5deg)';
    });

    member.addEventListener('mouseleave', () => {
        member.querySelector('.member-image').style.transform = 'scale(1) rotate(0deg)';
    });
});

// Scroll Animations for all elements
const scrollObserverOptions = {
    threshold: 0.1
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            scrollObserver.unobserve(entry.target);
        }
    });
}, scrollObserverOptions);

// Observe elements for animation
document.querySelectorAll('.deal-card, .category-card, .destination-card, .team-member, .review-card').forEach(el => {
    scrollObserver.observe(el);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('#hero');
    const scrolled = window.pageYOffset;
    hero.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
});

// Exit Popup Functionality
document.addEventListener('DOMContentLoaded', function() {
    const exitPopup = document.querySelector('.exit-popup-overlay');
    const closePopupBtn = document.querySelector('.close-popup');
    const exitPopupForm = document.querySelector('.exit-popup-form');
    let hasShownPopup = false;

    // Show popup when mouse leaves the window
    document.addEventListener('mouseleave', function(e) {
        if (e.clientY <= 0 && !hasShownPopup) {
            showExitPopup();
        }
    });

    // Close popup when clicking close button
    closePopupBtn.addEventListener('click', function() {
        hideExitPopup();
    });

    // Close popup when clicking outside
    exitPopup.addEventListener('click', function(e) {
        if (e.target === exitPopup) {
            hideExitPopup();
        }
    });

    // Handle form submission
    exitPopupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        // Here you would typically send the email to your server
        console.log('Email submitted:', email);
        alert('תודה! נשלח אליך עדכונים על הדילים הכי שווים!');
        hideExitPopup();
        hasShownPopup = true;
    });

    function showExitPopup() {
        exitPopup.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function hideExitPopup() {
        exitPopup.style.display = 'none';
        document.body.style.overflow = '';
    }
}); 
