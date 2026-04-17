// Cart functionality
let cart = [];

// Initialize cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('patojayCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
        updateButtonStates();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('patojayCart', JSON.stringify(cart));
}

// Update button states based on cart contents
function updateButtonStates() {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        const productName = btn.getAttribute('data-product');
        const isInCart = cart.some(item => item.product === productName);
        if (isInCart) {
            btn.classList.add('added');
            btn.textContent = '✓ In Cart';
        } else {
            btn.classList.remove('added');
            btn.textContent = 'Add to Cart';
        }
    });
}

// Load cart when page loads
loadCart();

// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Update aria-expanded for accessibility
        const isExpanded = hamburger.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when link is clicked
    navMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}

// Add to cart functionality
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const product = button.getAttribute('data-product');
        const price = parseFloat(button.getAttribute('data-price'));
        
        // Check if product already exists in cart
        const existingItem = cart.find(item => item.product === product);
        
        if (existingItem) {
            // Increment quantity if product exists
            existingItem.quantity += 1;
        } else {
            // Add new item with quantity 1
            cart.push({ product, price, quantity: 1 });
            // Mark button as added (stays selected)
            button.classList.add('added');
            button.textContent = '✓ In Cart';
        }
        
        // Update cart count
        updateCartCount();
        saveCart();
    });
});

// Update cart count display
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        // Sum all quantities
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Cart modal functionality
const cartModal = document.getElementById('cartModal');
const cartLink = document.querySelector('.cart-link a');
const closeBtn = document.querySelector('.close');

if (cartLink) {
    cartLink.addEventListener('click', (e) => {
        e.preventDefault();
        displayCart();
        if (cartModal) {
            cartModal.style.display = 'block';
        }
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        if (cartModal) {
            cartModal.style.display = 'none';
        }
    });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Display cart items
function displayCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    const cartTotalSpan = document.getElementById('cartTotal');
    
    if (!cartItemsDiv) return;
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Your cart is empty</p>';
        cartTotalSpan.textContent = '0.00';
        return;
    }
    
    let html = '<div class="cart-list">';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemSubtotal = item.price * item.quantity;
        html += `
            <div class="cart-item">
                <div class="item-info">
                    <h4>${item.product}</h4>
                    <p class="item-price">$${item.price.toFixed(2)} each</p>
                    <p class="item-subtotal">Subtotal: $${itemSubtotal.toFixed(2)}</p>
                </div>
                <div class="quantity-control">
                    <button class="qty-btn" onclick="decreaseQuantity(${index})">−</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="increaseQuantity(${index})">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
                </div>
            </div>
        `;
        total += itemSubtotal;
    });
    
    html += '</div>';
    cartItemsDiv.innerHTML = html;
    cartTotalSpan.textContent = total.toFixed(2);
}

// Remove item from cart
function removeFromCart(index) {
    const removedItem = cart[index];
    const productName = removedItem.product;
    cart.splice(index, 1);
    
    // Count how many of this product remain in cart
    const remainingCount = cart.filter(item => item.product === productName).length;
    
    // If no more of this product, reset button state
    if (remainingCount === 0) {
        // Find and update the button for this specific product
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            if (btn.getAttribute('data-product') === productName) {
                btn.classList.remove('added');
                btn.textContent = 'Add to Cart';
            }
        });
    }
    
    updateCartCount();
    displayCart();
    saveCart();
}

// Increase quantity
function increaseQuantity(index) {
    if (cart[index]) {
        cart[index].quantity += 1;
        updateCartCount();
        displayCart();
        saveCart();
    }
}

// Decrease quantity
function decreaseQuantity(index) {
    if (cart[index]) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            removeFromCart(index);
            return;
        }
        updateCartCount();
        displayCart();
        saveCart();
    }
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
    alert(`Thank you for your purchase! Total: $${total}\n\nIn a real store, payment would be processed here.`);
    
    // Reset all button states before clearing cart
    document.querySelectorAll('.add-to-cart.added').forEach(button => {
        button.classList.remove('added');
        button.textContent = 'Add to Cart';
    });
    
    // Clear cart after checkout
    cart = [];
    updateCartCount();
    if (cartModal) {
        cartModal.style.display = 'none';
    }
    displayCart();
    saveCart();
}

// Close cart modal
function closeCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.style.display = 'none';
    }
    // Cart data is preserved - items stay in cart
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#cart') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Responsive improvements
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});
