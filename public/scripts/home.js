let currentPage = location.pathname
const formattedCurrentPage = currentPage.replace(/(\/)([0-9])([0-9])/g,"")

const menuItems = document.querySelectorAll('header .home-header-links a')

for (item of menuItems) {
  if (formattedCurrentPage ==  item.getAttribute('href')) {
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