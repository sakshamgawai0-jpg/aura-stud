/**
 * Aura Studios - Storefront Main Application Logic
 * Location: Waman Nagar, Khamgaon 444303
 * WhatsApp: +91 7020563263
 */

// Application State
let currentProducts = [];
let currentCategory = "All";
let searchQuery = "";
let cart = [];
let selectedSizes = {}; // { [productId]: "L" }

// DOM Elements
const productsGrid = document.getElementById("products-grid");
const noProductsMsg = document.getElementById("no-products-msg");
const searchInput = document.getElementById("product-search-input");
const categoryPillsContainer = document.getElementById("category-pills");
const lookbookGrid = document.getElementById("lookbook-grid-container");

// Cart Elements
const cartDrawer = document.getElementById("cart-drawer");
const cartOverlay = document.getElementById("cart-drawer-overlay");
const openCartBtn = document.getElementById("open-cart-btn");
const mobileCartBtn = document.getElementById("mobile-cart-btn");
const closeCartBtn = document.getElementById("close-cart-btn");
const cartBadge = document.getElementById("cart-badge");
const mobileCartBadge = document.getElementById("mobile-cart-badge");
const drawerItemCount = document.getElementById("drawer-item-count");
const cartItemsContainer = document.getElementById("cart-items-container");
const cartSubtotalEl = document.getElementById("cart-subtotal");
const cartFulfillmentFeeEl = document.getElementById("cart-fulfillment-fee");
const cartTotalEl = document.getElementById("cart-total");
const cartCheckoutWhatsAppBtn = document.getElementById("cart-checkout-whatsapp-btn");
const fulfillmentPickupRadio = document.getElementById("fulfillment-pickup");
const fulfillmentDeliveryRadio = document.getElementById("fulfillment-delivery");
const custNameInput = document.getElementById("cust-name");
const custAddressInput = document.getElementById("cust-address");

// Quick View Modal Elements
const quickViewModal = document.getElementById("product-quick-view-modal");
const closeQuickViewBtn = document.getElementById("close-quick-view-btn");
const quickViewBody = document.getElementById("quick-view-body");
const toastContainer = document.getElementById("toast-container");

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  loadCatalog();
  loadCartFromStorage();
  initCategoryListeners();
  initSearchListener();
  initCartListeners();
  initLookbook();
  initLucide();
});

function initLucide() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Show Toast Notification
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = "toast";
  
  let iconHtml = `<i data-lucide="check-circle" class="w-5 h-5 text-[#ccff00] shrink-0"></i>`;
  if (type === "info") {
    iconHtml = `<i data-lucide="info" class="w-5 h-5 text-[#00f2fe] shrink-0"></i>`;
  } else if (type === "warning") {
    iconHtml = `<i data-lucide="alert-triangle" class="w-5 h-5 text-[#ffaa00] shrink-0"></i>`;
  }

  toast.innerHTML = `
    <div class="flex items-center gap-3">
      ${iconHtml}
      <div class="text-xs font-mono font-medium">${message}</div>
    </div>
  `;

  toastContainer.appendChild(toast);
  initLucide();

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// Load and Render Products
function loadCatalog() {
  currentProducts = getStoredProducts();
  
  // Default sizes selection
  currentProducts.forEach(prod => {
    if (!selectedSizes[prod.id]) {
      selectedSizes[prod.id] = (prod.sizes && prod.sizes.length > 0) ? prod.sizes[0] : "Free";
    }
  });

  renderProducts();
}

