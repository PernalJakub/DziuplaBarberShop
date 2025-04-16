// JS slider-section & card-section

document.addEventListener("DOMContentLoaded", () => {
  initSliderSection();
  initCardSection();

  const intro = document.querySelector("#intro-animation");
  if (intro) {
    setTimeout(() => {
      intro.style.display = "none";
      intro.style.pointerEvents = "none";
      intro.style.zIndex = "-1";
      document.body.classList.add("fade-in-ready");
    }, 5000);
  }
});

function initSliderSection() {
  const root = document.querySelector(".hero-section");
  if (!root) return;

  const track = root.querySelector("#track");
  const dots = root.querySelector("#dots");
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (isTouchDevice) {
    root.querySelectorAll(".arrow").forEach(arrow => {
      arrow.style.display = "none";
    });
  }

  const cards = track.children;
  const total = cards.length;
  let current = 1;
  const firstReal = 1;
  const lastReal = total - 2;

  const updateSlider = () => {
    const container = root.querySelector('.slider-container');
    const containerWidth = container.offsetWidth;
    const card = cards[current];
    const cardLeftInTrack = card.offsetLeft;
    const translateX = cardLeftInTrack - (containerWidth - card.offsetWidth) / 2;

    track.style.transform = `translateX(-${translateX}px)`;

    root.querySelectorAll(".arrow.left").forEach(btn => btn.disabled = current === firstReal);
    root.querySelectorAll(".arrow.right").forEach(btn => btn.disabled = current === lastReal);

    root.querySelectorAll(".card").forEach((card, index) => {
      const leftArrow = card.querySelector(".arrow.left");
      const rightArrow = card.querySelector(".arrow.right");

      if (!isTouchDevice) {
        if (index === current) {
          if (leftArrow) leftArrow.style.display = current === firstReal ? "none" : "flex";
          if (rightArrow) rightArrow.style.display = current === lastReal ? "none" : "flex";
        } else {
          if (leftArrow) leftArrow.style.display = "none";
          if (rightArrow) rightArrow.style.display = "none";
        }
      }
    });

    dots.innerHTML = "";
    for (let i = firstReal; i <= lastReal; i++) {
      const dot = document.createElement("div");
      dot.className = "dot" + (i === current ? " active" : "");
      dot.addEventListener("click", () => {
        current = i;
        updateSlider();
      });
      dots.appendChild(dot);
    }
  };

  let lastClickTime = 0;
  const CLICK_DELAY = 500;

  root.querySelectorAll(".card .arrow.left").forEach(btn => {
    btn.addEventListener("click", () => {
      const now = Date.now();
      if (now - lastClickTime < CLICK_DELAY) return;
      lastClickTime = now;
      if (current > firstReal) {
        current--;
        updateSlider();
      }
    });
  });

  root.querySelectorAll(".card .arrow.right").forEach(btn => {
    btn.addEventListener("click", () => {
      const now = Date.now();
      if (now - lastClickTime < CLICK_DELAY) return;
      lastClickTime = now;
      if (current < lastReal) {
        current++;
        updateSlider();
      }
    });
  });

  let autoplayInterval = null;

  const startAutoplay = () => {
    if (window.innerWidth < 991) return;
    if (autoplayInterval !== null) return;
    autoplayInterval = setInterval(() => {
      current = current < lastReal ? current + 1 : firstReal;
      updateSlider();
    }, 10000);
  };

  const stopAutoplay = () => {
    if (autoplayInterval !== null) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  };

  function enableTouchSwipe() {
    if (window.innerWidth >= 992) return;

    let startX = 0;
    let isDragging = false;

    track.addEventListener("touchstart", (e) => {
      e.preventDefault();
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: false });

    track.addEventListener("touchmove", (e) => {
      e.preventDefault();
      if (!isDragging) return;
      const currentX = e.touches[0].clientX;
      const diffX = startX - currentX;

      if (Math.abs(diffX) > 50) {
        if (diffX > 0 && current < lastReal) {
          current++;
          updateSlider();
        } else if (diffX < 0 && current > firstReal) {
          current--;
          updateSlider();
        }
        isDragging = false;
      }
    }, { passive: false });

    track.addEventListener("touchend", () => {
      isDragging = false;
    });
  }

  const container = root.querySelector('.slider-container');
  const containerWidth = container.offsetWidth;
  const card = cards[1];
  const cardLeftInTrack = card.offsetLeft;
  const translateX = cardLeftInTrack - (containerWidth - card.offsetWidth) / 2;

  track.style.transition = "none";
  track.style.transform = `translateX(-${translateX}px)`;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      track.style.transition = "transform 0.5s ease-in-out";
      updateSlider();

      setTimeout(() => {
        root.querySelectorAll(".fade-lock").forEach(el => el.classList.remove("fade-lock"));
        if (window.innerWidth > 991) {
          startAutoplay();
        } else {
          enableTouchSwipe();
        }
      }, 5000);
    });
  });

  const hoverTarget = root;
  if (hoverTarget) {
    hoverTarget.addEventListener("mouseenter", () => stopAutoplay());
    hoverTarget.addEventListener("mouseleave", () => startAutoplay());
  }

  function enableResizeCentering(isActive) {
    const section = root.querySelector(".slider-section");
    const container = root.querySelector(".slider-container");
    const track = root.querySelector(".card-track");

    if (isActive) {
      section.style.margin = "0 auto";
      container.style.margin = "0 auto";
      track.style.margin = "0 auto";
      track.style.transition = "none";
    } else {
      section.style.margin = "";
      container.style.margin = "";
      track.style.margin = "";
      track.style.transition = "transform 0.5s ease-in-out";
    }
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    enableResizeCentering(true);
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      enableResizeCentering(false);
      updateSlider();
    }, 300);
  });

  let previousContainerWidth = document.body.offsetWidth;
  setInterval(() => {
    const currentContainerWidth = document.body.offsetWidth;
    if (currentContainerWidth !== previousContainerWidth) {
      const container = root.querySelector('.slider-container');
      const containerWidth = container.offsetWidth;
      const card = cards[current];
      const cardLeftInTrack = card.offsetLeft;
      const translateX = cardLeftInTrack - (containerWidth - card.offsetWidth) / 2;
      track.style.transform = `translateX(-${translateX}px)`;

      requestAnimationFrame(() => {
        updateSlider();
        previousContainerWidth = currentContainerWidth;
      });
    }
  }, 350);
}

