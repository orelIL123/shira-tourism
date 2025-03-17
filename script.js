document.addEventListener("DOMContentLoaded", function () {
    console.log("📢 DOM Loaded - הסקריפט עובד!");

    // טיפול בכפתור המבורגר
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", function () {
            navLinks.classList.toggle("active");
            hamburger.classList.toggle("active");
            console.log("📢 כפתור ההמבורגר נלחץ!");
        });
    } else {
        console.warn("⚠️ כפתור ההמבורגר או התפריט לא נמצאו ב-HTML.");
    }

    // פונקציות נוספות שהיו בקוד המקורי שלך
    function showExitPopup() {
        const exitPopup = document.querySelector(".exit-popup-overlay");
        if (exitPopup) {
            exitPopup.style.display = "flex";
            document.body.style.overflow = "hidden";
        } else {
            console.warn("⚠️ תיבת היציאה לא נמצאה.");
        }
    }

    function hideExitPopup() {
        const exitPopup = document.querySelector(".exit-popup-overlay");
        if (exitPopup) {
            exitPopup.style.display = "none";
            document.body.style.overflow = "";
        }
    }

    const exitPopupForm = document.querySelector(".exit-popup form");
    if (exitPopupForm) {
        exitPopupForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            console.log("📧 אימייל שנשלח: ", email);
            alert("✔️ תודה! מייל נשלח בהצלחה.");
            hideExitPopup();
        });
    }

    // *** טעינת מודל 3D ***
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const loader = new THREE.GLTFLoader();

    // ודא שהנתיב למודל תואם למיקום הקובץ בגיטהאב
    loader.load('./models/plane3d.glb', function (gltf) {
        scene.add(gltf.scene);
        console.log("✔️ מודל נטען בהצלחה!");
    }, undefined, function (error) {
        console.error("❌ שגיאה בטעינת המודל: ", error);
    });

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
});