// Render Products Grid
function renderProducts() {
  if (!productsGrid) return;

  const filtered = currentProducts.filter(prod => {
    const matchesCat = (currentCategory === "All" || prod.category.toLowerCase() === currentCategory.toLowerCase());
    const matchesQuery = !searchQuery || 
      prod.name.toLowerCase().includes(searchQuery) ||
      (prod.category && prod.category.toLowerCase().includes(searchQuery)) ||
      (prod.gsm && prod.gsm.toLowerCase().includes(searchQuery)) ||
      (prod.description && prod.description.toLowerCase().includes(searchQuery));
    return matchesCat && matchesQuery;
  });

  if (filtered.length === 0) {
    productsGrid.innerHTML = "";
    noProductsMsg.classList.remove("hidden");
    return;
  }

  noProductsMsg.classList.add("hidden");

  productsGrid.innerHTML = filtered.map(product => {
    const selectedSize = selectedSizes[product.id] || (product.sizes ? product.sizes[0] : "Free");
    
    // First media item or placeholder
    const firstMedia = (product.media && product.media.length > 0) 
      ? product.media[0] 
      : { type: "image", url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80" };

    const mediaCount = (product.media && product.media.length) ? product.media.length : 1;
    const hasVideo = product.media && product.media.some(m => m.type === "video");

    // Stock Badge Color
    let stockBadge = `<span class="bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">In Stock</span>`;
    if (product.stock === "Low Stock") {
      stockBadge = `<span class="bg-[#ffaa00]/15 text-[#ffaa00] border border-[#ffaa00]/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">Low Stock</span>`;
    } else if (product.stock === "Pre-Order") {
      stockBadge = `<span class="bg-[#00f2fe]/15 text-[#00f2fe] border border-[#00f2fe]/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">Pre-Order</span>`;
    } else if (product.stock === "Sold Out") {
      stockBadge = `<span class="bg-red-500/15 text-red-400 border border-red-500/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">Sold Out</span>`;
    }

    // Sizes buttons
    const sizesHtml = (product.sizes || []).map(sz => `
      <button type="button" 
              class="size-btn ${sz === selectedSize ? 'active' : ''}" 
              onclick="selectProductSize('${product.id}', '${sz}')">
        ${sz}
      </button>
    `).join("");

    // Calculate discount percent
    let discountHtml = "";
    if (product.originalPrice && product.originalPrice > product.price) {
      const off = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
      discountHtml = `<span class="text-[11px] font-mono text-[#ccff00] font-bold">(${off}% OFF)</span>`;
    }

    // WhatsApp Direct URL
    const waText = encodeURIComponent(
      `Hey Aura Studios! I want to order the ${product.name} in Size ${selectedSize} (₹${product.price}). Is this available for pickup at Waman Nagar or delivery in Khamgaon?`
    );
    const waUrl = `https://wa.me/${AURA_CONFIG.whatsappNumber}?text=${waText}`;

    return `
      <div class="street-card rounded-xl overflow-hidden flex flex-col justify-between" id="card-${product.id}">
        
        <!-- Media Container with Quick View Trigger -->
        <div class="product-image-container cursor-pointer group" onclick="openQuickView('${product.id}')">
          <img src="${firstMedia.url}" alt="${product.name}" id="img-${product.id}" loading="lazy" class="group-hover:scale-105 transition-transform duration-500">
          
          <!-- Badges overlay -->
          <div class="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center z-10">
            ${product.badge ? `<span class="street-badge">${product.badge}</span>` : ''}
            ${stockBadge}
          </div>

          <!-- Media Count / Video indicator -->
          <div class="absolute top-3 right-3 flex items-center gap-1 bg-black/75 backdrop-blur-md px-2 py-1 rounded text-[11px] font-mono text-white border border-white/10">
            ${hasVideo ? `<i data-lucide="video" class="w-3.5 h-3.5 text-[#ccff00]"></i>` : `<i data-lucide="image" class="w-3.5 h-3.5 text-slate-400"></i>`}
            <span>${mediaCount}</span>
          </div>

          <!-- Quick view hint -->
          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span class="bg-black/85 text-white border border-white/20 px-3 py-1.5 rounded-full font-mono text-xs flex items-center gap-1.5 shadow-lg">
              <i data-lucide="eye" class="w-3.5 h-3.5 text-[#ccff00]"></i>
              <span>Quick View & Fabric</span>
            </span>
          </div>
        </div>

        <!-- Product Details -->
        <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
          
          <div>
            <div class="flex items-center justify-between gap-2 mb-1">
              <span class="font-mono text-[11px] uppercase tracking-wider text-[#94a3b8]">${product.category}</span>
              ${product.gsm ? `<span class="font-mono text-[11px] text-[#ccff00] font-semibold">${product.gsm}</span>` : ''}
            </div>

            <h3 class="font-display font-bold text-lg text-white leading-snug cursor-pointer hover:text-[#ccff00] transition-colors" onclick="openQuickView('${product.id}')">
              ${product.name}
            </h3>

            <p class="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              ${product.description || 'Premium heavyweight streetwear crafted for modern silhouettes.'}
            </p>
          </div>

          <!-- Size Selector -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="font-mono text-[11px] uppercase tracking-wider text-slate-400">Size:</span>
              <span class="font-mono text-xs font-bold text-white" id="selected-size-text-${product.id}">${selectedSize}</span>
            </div>
            <div class="flex flex-wrap gap-1.5">
              ${sizesHtml}
            </div>
          </div>

          <!-- Price & Discount -->
          <div class="pt-2 border-t border-white/10 flex items-baseline justify-between">
            <div class="flex items-baseline gap-2">
              <span class="font-display font-black text-2xl text-white">₹${product.price}</span>
              ${product.originalPrice ? `<span class="line-through text-slate-500 font-mono text-xs">₹${product.originalPrice}</span>` : ''}
              ${discountHtml}
            </div>
            <span class="text-[10px] font-mono text-slate-400">Waman Nagar Pickup</span>
          </div>

          <!-- Action Buttons -->
          <div class="grid grid-cols-2 gap-2 pt-1">
            <!-- Individual WhatsApp CTA -->
            <a href="${waUrl}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="btn-whatsapp text-xs font-black py-2.5 px-2 text-center justify-center"
               title="Chat on WhatsApp to Buy">
              <i data-lucide="message-circle" class="w-4 h-4 shrink-0"></i>
              <span>CHAT TO BUY</span>
            </a>

            <!-- Add to Bag Button -->
            <button type="button" 
                    class="btn-primary text-xs font-black py-2.5 px-2 text-center justify-center"
                    onclick="addToCart('${product.id}')">
              <i data-lucide="plus" class="w-4 h-4 shrink-0"></i>
              <span>ADD TO BAG</span>
            </button>
          </div>

        </div>

      </div>
    `;
  }).join("");

  initLucide();
}

// Select Product Size
function selectProductSize(productId, size) {
  selectedSizes[productId] = size;
  
  // Update card UI size text and buttons
  const card = document.getElementById(`card-${productId}`);
  if (card) {
    const sizeBtns = card.querySelectorAll(".size-btn");
    sizeBtns.forEach(btn => {
      if (btn.textContent.trim() === size) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    const sizeText = document.getElementById(`selected-size-text-${productId}`);
    if (sizeText) sizeText.textContent = size;

    // Update WhatsApp link on this card
    const product = currentProducts.find(p => p.id === productId);
    if (product) {
      const waBtn = card.querySelector(".btn-whatsapp");
      if (waBtn) {
        const waText = encodeURIComponent(
          `Hey Aura Studios! I want to order the ${product.name} in Size ${size} (₹${product.price}). Is this available for pickup at Waman Nagar or delivery in Khamgaon?`
        );
        waBtn.href = `https://wa.me/${AURA_CONFIG.whatsappNumber}?text=${waText}`;
      }
    }
  }
}

// Category Filtering
function initCategoryListeners() {
  if (!categoryPillsContainer) return;

  const pills = categoryPillsContainer.querySelectorAll(".filter-pill");
  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      pills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      currentCategory = pill.dataset.category;
      renderProducts();
    });
  });
}