function initCardSection() {
  const root = document.querySelector(".card-section");
  if (!root) return;

  const track = root.querySelector(".card-track");
  const leftArrow = root.querySelector(".cs-arrow.left");
  const rightArrow = root.querySelector(".cs-arrow.right");
  const cards = track.querySelectorAll(".card");
  const container = root.querySelector(".card-container");
  const maxIndex = cards.length - 3;
  let currentIndex = 0;

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (isTouchDevice) {
    root.querySelectorAll('.cs-arrow').forEach(arrow => {
      arrow.style.display = 'none';
    });
    root.querySelectorAll('.card').forEach(card => {
      card.classList.add('no-hover');
    });
  }

  const getScrollAmount = () => {
    const card = track.querySelector(".card");
    const gap = parseInt(window.getComputedStyle(track).gap) || 0;
    return card.offsetWidth + gap;
  };

  const isDesktop = () => window.innerWidth >= 992;

  const centerCard = (index) => {
    const card = cards[index];
    const offset = card.offsetLeft;
    track.style.transform = `translateX(-${offset}px)`;
  };

  leftArrow.addEventListener("click", () => {
    if (isDesktop()) {
      if (currentIndex > 0) currentIndex--;
      centerCard(currentIndex);
    } else {
      track.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
    }
  });

  rightArrow.addEventListener("click", () => {
    if (isDesktop()) {
      if (currentIndex < maxIndex) currentIndex++;
      centerCard(currentIndex);
    } else {
      track.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
    }
  });

  if (isDesktop()) {
    centerCard(currentIndex);
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (isDesktop()) {
        currentIndex = 0;
        centerCard(currentIndex);
      }
    }, 300);
  });

  setTimeout(() => {
    root.querySelectorAll('.fade-in-item').forEach(el => {
      el.style.animationPlayState = 'running';
    });
  }, 5200);

  root.querySelectorAll('.card-button').forEach(button => {
    button.addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      if (!card) return;

      card.classList.toggle('expanded');
      const media = card.querySelector('.card-media');
      if (card.classList.contains('expanded')) {
        media.style.backgroundColor = 'white';
        media.style.backgroundImage = "url('https://source.unsplash.com/400x400/?barber,style')";
        media.style.backgroundSize = 'cover';
        media.style.backgroundPosition = 'center';
      } else {
        media.style.backgroundColor = '';
        media.style.backgroundImage = '';
      }
      card.classList.toggle('no-hover');

      const mainBtn = card.querySelector('.card-main-row .card-button');
      if (mainBtn && mainBtn.textContent.trim() === 'więcej') {
        mainBtn.textContent = 'mniej';
        mainBtn.style.backgroundColor = 'transparent';
        mainBtn.style.border = '1px solid var(--neutral-white)';
        mainBtn.style.color = 'white';
      } else if (mainBtn) {
        mainBtn.textContent = 'więcej';
        mainBtn.style.backgroundColor = 'var(--neutral-white)';
        mainBtn.style.border = 'none';
        mainBtn.style.color = 'black';
      }
    });
  });
}