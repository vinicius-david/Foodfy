const currentPage = location.pathname
const menuItems = document.querySelectorAll('header .header-links a')

for (item of menuItems) {
  if (currentPage ==  item.getAttribute('href')) {
    item.classList.add('active')
  }
}

const ImageGallery = {
  highlight: document.querySelector('.gallery .highlight > img'),
  previews: document.querySelectorAll('.gallery-preview img'),
  setImage(e) {
    const { target } = e

    ImageGallery.previews.forEach(preview => preview.classList.remove('active'))

    target.classList.add('active')

    ImageGallery.highlight.src = target.src
  }
};