function resetCategoryFilter() {
  currentCategory = "All";
  searchQuery = "";
  if (searchInput) searchInput.value = "";
  
  const pills = categoryPillsContainer.querySelectorAll(".filter-pill");
  pills.forEach(p => {
    if (p.dataset.category === "All") p.classList.add("active");
    else p.classList.remove("active");
  });

  renderProducts();
}

// Search Listener
function initSearchListener() {
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    renderProducts();
  });
}

// CART MANAGEMENT
function loadCartFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CART);
    if (stored) {
      cart = JSON.parse(stored);
    }
  } catch (e) {
    cart = [];
  }
  updateCartUI();
}

function saveCartToStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  } catch (e) {
    console.error("Cart save error:", e);
  }
  updateCartUI();
}

function addToCart(productId, explicitSize = null) {
  const product = currentProducts.find(p => p.id === productId);
  if (!product) return;

  const size = explicitSize || selectedSizes[productId] || (product.sizes ? product.sizes[0] : "Free");

  const existingIndex = cart.findIndex(item => item.id === productId && item.size === size);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    const firstMedia = (product.media && product.media.length > 0) ? product.media[0].url : "";
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      size: size,
      image: firstMedia,
      category: product.category,
      quantity: 1
    });
  }

  saveCartToStorage();
  showToast(`Added ${product.name} (${size}) to Bag!`);
  openCartDrawer();
}

