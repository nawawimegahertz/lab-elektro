async function fetchData() {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbyZOi9u8-V_5_dPi-D7Es9VQG1FG5AqtAoqw8TXaUWwc7jpoICGp5FZGkLW7wVXcnLp/exec');
    const data = await response.json();
    const kelasDropdown = document.getElementById("kelasDropdown");
    data.kelas.forEach(kelas => {
      const option = document.createElement("option");
      option.value = kelas;
      option.text = kelas;
      kelasDropdown.add(option);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function fetchNama(kelas) {
  try {
    const response = await fetch(`https://script.google.com/macros/s/AKfycbyZOi9u8-V_5_dPi-D7Es9VQG1FG5AqtAoqw8TXaUWwc7jpoICGp5FZGkLW7wVXcnLp/exec?kelas=${kelas}`);
    const data = await response.json();
    const namaDropdown = document.getElementById("namaDropdown");
    namaDropdown.innerHTML = '<option value="">Pilih Nama</option>';
    data.nama.forEach(nama => {
      const option = document.createElement("option");
      option.value = nama;
      option.text = nama;
      namaDropdown.add(option);
    });
  } catch (error) {
    console.error("Error fetching nama:", error);
  }
}
   
function openCaptchaPopup(buttonType) {
  document.getElementById("captcha-popup").style.display = "flex";
  document.getElementById("buttonType").value = buttonType;
  generateCaptcha();
}

function generateCaptcha() {
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz09876543210';    
  let captcha = '';
  for (let i = 0; i < 6; i++) {
    captcha += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  const captchaCode = document.getElementById("captchaCode");
  captchaCode.textContent = captcha;
    
  // Cegah klik kanan pada CAPTCHA
  captchaCode.addEventListener("contextmenu", function(event) {
  event.preventDefault(); // Mencegah klik kanan
  });
}
 
function verifyCaptcha() {
  const enteredCaptcha = document.getElementById("captchaInput").value;
  const generatedCaptcha = document.getElementById("captchaCode").textContent;

  if (enteredCaptcha === generatedCaptcha) {
    document.getElementById("captcha-popup").style.display = "none";
    verifyData();
  } else {
    alert("CAPTCHA tidak cocok, coba lagi.");    
    generateCaptcha(); // Regenerasi CAPTCHA untuk mencegah percobaan berulang    
  }
}
 
async function verifyData() {
  const kelas = document.getElementById("kelasDropdown").value;
  const nama = document.getElementById("namaDropdown").value;
  const password = document.getElementById("passwordInput").value;

  if (!kelas || !nama || !password) {
    alert("Mohon lengkapi semua kolom.");
    return;  
  }
  
  try {
    const response = await fetch(`https://script.google.com/macros/s/AKfycbyZOi9u8-V_5_dPi-D7Es9VQG1FG5AqtAoqw8TXaUWwc7jpoICGp5FZGkLW7wVXcnLp/exec?kelas=${kelas}&nama=${nama}&password=${password}`);   
    const result = await response.json();

    if (result.match) {
      // Tampilkan konten baru dan sembunyikan form lama
      document.getElementById("formContent").style.display = "none";
      document.getElementById("newContent").style.display = "block";  
    } else {
      alert("Password salah");    
    }

    // Kosongkan kolom password setelah verifikasi
    document.getElementById("passwordInput").value = "";
  } catch (error) {
    console.error("Error verifying data:", error);    
  }    
}

document.addEventListener("DOMContentLoaded", fetchData);
    
// Prevent closing CAPTCHA popup immediately after opening    
document.addEventListener("click", function(event) {
  const popup = document.getElementById("captcha-popup");
  const captchaBox = document.querySelector(".captcha-box");
  if (popup.style.display === "flex" && !captchaBox.contains(event.target) && event.target.tagName !== "BUTTON") {
    popup.style.display = "none";    
  }    
});
