document.addEventListener('DOMContentLoaded', function() {
    // Ambil data dari URL
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const productName = urlParams.get('name');
    const productPrice = urlParams.get('price');
    const productStock = urlParams.get('stock');
    const productImage = urlParams.get('image');

    // Isi data ke HTML (Preview & Form)
    if (productName) {
        document.getElementById('preview-name').innerText = productName;
        document.getElementById('edit-name').value = productName;
    }
    
    if (productStock) {
        document.getElementById('preview-stock').innerText = `Stok Tersisa ${productStock}`;
        document.getElementById('edit-stock').value = productStock;
        if (productStock == '0') {
            document.getElementById('preview-stock').style.color = 'red';
        }
    }
    
    if (productImage) {
        document.getElementById('preview-image').src = productImage;
    }
    
    if (productPrice) {
        const formattedPrice = new Intl.NumberFormat('id-ID', {
            style: 'currency', currency: 'IDR', minimumFractionDigits: 0
        }).format(productPrice);
        document.getElementById('edit-price').value = formattedPrice;
    }

    // logika pop up modal
    // ketika tombol perbarui diklik maka tampilkan modal hijau
    const btnPerbarui = document.querySelector('.btn-perbarui');
    if (btnPerbarui) {
        btnPerbarui.addEventListener('click', function(e) {
            e.preventDefault();
            // Panggil Modal Bootstrap
            const modalPerbarui = new bootstrap.Modal(document.getElementById('modalPerbarui'));
            modalPerbarui.show();
        });
    }

    // ketika tombol ya di modal perbarui diklik
    const confirmUpdateBtn = document.getElementById('confirm-update-btn');
    if (confirmUpdateBtn) {
        confirmUpdateBtn.addEventListener('click', function() {
            // Logika simpan ke database bisa ditaruh di sini
            alert('Sukses! Produk berhasil diperbarui.');
            window.location.href = 'admin-produk.html';
        });
    }

    // ketika tombol hapus diklik maka tampilkan modal merah
    const btnHapus = document.querySelector('.btn-hapus');
    if (btnHapus) {
        btnHapus.addEventListener('click', function(e) {
            e.preventDefault();
            // Panggil Modal Bootstrap
            const modalHapus = new bootstrap.Modal(document.getElementById('modalHapus'));
            modalHapus.show();
        });
    }

    // ketika tombol ya di modal hapus diklik
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            // Logika hapus dari database bisa ditaruh di sini
            alert('Sukses! Produk berhasil dihapus.');
            window.location.href = 'admin-produk.html';
        });
    }
});