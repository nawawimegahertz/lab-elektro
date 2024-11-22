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
    } 
    else {
        Swal.fire({
            icon: 'error',
            title: 'Oops!',
            text: 'CAPTCHA tidak cocok, coba lagi.',
        });
        
        generateCaptcha(); // Regenerasi CAPTCHA untuk mencegah percobaan berulang    
    }
}
   
async function verifyData() {
    const kelas = document.getElementById("kelasDropdown").value;
    const nama = document.getElementById("namaDropdown").value;
    const password = document.getElementById("passwordInput").value;
  
    if (!kelas || !nama || !password) {
        Swal.fire({
            icon: 'warning',
            title: 'Perhatian!',
            text: 'Mohon lengkapi semua isian.',
        });
        return;  
    }
    
    try {
      const response = await fetch(`https://script.google.com/macros/s/AKfycbyZOi9u8-V_5_dPi-D7Es9VQG1FG5AqtAoqw8TXaUWwc7jpoICGp5FZGkLW7wVXcnLp/exec?kelas=${kelas}&nama=${nama}&password=${password}`);   
      const result = await response.json();
  
      if (result.match) {
        // Tampilkan konten baru dan sembunyikan form lama
        document.getElementById("formContent").style.display = "none";
        document.getElementById("newContent").style.display = "block";  
      }
      else {
        Swal.fire({
            icon: 'warning',
            title: 'Perhatian!',
            text: 'Password Anda salah!',
        });
      }
  
      // Kosongkan kolom password setelah verifikasi
      document.getElementById("passwordInput").value = "";
    } catch (error) {
        console.error("Error verifying data:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Terjadi kesalahan saat memverifikasi data. Coba lagi nanti.',
        });          
    }    
}

// -------------- code extention ----------------------------- //

const form = document.getElementById("form");
const message = document.getElementById("message");
const submitButton = document.getElementById("submit-button");
const barangSection = document.getElementById("barang-section"); 
const jumlahVariasiInput = document.querySelector("[name='jumlah_variasi']");

form.addEventListener("submit", function (e) {
    e.preventDefault();
    Swal.fire({
            icon: 'success',
            title: 'Proses...',
            text: 'Data Anda sedang diolah.',
        });
    const formData = new FormData(this);
    const formDataString = new URLSearchParams(formData).toString();
    fetch("https://script.google.com/macros/s/AKfycbxEGvCAb8kpOSgZU42v_GOR1DZa1pWW04pnFcRKwna8DKa8S4O-uf2cKRuoi0dcgil0ZQ/exec", {
        method: "POST",
        body: formDataString,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
    .then(response => response.ok ? response : Promise.reject("Gagal menyimpan data."))
    .then(() => {
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Data Anda berhasil disimpan.',
        }).then(() => {
            Swal.fire({
                title: 'Apakah Anda ingin mengosongkan form?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Ya',
                cancelButtonText: 'Tidak',
            }).then((result) => {
                if (result.isConfirmed) {
                    form.reset();
                }
            });
        });
    })    

    .catch(error => {
        console.error(error);          
        Swal.fire({
            icon: 'warning',
            title: 'ERROR!',
            text: 'Kami tahu ini berat, tapi kami akan memperbaikinya untuk Anda.',
        });  
    })

    .finally(() => {
        submitButton.disabled = false;  
        setTimeout(() => (message.style.display = "none"), 2600);        
    });
    
});

form.addEventListener("reset", function(e){
    e.preventDefault();
    Swal.fire({
        title: 'Apakah Anda yakin ingin membatalkan?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Batalkan.',
        cancelButtonText: 'Tidak.'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = 'index.html'; // Redirect ke dashboard
        }
    });
    
})


jumlahVariasiInput.addEventListener("input", function () {
    barangSection.innerHTML = "";
    const jumlahVariasi = parseInt(this.value, 10) || 0;

    for (let i = 1; i <= jumlahVariasi; i++) {
        barangSection.insertAdjacentHTML("beforeend", `
          <div class="field">
            <label class="label">Nama Barang ${i}</label>
            <input class="input" type="text" placeholder="Nama Barang ${i}" name="nama_barang_${i}" required />
          </div>
          <div class="field">
            <label class="label">Jumlah Barang ${i}</label>
            <input class="input" type="number" placeholder="Jumlah Barang ${i}" name="jumlah_barang_${i}" min="1" required />
          </div>
        `);

    }

});
  
// -------------- code extention ----------------------------- //

document.addEventListener("DOMContentLoaded", fetchData);
      
// Prevent closing CAPTCHA popup immediately after opening    
document.addEventListener("click", function(event) {
    const popup = document.getElementById("captcha-popup");
    const captchaBox = document.querySelector(".captcha-box");
    if (popup.style.display === "flex" && !captchaBox.contains(event.target) && event.target.tagName !== "BUTTON") {
      popup.style.display = "none";    
    }    
});
