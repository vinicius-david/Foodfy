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

const PhotosUpload = {
  input: "",
  preview: document.querySelector('#photos-preview'),
  uploadLimit: 5,
  files: [],
  handleFileInput(event) {
    const { files: fileList } = event.target
    PhotosUpload.input = event.target

    if (PhotosUpload.hasLimit(event)) return

    Array.from(fileList).forEach(file => {

      PhotosUpload.files.push(file)

      const reader = new FileReader()

      reader.onload = () => {
        const image = new Image()
        image.src = String(reader.result)

        const div = PhotosUpload.getContainer(image)

        PhotosUpload.preview.appendChild(div)
      }

      reader.readAsDataURL(file)
    })

    PhotosUpload.input.files = PhotosUpload.getAllFiles()
  },
  hasLimit(event) {
    const { uploadLimit, input, preview } = PhotosUpload
    const { files: fileList } = input

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} fotos`)
      event.preventDefault()
      return true
    }

    const photosDiv = []
    preview.childNodes.forEach(item => {
      if (item.classList && item.classList.value == 'photo')
        photosDiv.push(item)
    })

    const totalPhotos = fileList.length + photosDiv.length
    if (totalPhotos > uploadLimit) {
      alert(`O limite de ${uploadLimit} fotos foi ultrapassado`)
      event.preventDefault()
      return true
    }

    return false
  },
  getAllFiles() {

    const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

    PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

    return dataTransfer.files
  },
  getContainer(image) {

    const div = document.createElement('div')

    div.classList.add('photo')
    div.onclick = PhotosUpload.removePhoto
    div.appendChild(image)

    div.appendChild(PhotosUpload.getRemoveButton())

    return div
  },
  getRemoveButton() {

    const button = document.createElement('i')

    button.classList.add('material-icons')
    button.innerHTML = 'close'

    return button
  },
  removePhoto(event) {

    const photoDiv = event.target.parentNode
    const photosArray = Array.from(PhotosUpload.preview.children)
    const index = photosArray.indexOf(photoDiv)

    PhotosUpload.files.splice(index, 1)

    PhotosUpload.input.files = PhotosUpload.getAllFiles()

    photoDiv.remove()
  },
  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode

    if (photoDiv.id) {
      const removedFiles = document.querySelector("input[name='removed_files']")

      if (removedFiles) {
        removedFiles.value += `${photoDiv.id},`
      }
    }

    photoDiv.remove()
  },
};

const chefPhotoUpload = {
  input: "",
  preview: document.querySelector('#chef-photos-preview'),
  uploadLimit: 1,
  files: [],
  handleFileInput(event) {
    const { files: fileList } = event.target
    chefPhotoUpload.input = event.target

    if (chefPhotoUpload.hasLimit(event)) return

    Array.from(fileList).forEach(file => {

      chefPhotoUpload.files.push(file)

      const reader = new FileReader()

      reader.onload = () => {
        const image = new Image()
        image.src = String(reader.result)

        const div = chefPhotoUpload.getContainer(image)

        chefPhotoUpload.preview.appendChild(div)
      }

      reader.readAsDataURL(file)
    })

    chefPhotoUpload.input.files = chefPhotoUpload.getAllFiles()
  },
  hasLimit(event) {
    const { uploadLimit, input, preview } = chefPhotoUpload
    const { files: fileList } = input

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} fotos`)
      event.preventDefault()
      return true
    }

    const photosDiv = []
    preview.childNodes.forEach(item => {
      if (item.classList && item.classList.value == 'photo')
        photosDiv.push(item)
    })

    const totalPhotos = fileList.length + photosDiv.length
    if (totalPhotos > uploadLimit) {
      alert(`O limite de ${uploadLimit} fotos foi ultrapassado`)
      event.preventDefault()
      return true
    }

    return false
  },
  getAllFiles() {

    const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

    chefPhotoUpload.files.forEach(file => dataTransfer.items.add(file))

    return dataTransfer.files
  },
  getContainer(image) {

    const div = document.createElement('div')

    div.classList.add('photo')
    div.onclick = chefPhotoUpload.removePhoto
    div.appendChild(image)

    div.appendChild(chefPhotoUpload.getRemoveButton())

    return div
  },
  getRemoveButton() {

    const button = document.createElement('i')

    button.classList.add('material-icons')
    button.innerHTML = 'close'

    return button
  },
  removePhoto(event) {

    const photoDiv = event.target.parentNode
    const photosArray = Array.from(chefPhotoUpload.preview.children)
    const index = photosArray.indexOf(photoDiv)

    chefPhotoUpload.files.splice(index, 1)

    chefPhotoUpload.input.files = chefPhotoUpload.getAllFiles()

    photoDiv.remove()
  },
  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode

    if (photoDiv.id) {
      const removedFiles = document.querySelector("input[name='removed_files']")

      if (removedFiles) {
        removedFiles.value += `${photoDiv.id},`
      }
    }

    photoDiv.remove()
  },
};

const Validate = {
  apply(input, func) {

    Validate.clearErrors(input)

    let results = Validate[func](input.value)
    input.value = results.value

    if (results.error) {
      Validate.displayError(input, results.error)
    }
  },
  displayError(input, error) {

    const div = document.createElement('div')
    div.classList.add('error')
    div.innerHTML = error
    input.parentNode.appendChild(div)
    input.focus()

  },
  clearErrors(input) {

    const errorDiv = input.parentNode.querySelector('.error')
    if (errorDiv)
      errorDiv.remove()

  },
  isEmail(value) {
    let error = null
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if (!value.match(mailFormat))
      error = "Email inválido"

    return {
      error,
      value
    }
  },
}