function updateCartQuantity(index, delta) {
  if (!cart[index]) return;
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  saveCartToStorage();
}

function removeCartItem(index) {
  if (!cart[index]) return;
  const item = cart[index];
  cart.splice(index, 1);
  saveCartToStorage();
  showToast(`Removed ${item.name} from Bag`, "info");
}

function updateCartUI() {
  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Update Badges
  if (cartBadge) cartBadge.textContent = totalCount;
  if (mobileCartBadge) mobileCartBadge.textContent = totalCount;
  if (drawerItemCount) drawerItemCount.textContent = `${totalCount} item${totalCount === 1 ? '' : 's'}`;

  // Fulfillment Check
  const isDelivery = fulfillmentDeliveryRadio && fulfillmentDeliveryRadio.checked;
  let deliveryFee = 0;
  if (isDelivery) {
    deliveryFee = (subtotal >= 1499 || subtotal === 0) ? 0 : 50;
  }
  const total = subtotal + deliveryFee;

  if (cartSubtotalEl) cartSubtotalEl.textContent = `₹${subtotal}`;
  if (cartFulfillmentFeeEl) {
    if (!isDelivery) {
      cartFulfillmentFeeEl.textContent = "FREE (Waman Nagar Pickup)";
      cartFulfillmentFeeEl.className = "text-[#ccff00]";
    } else {
      cartFulfillmentFeeEl.textContent = deliveryFee === 0 ? "FREE (Orders ₹1,499+)" : `₹${deliveryFee}`;
      cartFulfillmentFeeEl.className = deliveryFee === 0 ? "text-[#ccff00]" : "text-white";
    }
  }
  if (cartTotalEl) cartTotalEl.textContent = `₹${total}`;

  // Render Items List
  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="text-center py-16 text-slate-400 space-y-3">
        <i data-lucide="shopping-bag" class="w-12 h-12 mx-auto text-slate-600"></i>
        <p class="font-mono text-sm text-slate-300">Your bag is empty.</p>
        <p class="text-xs text-slate-500">Pick from our oversized drops and build your street fit.</p>
        <button onclick="closeCartDrawer()" class="btn-primary text-xs mt-3">BROWSE DROPS</button>
      </div>
    `;
    initLucide();
    return;
  }

  cartItemsContainer.innerHTML = cart.map((item, index) => `
    <div class="flex items-center gap-3.5 p-3 rounded-lg bg-[#181c25] border border-white/5">
      <img src="${item.image}" alt="${item.name}" class="w-16 h-20 object-cover rounded bg-black shrink-0">
      
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2">
          <h4 class="font-display font-bold text-sm text-white truncate">${item.name}</h4>
          <button onclick="removeCartItem(${index})" class="text-slate-500 hover:text-red-400 p-1">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>

        <div class="flex items-center gap-2 mt-1 font-mono text-xs">
          <span class="bg-white/10 px-2 py-0.5 rounded text-[#ccff00] font-bold">Size: ${item.size}</span>
          <span class="text-slate-400">₹${item.price} each</span>
        </div>

        <div class="flex items-center justify-between mt-2.5">
          <!-- Quantity Controls -->
          <div class="flex items-center border border-white/15 rounded bg-black/30 font-mono text-xs">
            <button onclick="updateCartQuantity(${index}, -1)" class="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10">
              <i data-lucide="minus" class="w-3.5 h-3.5"></i>
            </button>
            <span class="w-8 text-center text-white font-bold">${item.quantity}</span>
            <button onclick="updateCartQuantity(${index}, 1)" class="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10">
              <i data-lucide="plus" class="w-3.5 h-3.5"></i>
            </button>
          </div>

          <span class="font-mono font-bold text-white text-sm">₹${item.price * item.quantity}</span>
        </div>

      </div>
    </div>
  `).join("");

  initLucide();
}

function initCartListeners() {
  if (openCartBtn) openCartBtn.addEventListener("click", openCartDrawer);
  if (mobileCartBtn) mobileCartBtn.addEventListener("click", openCartDrawer);
  if (closeCartBtn) closeCartBtn.addEventListener("click", closeCartDrawer);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCartDrawer);

  if (fulfillmentPickupRadio) {
    fulfillmentPickupRadio.addEventListener("change", updateCartUI);
  }
  if (fulfillmentDeliveryRadio) {
    fulfillmentDeliveryRadio.addEventListener("change", updateCartUI);
  }

  // Complete Order via WhatsApp
  if (cartCheckoutWhatsAppBtn) {
    cartCheckoutWhatsAppBtn.addEventListener("click", handleWhatsAppCartCheckout);
  }
}

function openCartDrawer() {
  if (cartDrawer && cartOverlay) {
    cartOverlay.classList.add("open");
    cartDrawer.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

function closeCartDrawer() {
  if (cartDrawer && cartOverlay) {
    cartOverlay.classList.remove("open");
    cartDrawer.classList.remove("open");
    document.body.style.overflow = "";
  }
}

function handleWhatsAppCartCheckout() {
  if (cart.length === 0) {
    showToast("Please add items to your bag before checking out!", "warning");
    return;
  }

  const isDelivery = fulfillmentDeliveryRadio && fulfillmentDeliveryRadio.checked;
  const custName = custNameInput ? custNameInput.value.trim() : "";
  const custAddress = custAddressInput ? custAddressInput.value.trim() : "";

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  let deliveryFee = 0;
  if (isDelivery) {
    deliveryFee = (subtotal >= 1499 || subtotal === 0) ? 0 : 50;
  }
  const total = subtotal + deliveryFee;

  let message = `*HEY AURA STUDIOS! NEW ORDER REQUEST*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `📍 *Store:* Waman Nagar, Khamgaon (444303)\n\n`;
  message += `📦 *ORDERED ITEMS:*\n`;

  cart.forEach((item, i) => {
    message += `${i + 1}. *${item.name}*\n`;
    message += `   • Size: *${item.size}*\n`;
    message += `   • Qty: ${item.quantity} x ₹${item.price} = ₹${item.quantity * item.price}\n\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `💰 *Subtotal:* ₹${subtotal}\n`;
  message += `🚚 *Fulfillment:* ${isDelivery ? `Local Delivery (+₹${deliveryFee})` : `In-Store Pickup at Waman Nagar (Free)`}\n`;
  message += `🏷️ *TOTAL PAYABLE:* ₹${total}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;

  if (custName) {
    message += `👤 *Customer Name:* ${custName}\n`;
  }
  if (isDelivery && custAddress) {
    message += `🏠 *Delivery Address / Landmark:* ${custAddress}\n`;
  } else if (!isDelivery) {
    message += `🏬 *Pickup Mode:* In-Store at Waman Nagar, Khamgaon\n`;
  }

  message += `\nPlease confirm item availability and store pickup / delivery time!`;

  const waUrl = `https://wa.me/${AURA_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, "_blank");
}

// QUICK VIEW MODAL
function openQuickView(productId) {
  const product = currentProducts.find(p => p.id === productId);
  if (!product || !quickViewBody || !quickViewModal) return;

  const selectedSize = selectedSizes[productId] || (product.sizes ? product.sizes[0] : "Free");
  const mediaList = product.media && product.media.length > 0 
    ? product.media 
    : [{ type: "image", url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80" }];

  let mainMediaHtml = '';
  if (mediaList[0].type === "video") {
    mainMediaHtml = `
      <div class="video-responsive">
        ${mediaList[0].url.includes("youtube") || mediaList[0].url.includes("embed") 
          ? `<iframe src="${mediaList[0].url}" allowfullscreen></iframe>`
          : `<video src="${mediaList[0].url}" controls autoplay muted loop class="w-full h-full object-cover"></video>`}
      </div>
    `;
  } else {
    mainMediaHtml = `
      <img src="${mediaList[0].url}" alt="${product.name}" id="qv-main-media" class="w-full aspect-[4/5] object-cover rounded-lg bg-black border border-white/10">
    `;
  }

  // Thumbnails (support unlimited photos/videos)
  const thumbnailsHtml = mediaList.map((m, idx) => `
    <button type="button" 
            onclick="switchQuickViewMedia('${m.url}', '${m.type}')" 
            class="w-14 h-16 rounded overflow-hidden border border-white/20 hover:border-[#ccff00] focus:border-[#ccff00] shrink-0 bg-black relative">
      ${m.type === 'video' ? `
        <div class="w-full h-full flex items-center justify-center bg-black/80 text-[#ccff00]">
          <i data-lucide="play" class="w-4 h-4"></i>
        </div>
      ` : `
        <img src="${m.url}" alt="Thumbnail ${idx+1}" class="w-full h-full object-cover">
      `}
    </button>
  `).join("");

  // Size buttons for modal
  const modalSizesHtml = (product.sizes || []).map(sz => `
    <button type="button" 
            class="size-btn ${sz === selectedSize ? 'active' : ''}" 
            onclick="selectModalSize('${product.id}', '${sz}')">
      ${sz}
    </button>
  `).join("");

  const waText = encodeURIComponent(
    `Hey Aura Studios! I want to order the ${product.name} in Size ${selectedSize} (₹${product.price}). Is this available for pickup at Waman Nagar or delivery in Khamgaon?`
  );
  const waUrl = `https://wa.me/${AURA_CONFIG.whatsappNumber}?text=${waText}`;

  quickViewBody.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      
      <!-- Media Gallery -->
      <div class="space-y-3">
        <div id="qv-media-container">
          ${mainMediaHtml}
        </div>
        ${mediaList.length > 1 ? `
          <div class="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
            ${thumbnailsHtml}
          </div>
        ` : ''}
      </div>

      <!-- Specs & Purchase -->
      <div class="space-y-5">
        <div>
          <div class="flex items-center gap-2 font-mono text-xs text-[#ccff00] font-bold uppercase mb-1">
            <span>${product.category}</span>
            <span>•</span>
            <span>${product.stock || 'In Stock'}</span>
          </div>
          <h2 class="font-display font-black text-2xl sm:text-3xl text-white uppercase">${product.name}</h2>
          <div class="flex items-baseline gap-3 mt-2">
            <span class="font-display font-black text-3xl text-[#ccff00]">₹${product.price}</span>
            ${product.originalPrice ? `<span class="line-through text-slate-500 font-mono text-sm">₹${product.originalPrice}</span>` : ''}
          </div>
        </div>

        <p class="text-sm text-slate-300 leading-relaxed font-light">
          ${product.description || ''}
        </p>

        <!-- Fabric & Silhouette Specs -->
        <div class="p-3.5 rounded bg-white/5 border border-white/10 space-y-2 font-mono text-xs">
          <div class="flex justify-between">
            <span class="text-slate-400">Fabric Density:</span>
            <span class="text-white font-bold">${product.gsm || '240+ GSM French Terry'}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Cut & Silhouette:</span>
            <span class="text-white font-bold">${product.fit || 'Drop-Shoulder Boxy'}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Colorway / Wash:</span>
            <span class="text-white font-bold">${product.color || 'Charcoal Stone Wash'}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Local Pickup:</span>
            <span class="text-[#ccff00] font-bold">Waman Nagar Khamgaon</span>
          </div>
        </div>

        <!-- Size Selection -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="font-mono text-xs font-bold text-slate-300 uppercase">Select Size:</span>
            <span class="font-mono text-xs text-[#ccff00] font-bold" id="modal-selected-size-text">${selectedSize}</span>
          </div>
          <div class="flex flex-wrap gap-2" id="modal-sizes-group">
            ${modalSizesHtml}
          </div>
        </div>

        <!-- CTAs -->
        <div class="space-y-2.5 pt-2">
          <a href="${waUrl}" 
             id="modal-wa-btn"
             target="_blank" 
             rel="noopener noreferrer" 
             class="w-full btn-whatsapp justify-center py-3 font-black text-sm">
            <i data-lucide="message-circle" class="w-5 h-5"></i>
            <span>ORDER THIS ON WHATSAPP</span>
          </a>

          <button type="button" 
                  onclick="addToCart('${product.id}', selectedSizes['${product.id}']); closeQuickViewModal();" 
                  class="w-full btn-primary justify-center py-3 font-black text-sm">
            <i data-lucide="shopping-bag" class="w-5 h-5"></i>
            <span>ADD TO BAG & CONTINUE</span>
          </button>
        </div>

        <!-- Size Chart Guide -->
        <div class="pt-3 border-t border-white/10 font-mono text-[11px] text-slate-400">
          <p class="text-white font-bold mb-1">Standard Boxy Sizing (Inches):</p>
          <div class="grid grid-cols-4 gap-2 text-center bg-black/40 p-2 rounded border border-white/5">
            <div>S: Chest 42"</div>
            <div>M: Chest 44"</div>
            <div>L: Chest 46"</div>
            <div>XL: Chest 48"</div>
          </div>
        </div>

      </div>

    </div>
  `;

  quickViewModal.classList.add("open");
  document.body.style.overflow = "hidden";
  initLucide();
}

function switchQuickViewMedia(url, type) {
  const container = document.getElementById("qv-media-container");
  if (!container) return;

  if (type === "video") {
    container.innerHTML = `
      <div class="video-responsive">
        ${url.includes("youtube") || url.includes("embed") 
          ? `<iframe src="${url}" allowfullscreen></iframe>`
          : `<video src="${url}" controls autoplay class="w-full h-full object-cover"></video>`}
      </div>
    `;
  } else {
    container.innerHTML = `
      <img src="${url}" alt="Product Media" id="qv-main-media" class="w-full aspect-[4/5] object-cover rounded-lg bg-black border border-white/10">
    `;
  }
}

function selectModalSize(productId, size) {
  selectProductSize(productId, size);
  
  const sizeText = document.getElementById("modal-selected-size-text");
  if (sizeText) sizeText.textContent = size;

  const modalSizesGroup = document.getElementById("modal-sizes-group");
  if (modalSizesGroup) {
    const btns = modalSizesGroup.querySelectorAll(".size-btn");
    btns.forEach(b => {
      if (b.textContent.trim() === size) b.classList.add("active");
      else b.classList.remove("active");
    });
  }

  const product = currentProducts.find(p => p.id === productId);
  if (product) {
    const modalWaBtn = document.getElementById("modal-wa-btn");
    if (modalWaBtn) {
      const waText = encodeURIComponent(
        `Hey Aura Studios! I want to order the ${product.name} in Size ${size} (₹${product.price}). Is this available for pickup at Waman Nagar or delivery in Khamgaon?`
      );
      modalWaBtn.href = `https://wa.me/${AURA_CONFIG.whatsappNumber}?text=${waText}`;
    }
  }
}

