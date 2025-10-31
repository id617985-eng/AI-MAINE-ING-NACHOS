function updateCartDisplay() {
    const cartItemsList = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.getElementById('cart-count');
    
    cartItemsList.innerHTML = '';
    
    let total = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<li class="empty-cart">Your cart is empty.</li>';
        document.getElementById('checkout-btn').disabled = true;
    } else {
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            totalItems += item.quantity;

            const li = document.createElement('li');

            li.innerHTML = `
                <img src="${getImageSrc(item.name)}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <span class="item-name">${item.name}</span>
                    <div class="quantity-controls">
                        <button onclick="changeQuantity(${index}, -1)">-</button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button onclick="changeQuantity(${index}, 1)">+</button>
                    </div>
                </div>
                <span class="item-price">${currencySymbol}${itemTotal.toFixed(0)}</span>
            `;
            cartItemsList.appendChild(li);
        });
        document.getElementById('checkout-btn').disabled = false;
    }

    // Animate total count
    animateNumber(cartCountElement, totalItems);
    animateNumber(cartTotalElement, total, true);
}

// Helper to get image src by item name
function getImageSrc(name) {
    switch(name) {
        case "Regular Nachos": return "image/566525427_2187368088422232_3281536944644291040_n.jpg";
        case "Veggie Nachos": return "image/veggie nachos.jpg";
        case "Overload Cheesy Nachos": return "image/overload chees nachos.jpg";
        case "Nacho Combo": return "image/combo.jpg";
        case "Nacho Fries": return "image/nacho fries.jpg";
        default: return "image/default.jpg";
    }
}

// Smooth number animation
function animateNumber(element, value, isCurrency=false) {
    const start = parseFloat(element.textContent.replace(currencySymbol,'') || 0);
    const end = value;
    const duration = 300;
    const startTime = performance.now();

    function update(time) {
        const progress = Math.min((time - startTime)/duration, 1);
        const current = start + (end - start) * progress;
        element.textContent = isCurrency ? `${currencySymbol}${current.toFixed(0)}` : Math.floor(current);
        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

// Fly image animation to cart
function flyToCart(img) {
    const cartBtn = document.getElementById('cart-trigger');
    const imgClone = img.cloneNode(true);
    const imgRect = img.getBoundingClientRect();
    const cartRect = cartBtn.getBoundingClientRect();

    imgClone.style.position = 'fixed';
    imgClone.style.top = imgRect.top + 'px';
    imgClone.style.left = imgRect.left + 'px';
    imgClone.style.width = imgRect.width + 'px';
    imgClone.style.height = imgRect.height + 'px';
    imgClone.style.transition = 'all 0.7s ease-in-out, opacity 0.7s';
    imgClone.style.zIndex = 1000;
    document.body.appendChild(imgClone);

    setTimeout(() => {
        imgClone.style.top = cartRect.top + 'px';
        imgClone.style.left = cartRect.left + 'px';
        imgClone.style.width = '30px';
        imgClone.style.height = '30px';
        imgClone.style.opacity = '0';
    }, 10);

    setTimeout(() => {
        imgClone.remove();
    }, 710);
}
