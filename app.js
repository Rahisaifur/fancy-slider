const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];

const displayMessage = message => {
  document.getElementById('message').innerText = message;
}



// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key

const KEY = '20273072-3c8e622e31957773f44642eac';

// show images 
const showImages = (images) => {
  if (images.length > 0) {
    hideSpinner()
    imagesArea.style.display = 'block';
    gallery.innerHTML = '';
    // show gallery title
    galleryHeader.style.display = 'flex';
    images.forEach(image => {
      let div = document.createElement('div');
      div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
      div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
      gallery.appendChild(div)
    })
  } else {
    hideSpinner()
    displayMessage('No image found')
  }
}

const getImages = (query) => {
  fetch(`https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo`)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(err => console.log(err))
}

const showSpinner = () => {
  document.getElementById('spinnerDiv').classList.remove('d-none')
  document.getElementById('spinnerDiv').classList.add('d-flex')
}

const hideSpinner = () => {
  document.getElementById('spinnerDiv').classList.remove('d-flex')
  document.getElementById('spinnerDiv').classList.add('d-none')
}

const updateImageCounter = val => {
  const container = document.getElementById('selectedImages')
  container.innerText = val
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;

  let item = sliders.indexOf(img);
  if (item == -1) {
    sliders.push(img);
    element.classList.add('added');
  } else {
    sliders = sliders.filter(data => data !== img);
    element.classList.remove('added');
  }
  updateImageCounter(sliders.length)
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    displayMessage('Select at least 2 image.')
    return;
  }
  const duration = parseInt(document.getElementById('duration').value) || 1000;
  if (duration < 0) {
    displayMessage("Please input a number greater than 0")
    return false;
  }
  displayMessage("")
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';

  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchForm.addEventListener('submit', function (e) {
  e.preventDefault()
  document.querySelector('.main').style.display = 'none';
  document.querySelector('.images').style.display = 'none'
  clearInterval(timer);
  let msg = ''
  const search = document.getElementById('search');
  if (search.value == '') {
    msg = 'Please input image name'
    displayMessage(msg)
    return false
  }
  updateImageCounter('0')
  displayMessage(msg)
  showSpinner()
  getImages(search.value)
  search.value = ''
  sliders.length = 0;
})

sliderBtn.addEventListener('click', function () {
  createSlider()
})