function closeQuickViewModal() {
  if (quickViewModal) {
    quickViewModal.classList.remove("open");
    document.body.style.overflow = "";
  }
}

if (closeQuickViewBtn) {
  closeQuickViewBtn.addEventListener("click", closeQuickViewModal);
}
if (quickViewModal) {
  quickViewModal.addEventListener("click", (e) => {
    if (e.target === quickViewModal) closeQuickViewModal();
  });
}

// LOOKBOOK GRID RENDERER
function initLookbook() {
  if (!lookbookGrid) return;

  lookbookGrid.innerHTML = LOOKBOOK_ITEMS.map(item => `
    <div class="lookbook-item group">
      <img src="${item.image}" alt="${item.title}" loading="lazy">
      <div class="lookbook-overlay">
        <span class="font-mono text-[10px] text-[#ccff00] font-bold uppercase tracking-wider flex items-center gap-1.5">
          <i data-lucide="instagram" class="w-3.5 h-3.5"></i>
          <span>@aurastudios</span>
        </span>
        <h4 class="font-display font-bold text-white text-sm sm:text-base mt-0.5">${item.title}</h4>
        <p class="font-mono text-[11px] text-slate-300 mt-0.5">${item.fit}</p>
        <a href="${item.instagramUrl}" target="_blank" rel="noopener noreferrer" class="mt-2 inline-flex items-center gap-1 font-mono text-[11px] text-white hover:text-[#ccff00]">
          <span>View on Instagram</span>
          <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i>
        </a>
      </div>
    </div>
  `).join("");

  initLucide();
}
