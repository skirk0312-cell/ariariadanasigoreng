// =========================
// WHATSAPP BUSINESS
// =========================

function openWhatsApp(message) {
    const phone = "6282254663027";
    const url = "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);
    window.open(url, "_blank");
}


// =========================
// INFO BANNER POPUP
// =========================

function openBanner(imageSrc) {
    const popup = document.getElementById("bannerPopup");
    const popupImage = document.getElementById("bannerPopupImage");

    if (!popup || !popupImage) return;

    popupImage.src = imageSrc;
    popup.classList.add("active");
    document.body.style.overflow = "hidden";
}


function closeBanner(event) {
    const popup = document.getElementById("bannerPopup");
    const popupImage = document.getElementById("bannerPopupImage");

    if (!popup) return;

    if (event && event.target !== event.currentTarget) {
        return;
    }

    popup.classList.remove("active");
    document.body.style.overflow = "";

    setTimeout(() => {
        if (popupImage) popupImage.src = "";
    }, 300);
}


// =========================
// PORTFOLIO POPUP
// =========================

function openPortfolio() {
    const popup = document.getElementById("portfolioPopup");
    const frame = document.getElementById("portfolioFrame");

    if (!popup || !frame) return;

    if (!frame.src || frame.src === window.location.href) {
        frame.src = "https://ariaport.vercel.app";
    }

    popup.classList.add("active");
    document.body.style.overflow = "hidden";
}


function closePortfolio(event) {
    const popup = document.getElementById("portfolioPopup");

    if (!popup) return;

    if (event && event.target !== event.currentTarget) {
        return;
    }

    popup.classList.remove("active");
    document.body.style.overflow = "";
}


// =========================
// PAIMON CONTACT MENU (DRAGGABLE & SNAP)
// =========================

document.addEventListener("DOMContentLoaded", function () {
    const paimonBtn = document.getElementById("paimonButton");
    const contactMenu = document.getElementById("contactMenu");
    const contactPanel = document.getElementById("contactPanel");
    const contactOverlay = document.getElementById("contactOverlay");

    if (!paimonBtn || !contactMenu) return;

    let isDragging = false;
    let hasDragged = false;
    let startX = 0;
    let initialLeft = 0;
    const paddingMargin = 18; // Jarak tepi dari layar

    // Fungsi Menutup Menu
    function closeContactMenu() {
        contactMenu.classList.remove("active");
        if (contactOverlay) contactOverlay.classList.remove("active");
        paimonBtn.setAttribute("aria-expanded", "false");
    }

    // --- FITUR DRAG (GESTURE / MOUSE) ---

    function onPointerDown(e) {
        // Jangan drag kalau menu sedang terbuka
        if (contactMenu.classList.contains("active")) return;

        isDragging = true;
        hasDragged = false;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        startX = clientX;

        // Ambil posisi Left saat ini
        const rect = contactMenu.getBoundingClientRect();
        initialLeft = rect.left;

        contactMenu.classList.remove("snap-animating");

        // Event listener saat digeser/dilepas
        window.addEventListener("mousemove", onPointerMove);
        window.addEventListener("mouseup", onPointerUp);
        window.addEventListener("touchmove", onPointerMove, { passive: false });
        window.addEventListener("touchend", onPointerUp);
    }

    function onPointerMove(e) {
        if (!isDragging) return;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const deltaX = clientX - startX;

        // Jika digeser lebih dari 5px, anggap sedang drag (bukan klik biasa)
        if (Math.abs(deltaX) > 5) {
            hasDragged = true;
            if (e.cancelable) e.preventDefault(); // Mencegah scroll layar saat geser
        }

        let newLeft = initialLeft + deltaX;

        // Batasi geseran agar tidak keluar layar
        const maxLeft = window.innerWidth - contactMenu.offsetWidth - paddingMargin;
        if (newLeft < paddingMargin) newLeft = paddingMargin;
        if (newLeft > maxLeft) newLeft = maxLeft;

        contactMenu.style.left = newLeft + "px";
        contactMenu.style.right = "auto";
    }

    function onPointerUp() {
        if (!isDragging) return;
        isDragging = false;

        window.removeEventListener("mousemove", onPointerMove);
        window.removeEventListener("mouseup", onPointerUp);
        window.removeEventListener("touchmove", onPointerMove);
        window.removeEventListener("touchend", onPointerUp);

        if (hasDragged) {
            // Logika Snap to Edge (Kiri / Kanan)
            const rect = contactMenu.getBoundingClientRect();
            const currentX = rect.left + rect.width / 2;
            const screenMiddle = window.innerWidth / 2;

            contactMenu.classList.add("snap-animating");

            if (currentX < screenMiddle) {
                // Snap ke KIRI
                contactMenu.style.left = paddingMargin + "px";
                contactMenu.classList.remove("snap-right");
                contactMenu.classList.add("snap-left");
            } else {
                // Snap ke KANAN
                const rightPos = window.innerWidth - rect.width - paddingMargin;
                contactMenu.style.left = rightPos + "px";
                contactMenu.classList.remove("snap-left");
                contactMenu.classList.add("snap-right");
            }
        }
    }

    // Pasang Event Dragging pada Tombol Paimon
    paimonBtn.addEventListener("mousedown", onPointerDown);
    paimonBtn.addEventListener("touchstart", onPointerDown, { passive: true });

    // --- FITUR KLIK MENU ---

    paimonBtn.addEventListener("click", function (e) {
        e.stopPropagation();

        // Jika tombol baru saja digeser, batalkan trigger klik
        if (hasDragged) {
            hasDragged = false;
            return;
        }

        const isActive = contactMenu.classList.toggle("active");

        if (contactOverlay) {
            contactOverlay.classList.toggle("active", isActive);
        }

        paimonBtn.setAttribute("aria-expanded", String(isActive));
    });

    // Prevent click inside panel from closing menu
    if (contactPanel) {
        contactPanel.addEventListener("click", function (e) {
            e.stopPropagation();
        });
    }

    // Close when clicking overlay
    if (contactOverlay) {
        contactOverlay.addEventListener("click", function () {
            closeContactMenu();
        });
    }

    // Close when clicking outside
    document.addEventListener("click", function (e) {
        if (contactMenu.classList.contains("active")) {
            if (!contactMenu.contains(e.target)) {
                closeContactMenu();
            }
        }
    });

    // Adjust Snap Position on Window Resize
    window.addEventListener("resize", function () {
        if (contactMenu.classList.contains("snap-left")) {
            contactMenu.style.left = paddingMargin + "px";
        } else {
            const rect = contactMenu.getBoundingClientRect();
            const rightPos = window.innerWidth - rect.width - paddingMargin;
            contactMenu.style.left = rightPos + "px";
        }
    });

    // =========================
    // GLOBAL ESC KEY HANDLER
    // =========================
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            closeBanner();
            closePortfolio();
            closeContactMenu();
        }
    });
});
