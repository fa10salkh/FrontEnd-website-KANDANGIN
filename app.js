document.addEventListener('DOMContentLoaded', () => {

    const updateCartIcon = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCounters = document.querySelectorAll('#cart-count'); // Menargetkan semua counter
        if (cartCounters.length > 0) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCounters.forEach(counter => {
                counter.innerText = totalItems;
                counter.style.display = totalItems > 0 ? 'block' : 'none';
            });
        }
    };

    const showToast = (message) => {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerText = message;
        container.appendChild(toast);
        setTimeout(() => { toast.classList.add('show'); }, 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => { toast.remove(); }, 500);
        }, 3000);
    };

    const addToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Cek apakah produk dengan ID yang sama sudah ada di keranjang
        const existingProductIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingProductIndex > -1) {
            // Jika ID sudah ada, tambahkan jumlahnya (Quantity)
            cart[existingProductIndex].quantity += 1;
        } else {
            // Jika ID belum ada, tambahkan sebagai item baru
            product.quantity = 1;
            cart.push(product);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartIcon();
        showToast(`${product.name} telah ditambahkan ke keranjang!`);
    };


    // --- fungsi cek stok otomatis ---
    const checkStockStatus = () => {
        // Ambil semua kartu produk
        const productCards = document.querySelectorAll('.product-card');

        productCards.forEach(card => {
            // Cari elemen teks stok dan tombol beli di dalam kartu ini
            const stockElement = card.querySelector('.stock-status');
            const button = card.querySelector('.btn-beli');

            if (stockElement && button) {
                // Ambil teksnya (misal: "Stok Tersisa 0")
                const stockText = stockElement.innerText;
                
                // Ambil angkanya saja menggunakan Regex
                // (\d+) yaitu mencari angka di dalam teks
                const stockNumber = parseInt(stockText.match(/\d+/)[0]);

                // Logika: Jika stok 0, ubah tombol
                if (stockNumber === 0) {
                    button.classList.add('btn-habis'); 
                    button.innerText = "Habis";        
                }
            }
        });
    };
    checkStockStatus();


    // logika halaman produk//
    if (document.body.classList.contains('page-produk')) {
        const buyButtons = document.querySelectorAll('.btn-beli');
        buyButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productItem = e.target.closest('.product-item');
                const product = {
                    id: productItem.dataset.id,
                    name: productItem.dataset.name,
                    price: parseFloat(productItem.dataset.price),
                    image: productItem.dataset.image,
                };
                addToCart(product);
            });
        });
    }

    // logika halaman keranjang //
    if (document.body.classList.contains('page-keranjang')) {
        const cartItemsContainer = document.getElementById('cart-items-container');
        const cartTotalPriceEl = document.getElementById('cart-total-price');
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        const renderCart = () => {
            cartItemsContainer.innerHTML = '';
            let totalPrice = 0;
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p class="text-center col-12">Keranjang Anda kosong.</p>';
                cartTotalPriceEl.innerText = 'Rp 0';
                return;
            }
            cart.forEach(item => {
                totalPrice += item.price * item.quantity;
                const itemHtml = `
                    <div class="col-lg-3 col-md-6 mb-4">
                        <div class="product-card">
                            <div class="card-body">
                                <h5 class="product-name">${item.name}</h5>
                                <img src="${item.image}" alt="${item.name}" class="product-card-img">
                                <div class="d-flex justify-content-between align-items-center mt-3">
                                    <span class="product-price">Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                    <div class="quantity-widget">
                                        <button type="button" class="btn btn-quantity-action" data-id="${item.id}" data-action="decrease"><i class="bi bi-dash"></i></button>
                                        <div class="quantity-display">${item.quantity}</div>
                                        <button type="button" class="btn btn-quantity-action" data-id="${item.id}" data-action="increase"><i class="bi bi-plus"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                cartItemsContainer.innerHTML += itemHtml;
            });
            cartTotalPriceEl.innerText = `Rp ${totalPrice.toLocaleString('id-ID')}`;
        };

        cartItemsContainer.addEventListener('click', (e) => {
            const target = e.target.closest('.btn-quantity-action');
            if (!target) return;
            const id = target.dataset.id;
            const action = target.dataset.action;
            const itemIndex = cart.findIndex(item => item.id === id);
            if (itemIndex > -1) {
                if (action === 'increase') {
                    cart[itemIndex].quantity++;
                } else if (action === 'decrease') {
                    cart[itemIndex].quantity--;
                    if (cart[itemIndex].quantity <= 0) {
                        cart.splice(itemIndex, 1);
                    }
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
                updateCartIcon();
            }
        });
        renderCart();
    }

    // logika halaman tunggu pembayaran
    if (document.body.classList.contains('page-tunggu-pembayaran')) {
        const itemsWrapper = document.getElementById('receipt-items-wrapper');
        const totalQuantityEl = document.getElementById('receipt-total-quantity');
        const totalPriceEl = document.getElementById('receipt-total-price');
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        let totalQuantity = 0;
        let totalPrice = 0;

        if (cart.length > 0) {
            cart.forEach(item => {
                const itemPrice = item.price; // mengambil harga asli dariitem
                const subtotal = itemPrice * item.quantity;
                totalQuantity += item.quantity;
                totalPrice += subtotal;

                const itemHtml = `
                    <div class="receipt-item d-flex justify-content-between mt-2">
                        <span>${item.name}</span>
                        <span>${item.quantity}</span>
                        <span>Rp ${itemPrice.toLocaleString('id-ID')}</span>
                    </div>
                `;
                // Sisipkan item baru setelah header
                itemsWrapper.insertAdjacentHTML('beforeend', itemHtml);
            });
        }

        totalQuantityEl.innerText = totalQuantity;
        totalPriceEl.innerText = `Rp ${totalPrice.toLocaleString('id-ID')}`;
    }

    // Panggil updateCartIcon setiap halaman yang dimuat
    updateCartIcon();
});