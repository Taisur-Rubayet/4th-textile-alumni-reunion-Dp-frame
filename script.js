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
frame.src = "DP FRMAE-01.png"; // same folder

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
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="#ffffff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(croppedCanvas,0,0,canvas.width,canvas.height);
    ctx.drawImage(frame,0,0,canvas.width,canvas.height);

    // Update preview
    preview.src = canvas.toDataURL("image/png");

    // Hide crop button after generation
    cropBtn.style.display = 'none';
    downloadBtn.style.display = 'inline-block';

    // Show caption
    captionTextDiv.innerHTML = `
      ✨ 20 Years of Excellence ✨<br>
      🎉 DIU Textile Mega Carnival 2025 🎉<br>
      Frame link: <a href="https://taisur-rubayet.github.io/dp-frame/" target="_blank">taisur-rubayet.github.io/dp-frame</a>
    `;
    captionContainer.style.display = 'block';

    if(cropper){ cropper.destroy(); cropper=null; }
  }

  if(frame.complete){
    finalize();
  } else {
    frame.onload = finalize;
  }
});

// Copy caption
copyCaptionBtn.addEventListener('click', () => {
  const textToCopy = `✨ 20 Years of Excellence ✨
🎉 DIU Textile Mega Carnival 2025 🎉
Frame link: https://taisur-rubayet.github.io/dp-frame/`;
  navigator.clipboard.writeText(textToCopy)
    .then(()=> alert('Caption copied!'))
    .catch(()=> alert('Failed to copy caption.'));
});

// Download DP
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'Carnival_DP.png';
  link.href = canvas.toDataURL("image/png");
  link.click();
});
