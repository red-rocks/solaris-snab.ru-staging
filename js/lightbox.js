(function() {
  document.addEventListener("DOMContentLoaded", function() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxClose = document.getElementById("lightbox-close");

    function openLightbox(src) {
      lightboxImg.src = src;
      lightbox.style.display = "flex";
      document.body.style.overflow = "hidden"; // prevent scrolling
    }

    function closeLightbox() {
      lightbox.style.display = "none";
      lightboxImg.src = "";
      document.body.style.overflow = ""; // restore scrolling
    }

    document.querySelectorAll(".cert-lightbox").forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        openLightbox(link.href);
      });
    });

    lightboxClose.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", e => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Escape key support
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && lightbox.style.display === "flex") {
        closeLightbox();
      }
    });
  });
})();
