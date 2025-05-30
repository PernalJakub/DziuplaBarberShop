const swiper = new Swiper('.swiper', {
  loop: false,
  centeredSlides: true,
  slidesPerView: 'auto',
  spaceBetween: 30,
  autoplay: {
    delay: 6000,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});
