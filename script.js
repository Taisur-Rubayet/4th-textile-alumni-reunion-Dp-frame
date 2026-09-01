const upload = document.getElementById('upload');
const preview = document.getElementById('preview');
const previewContainer = document.getElementById('previewContainer');
const cropBtn = document.getElementById('cropBtn');
const downloadBtn = document.getElementById('downloadBtn');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const captionContainer = document.getElementById('captionContainer');
const captionTextDiv = document.getElementById('captionText');
const copyCaptionBtn = document.getElementById('copyCaptionBtn');

let cropper;

// Frame image
const frame = new Image();
frame.src = "DP FRAME-01.png"; // same folder

upload.addEventListener('change', e => {
  const file = e.target.files[0];
  if(!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    preview.src = reader.result;
    previewContainer.style.display = 'block';
    if(cropper) cropper.destroy();
    cropper = new Cropper(preview, { aspectRatio:1, viewMode:1, autoCropArea:1, responsive:true });
    cropBtn.style.display = 'inline-block';
    downloadBtn.style.display = 'none';
    captionContainer.style.display = 'none';
  };
  reader.readAsDataURL(file);
});

// Crop & Apply Frame
cropBtn.addEventListener('click', () => {
  if(!cropper) return;

  const croppedCanvas = cropper.getCroppedCanvas({ width:1080, height:1080 });

  function finalize() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // White background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw cropped photo
  ctx.drawImage(
    croppedCanvas,
    0,
    0,
    canvas.width,
    canvas.height
  );

  // Draw frame while removing black background
  const frameCanvas = document.createElement("canvas");
  frameCanvas.width = canvas.width;
  frameCanvas.height = canvas.height;

  const frameCtx = frameCanvas.getContext("2d");
  frameCtx.drawImage(
    frame,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const imageData = frameCtx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  );

  const data = imageData.data;

  // Make black background transparent
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (r < 25 && g < 25 && b < 25) {
      data[i + 3] = 0;
    }
  }

  frameCtx.putImageData(imageData, 0, 0);

  // Draw transparent frame over photo
  ctx.drawImage(
    frameCanvas,
    0,
    0,
    canvas.width,
    canvas.height
  );

  // Update preview
  preview.src = canvas.toDataURL("image/png");

  cropBtn.style.display = "none";
  downloadBtn.style.display = "inline-block";

  // Show caption
  captionTextDiv.innerHTML = `
    DIU Textile Alumni 4th Mega Reunion 2026<br><br>
    #DIUTextileAlumniMegaReunion2026<br>
    #DIUTextileFamily<br>
    #MegaReunion2026<br><br>
    Frame link:
    <a href="https://taisur-rubayet.github.io/4th-textile-alumni-reunion-Dp-frame/" target="_blank">
      https://taisur-rubayet.github.io/4th-textile-alumni-reunion-Dp-frame/
    </a>
  `;

  captionContainer.style.display = "block";

  if (cropper) {
    cropper.destroy();
    cropper = null;
  }
}
