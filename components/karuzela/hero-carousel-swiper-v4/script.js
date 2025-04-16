const swiper = new Swiper('.swiper', {
  slidesPerView: 'auto',
  spaceBetween: 32,
  centeredSlides: true,
  loop: false,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});
