const fileInput = document.querySelector(".file-input");
const filterOptions = document.querySelectorAll(".filter button");
const filterName = document.querySelector(".name");
const filterValue = document.querySelector(".value");
const filterSlider = document.querySelector(".slider input");
const rotateOptions = document.querySelectorAll(".rotate button");
const previewImage = document.querySelector(".preview-img img");
const resetFilterBtn = document.querySelector(".reset-filter");
const chooseImageBtn = document.querySelector(".choose-img");
const saveImageBtn = document.querySelector(".save-img");

let brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
let rotate = 0, horizontalFlip = 1, verticalFlip = 1;

const applyFilters = () => {
    previewImage.style.transform = `rotate(${rotate}deg) scale(${horizontalFlip}, ${verticalFlip})`;
    previewImage.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
};

const loadImage = () => {
    let file = fileInput.files[0]; // getting user selected file
    if(!file) return; // return if user hasn't selected file
    previewImage.src = URL.createObjectURL(file); // passing file url as preview img src
    previewImage.addEventListener("load", () => { // disable the warper container if image is not selected
        resetFilterBtn.click(); // clicking reset btn, so the filter value reset if the user select a new image
        document.querySelector(".container").classList.remove("disable");
    });
};


filterOptions.forEach(option => {
    option.addEventListener("click", () => { // adding click event listner to all filter buttons
        document.querySelector(".filter .active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;

        if(option.id === "brightness") {
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        } else if(option.id === "saturation") {
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;
        } else if(option.id === "inversion") {
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        } else if(option.id === "grayscale") {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    });
});

const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active"); // getting selected filter btn
    if(selectedFilter.id === "brightness") {
        brightness = filterSlider.value;
    } else if(selectedFilter.id === "saturation") {
        saturation = filterSlider.value;
    } else if(selectedFilter.id === "inversion") {
        inversion = filterSlider.value;
    } else if(selectedFilter.id === "grayscale") {
        grayscale = filterSlider.value;
    }

    applyFilters();
};

rotateOptions.forEach(option => {
    option.addEventListener("click", () => { // adding click event listner to rotate/flip buttons
        if(option.id === "left") {
            rotate -= 90; // left rotate by 90
        } else if(option.id === "right") {
            rotate += 90; // right rotate by 90
        } else if(option.id === "horizontal") {
            horizontalFlip = horizontalFlip === 1 ? -1 : 1; // flip image horizontally
        } else if(option.id === "vertical") {
            verticalFlip = verticalFlip === 1 ? -1 : 1; // flip image vertically
        }
        applyFilters();
    });

});

const resetFilter = () => {
    // Reset all variable value with default value.
    brightness = 100; saturation = 100; inversion = 0; grayscale = 0;
    rotate = 0; horizontalFlip = 1; verticalFlip = 1;
    filterOptions[0].click(); // Selecting brightnes button by default. 
    applyFilters();
};

const saveImage = () => {
    const canvas = document.createElement("canvas"); // Creating canvas element.
    const ctx = canvas.getContext("2d"); // canvas.getContext return a drawing context on the canvas.
    canvas.width = previewImage.naturalWidth; // setting canvas width to the actual image width
    canvas.height = previewImage.naturalHeight; // setting canvas width to the actual image height

    // Applying user selected filters to canvas filter
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2); // translating canvas from center
    if(rotate !== 0) { // if rotate value hasn't 0 rotate the canvas
        ctx.rotate(rotate * Math.PI / 180);
    }

    ctx.scale(horizontalFlip, verticalFlip); // flip canvas horizontally / vertically
    ctx.drawImage(previewImage, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    const link = document.createElement("a"); // creating a <a> element
    link.download = "image.png"; // passing <a> tag download value to "image.png"
    link.href = canvas.toDataURL() // passing <a> tag href value to canvas data url
    link.click(); // clicking <a> tag on the image downlaod
};


filterSlider.addEventListener("input", updateFilter);
fileInput.addEventListener("change", loadImage);
resetFilterBtn.addEventListener("click", resetFilter);
saveImageBtn.addEventListener("click", saveImage);
chooseImageBtn.addEventListener("click", () => fileInput.click());