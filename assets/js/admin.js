/**
 * Aura Studios - Admin Portal Script
 * Credentials:
 *   Username: aura studio
 *   Password: aurastudio1221
 * Location: Waman Nagar, Khamgaon (Maharashtra, PIN: 444303)
 */

let adminProducts = [];
let tempMediaList = []; // Holds media array for current modal product
let currentEditingId = null;

// DOM Elements - Auth
const loginScreen = document.getElementById("admin-login-screen");
const adminDashboard = document.getElementById("admin-dashboard");
const loginForm = document.getElementById("admin-login-form");
const loginUsernameInput = document.getElementById("login-username");
const loginPasswordInput = document.getElementById("login-password");
const loginErrorMsg = document.getElementById("login-error-msg");
const togglePasswordBtn = document.getElementById("toggle-password-btn");
const adminLogoutBtn = document.getElementById("admin-logout-btn");

// DOM Elements - Stats
const statTotalProducts = document.getElementById("stat-total-products");
const statTotalMedia = document.getElementById("stat-total-media");
const statCategories = document.getElementById("stat-categories");
const productsCountBadge = document.getElementById("products-count-badge");
const adminProductsList = document.getElementById("admin-products-list");
const adminSearchInput = document.getElementById("admin-search-input");

// DOM Elements - Modal & Form
const productModal = document.getElementById("product-modal");
const productModalTitle = document.getElementById("product-modal-title");
const productForm = document.getElementById("product-form");
const openAddProductBtn = document.getElementById("open-add-product-btn");
const closeProductModalBtn = document.getElementById("close-product-modal-btn");
const cancelProductModalBtn = document.getElementById("cancel-product-modal-btn");

// Form Inputs
const formProductId = document.getElementById("form-product-id");
const formName = document.getElementById("form-name");
const formCategory = document.getElementById("form-category");
const formBadge = document.getElementById("form-badge");
const formPrice = document.getElementById("form-price");
const formOriginalPrice = document.getElementById("form-original-price");
const formStock = document.getElementById("form-stock");
const formGsm = document.getElementById("form-gsm");
const formFit = document.getElementById("form-fit");
const formColor = document.getElementById("form-color");
const formDescription = document.getElementById("form-description");

// Media Elements
const mediaCountBadge = document.getElementById("media-count-badge");
const newPhotoUrlInput = document.getElementById("new-photo-url");
const addPhotoUrlBtn = document.getElementById("add-photo-url-btn");
const uploadImageInput = document.getElementById("upload-image-input");
const newVideoUrlInput = document.getElementById("new-video-url");
const addVideoUrlBtn = document.getElementById("add-video-url-btn");
const mediaPreviewContainer = document.getElementById("media-preview-container");

// Backup & Reset Buttons
const exportCatalogBtn = document.getElementById("export-catalog-btn");
const importCatalogInput = document.getElementById("import-catalog-input");
const resetCatalogBtn = document.getElementById("reset-catalog-btn");
const toastContainer = document.getElementById("toast-container");

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  checkAuthSession();
  initAuthListeners();
  initModalListeners();
  initMediaListeners();
  initBackupListeners();
  initSearchListener();
});

function initLucide() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Toast Notification
function showAdminToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = "toast";
  
  let iconHtml = `<i data-lucide="check-circle" class="w-5 h-5 text-[#ccff00] shrink-0"></i>`;
  if (type === "error") {
    iconHtml = `<i data-lucide="alert-circle" class="w-5 h-5 text-red-400 shrink-0"></i>`;
  } else if (type === "info") {
    iconHtml = `<i data-lucide="info" class="w-5 h-5 text-[#00f2fe] shrink-0"></i>`;
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

// ================= AUTHENTICATION =================
function checkAuthSession() {
  const isAuth = sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
  if (isAuth === "true") {
    showDashboard();
  } else {
    showLogin();
  }
}

function showLogin() {
  loginScreen.classList.remove("hidden");
  adminDashboard.classList.add("hidden");
  initLucide();
}

function showDashboard() {
  loginScreen.classList.add("hidden");
  adminDashboard.classList.remove("hidden");
  loadAdminProducts();
  initLucide();
}

function initAuthListeners() {
  // Login Form
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const enteredUser = (loginUsernameInput.value || "").trim().toLowerCase();
      const enteredPass = (loginPasswordInput.value || "").trim();

      const targetUser = AURA_CONFIG.adminUser.toLowerCase();
      const targetPass = AURA_CONFIG.adminPass;

      if (enteredUser === targetUser && enteredPass === targetPass) {
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, "true");
        loginErrorMsg.classList.add("hidden");
        showDashboard();
        showAdminToast("Welcome to Aura Studios Admin Console!");
      } else {
        loginErrorMsg.classList.remove("hidden");
        loginPasswordInput.value = "";
      }
    });
  }

  // Toggle Password Visibility
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener("click", () => {
      const type = loginPasswordInput.getAttribute("type") === "password" ? "text" : "password";
      loginPasswordInput.setAttribute("type", type);
    });
  }

  // Logout
  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
      showLogin();
      showAdminToast("Logged out successfully.", "info");
    });
  }
}

// ================= CATALOG DASHBOARD =================
function loadAdminProducts() {
  adminProducts = getStoredProducts();
  updateStats();
  renderAdminProductsList();
}

function updateStats() {
  if (statTotalProducts) statTotalProducts.textContent = adminProducts.length;
  if (productsCountBadge) productsCountBadge.textContent = `${adminProducts.length} items`;

  // Calculate total media items (photos & videos)
  let totalMedia = 0;
  const categoriesSet = new Set();
  
  adminProducts.forEach(p => {
    if (p.category) categoriesSet.add(p.category);
    if (Array.isArray(p.media)) {
      totalMedia += p.media.length;
    }
  });

  if (statTotalMedia) statTotalMedia.textContent = totalMedia;
  if (statCategories) statCategories.textContent = categoriesSet.size;
}

function renderAdminProductsList() {
  if (!adminProductsList) return;

  const query = (adminSearchInput ? adminSearchInput.value.trim().toLowerCase() : "");

  const filtered = adminProducts.filter(p => {
    if (!query) return true;
    return p.name.toLowerCase().includes(query) ||
           (p.category && p.category.toLowerCase().includes(query)) ||
           (p.gsm && p.gsm.toLowerCase().includes(query));
  });

  if (filtered.length === 0) {
    adminProductsList.innerHTML = `
      <div class="text-center py-16 bg-[#141720] rounded-xl border border-white/10 text-slate-400">
        <i data-lucide="package-search" class="w-12 h-12 mx-auto text-slate-600 mb-2"></i>
        <p class="font-mono text-sm text-white font-bold">No clothes items match your query</p>
        <p class="text-xs text-slate-500 mt-1">Try another search term or click 'Add New Clothes / Drop'.</p>
      </div>
    `;
    initLucide();
    return;
  }

  adminProductsList.innerHTML = filtered.map(product => {
    const firstMedia = (product.media && product.media.length > 0) 
      ? product.media[0] 
      : { type: 'image', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80' };

    const mediaCount = (product.media && product.media.length) ? product.media.length : 0;
    const hasVideo = product.media && product.media.some(m => m.type === 'video');

    return `
      <div class="glass-panel p-4 sm:p-5 rounded-xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:border-white/20 transition-all">
        
        <!-- Left Item Info -->
        <div class="flex items-center gap-4 min-w-0">
          <div class="w-16 h-20 rounded-lg overflow-hidden bg-black border border-white/10 shrink-0 relative">
            <img src="${firstMedia.url}" alt="${product.name}" class="w-full h-full object-cover">
            <span class="absolute bottom-1 right-1 bg-black/80 text-[10px] font-mono px-1 rounded text-white border border-white/10">
              ${mediaCount}
            </span>
          </div>

          <div class="min-w-0 space-y-1">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-mono text-[10px] uppercase tracking-wider text-[#ccff00] font-bold">${product.category}</span>
              ${product.badge ? `<span class="street-badge text-[9px] py-0">${product.badge}</span>` : ''}
              ${hasVideo ? `<span class="bg-[#00f2fe]/20 text-[#00f2fe] text-[9px] font-mono px-1.5 py-0.5 rounded font-bold">Has Video</span>` : ''}
            </div>

            <h3 class="font-display font-bold text-base text-white truncate">${product.name}</h3>

            <p class="font-mono text-xs text-slate-400">
              ${product.gsm || '240 GSM'} • ${product.fit || 'Boxy Cut'} • ${(product.sizes || []).join(", ")}
            </p>
          </div>
        </div>

        <!-- Middle Quick Price Editor & Stock (Changeable anytime) -->
        <div class="flex flex-wrap items-center gap-4 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
          
          <!-- Inline Quick Price Editor -->
          <div class="flex items-center gap-2 bg-[#181c25] p-2 rounded-lg border border-white/10">
            <span class="font-mono text-xs text-[#ccff00] font-bold">Price: ₹</span>
            <input type="number" 
                   value="${product.price}" 
                   id="inline-price-${product.id}"
                   min="1"
                   class="w-20 bg-black/40 border border-white/15 rounded px-2 py-1 text-xs font-mono font-bold text-white text-center focus:outline-none focus:border-[#ccff00]"
                   title="Editable anytime! Type new price and click Save">
            <button type="button" 
                    onclick="saveInlinePrice('${product.id}')" 
                    class="btn-primary text-xs py-1 px-2.5 font-bold"
                    title="Save price change to live store">
              <i data-lucide="check" class="w-3.5 h-3.5"></i>
              <span>Save</span>
            </button>
          </div>

          <!-- Stock Status Badge Selector -->
          <select onchange="updateProductStock('${product.id}', this.value)" 
                  class="bg-[#181c25] border border-white/15 rounded-lg px-2.5 py-1.5 font-mono text-xs text-slate-200 focus:outline-none focus:border-[#ccff00]">
            <option value="In Stock" ${product.stock === 'In Stock' ? 'selected' : ''}>In Stock</option>
            <option value="Low Stock" ${product.stock === 'Low Stock' ? 'selected' : ''}>Low Stock</option>
            <option value="Pre-Order" ${product.stock === 'Pre-Order' ? 'selected' : ''}>Pre-Order</option>
            <option value="Sold Out" ${product.stock === 'Sold Out' ? 'selected' : ''}>Sold Out</option>
          </select>

        </div>

        <!-- Right Action Buttons -->
        <div class="flex items-center gap-2 self-end md:self-center">
          <button type="button" 
                  onclick="openEditProductModal('${product.id}')" 
                  class="btn-secondary text-xs py-2 px-3 hover:border-[#ccff00] hover:text-[#ccff00]"
                  title="Edit All Details & Media">
            <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
            <span>Edit</span>
          </button>

          <button type="button" 
                  onclick="deleteProduct('${product.id}')" 
                  class="p-2 rounded bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/10 transition-colors"
                  title="Delete Drop">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>

      </div>
    `;
  }).join("");

  initLucide();
}

// INLINE INSTANT PRICE UPDATE (Requested: "a price tag which is changeable any time by them")
function saveInlinePrice(productId) {
  const input = document.getElementById(`inline-price-${productId}`);
  if (!input) return;

  const newPrice = parseInt(input.value, 10);
  if (isNaN(newPrice) || newPrice <= 0) {
    showAdminToast("Please enter a valid price amount.", "error");
    return;
  }

  const product = adminProducts.find(p => p.id === productId);
  if (product) {
    product.price = newPrice;
    saveProducts(adminProducts);
    showAdminToast(`Price for "${product.name}" updated to ₹${newPrice}!`);
  }
}

// QUICK STOCK UPDATE
function updateProductStock(productId, newStock) {
  const product = adminProducts.find(p => p.id === productId);
  if (product) {
    product.stock = newStock;
    saveProducts(adminProducts);
    showAdminToast(`Stock updated to "${newStock}" for ${product.name}`);
  }
}

// DELETE PRODUCT
function deleteProduct(productId) {
  const product = adminProducts.find(p => p.id === productId);
  const name = product ? product.name : "Item";

  if (confirm(`Are you sure you want to delete "${name}" from Aura Studios drops?`)) {
    adminProducts = adminProducts.filter(p => p.id !== productId);
    saveProducts(adminProducts);
    loadAdminProducts();
    showAdminToast(`Deleted "${name}"`, "info");
  }
}

// SEARCH LISTENER
function initSearchListener() {
  if (adminSearchInput) {
    adminSearchInput.addEventListener("input", () => {
      renderAdminProductsList();
    });
  }
}

// ================= MODAL & UNLIMITED MEDIA MANAGER =================
function initModalListeners() {
  if (openAddProductBtn) {
    openAddProductBtn.addEventListener("click", () => openAddProductModal());
  }
  if (closeProductModalBtn) {
    closeProductModalBtn.addEventListener("click", closeProductModal);
  }
  if (cancelProductModalBtn) {
    cancelProductModalBtn.addEventListener("click", closeProductModal);
  }

  // Close modal when clicking on overlay background
  if (productModal) {
    productModal.addEventListener("click", (e) => {
      if (e.target === productModal) closeProductModal();
    });
  }

  // Form submit
  if (productForm) {
    productForm.addEventListener("submit", handleProductFormSubmit);
  }
}

function openAddProductModal() {
  currentEditingId = null;
  productModalTitle.textContent = "ADD NEW CLOTHES DROP";
  productForm.reset();
  formProductId.value = "";
  tempMediaList = [];
  renderMediaPreview();

  // Pre-check default sizes
  const sizeCheckboxes = productForm.querySelectorAll("input[name='sizes']");
  sizeCheckboxes.forEach(cb => {
    cb.checked = (cb.value === "M" || cb.value === "L" || cb.value === "XL");
  });

  productModal.classList.add("open");
  document.body.style.overflow = "hidden";
  initLucide();
}

function openEditProductModal(productId) {
  const product = adminProducts.find(p => p.id === productId);
  if (!product) return;

  currentEditingId = productId;
  productModalTitle.textContent = `EDIT DROP: ${product.name}`;
  
  formProductId.value = product.id;
  formName.value = product.name || "";
  formCategory.value = product.category || "Oversized Tees";
  formBadge.value = product.badge || "";
  formPrice.value = product.price || "";
  formOriginalPrice.value = product.originalPrice || "";
  formStock.value = product.stock || "In Stock";
  formGsm.value = product.gsm || "";
  formFit.value = product.fit || "";
  formColor.value = product.color || "";
  formDescription.value = product.description || "";

  // Set size checkboxes
  const productSizes = product.sizes || [];
  const sizeCheckboxes = productForm.querySelectorAll("input[name='sizes']");
  sizeCheckboxes.forEach(cb => {
    cb.checked = productSizes.includes(cb.value);
  });

  // Load product media (clone array so edits don't mutate until saved)
  tempMediaList = Array.isArray(product.media) ? JSON.parse(JSON.stringify(product.media)) : [];
  renderMediaPreview();

  productModal.classList.add("open");
  document.body.style.overflow = "hidden";
  initLucide();
}

function closeProductModal() {
  productModal.classList.remove("open");
  document.body.style.overflow = "";
}

// Media Listeners (Add Photo URL, Upload Local Image, Add Video URL)
function initMediaListeners() {
  // 1. Add Photo via URL
  if (addPhotoUrlBtn) {
    addPhotoUrlBtn.addEventListener("click", () => {
      const url = newPhotoUrlInput ? newPhotoUrlInput.value.trim() : "";
      if (!url) {
        showAdminToast("Please paste an image URL", "error");
        return;
      }
      tempMediaList.push({
        type: "image",
        url: url,
        caption: `Photo ${tempMediaList.length + 1}`
      });
      newPhotoUrlInput.value = "";
      renderMediaPreview();
      showAdminToast("Photo added to drop gallery!");
    });
  }

  // 2. Upload Local File (from computer or phone camera)
  if (uploadImageInput) {
    uploadImageInput.addEventListener("change", (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      let processed = 0;
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          tempMediaList.push({
            type: "image",
            url: event.target.result,
            caption: file.name
          });
          processed++;
          if (processed === files.length) {
            renderMediaPreview();
            showAdminToast(`Uploaded ${files.length} photo${files.length > 1 ? 's' : ''}!`);
            uploadImageInput.value = "";
          }
        };
        reader.readAsDataURL(file);
      });
    });
  }

  // 3. Add Video via URL
  if (addVideoUrlBtn) {
    addVideoUrlBtn.addEventListener("click", () => {
      const url = newVideoUrlInput ? newVideoUrlInput.value.trim() : "";
      if (!url) {
        showAdminToast("Please paste a video URL", "error");
        return;
      }
      tempMediaList.push({
        type: "video",
        url: url,
        caption: `Video Drop ${tempMediaList.length + 1}`
      });
      newVideoUrlInput.value = "";
      renderMediaPreview();
      showAdminToast("Video attached to drop!");
    });
  }
}

// Render Preview Strip for attached photos & videos
function renderMediaPreview() {
  if (!mediaPreviewContainer) return;

  if (mediaCountBadge) {
    mediaCountBadge.textContent = `${tempMediaList.length} Media Attached (Unlimited)`;
  }

  if (tempMediaList.length === 0) {
    mediaPreviewContainer.innerHTML = `
      <div class="col-span-full py-6 text-center text-slate-500 font-mono text-xs border border-dashed border-white/10 rounded-lg">
        No photos or videos attached yet. Add image URLs or upload from device above!
      </div>
    `;
    return;
  }

  mediaPreviewContainer.innerHTML = tempMediaList.map((media, index) => `
    <div class="relative rounded-lg overflow-hidden border border-white/15 bg-black aspect-[3/4] group">
      
      ${media.type === 'video' ? `
        <div class="w-full h-full flex flex-col items-center justify-center p-2 bg-[#12151c] text-[#00f2fe]">
          <i data-lucide="video" class="w-6 h-6 mb-1"></i>
          <span class="text-[9px] font-mono font-bold text-center line-clamp-1">Video</span>
        </div>
      ` : `
        <img src="${media.url}" alt="Media Preview" class="w-full h-full object-cover">
      `}

      <!-- Delete Button on hover/touch -->
      <button type="button" 
              onclick="removeMediaItem(${index})" 
              class="absolute top-1 right-1 p-1 bg-black/80 hover:bg-red-500 rounded text-white transition-colors"
              title="Remove media">
        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
      </button>

      <!-- Badge indicating Image or Video -->
      <span class="absolute bottom-1 left-1 bg-black/75 text-[9px] font-mono px-1 rounded text-slate-300">
        #${index + 1} ${media.type === 'video' ? '🎬' : '📷'}
      </span>

    </div>
  `).join("");

  initLucide();
}

function removeMediaItem(index) {
  tempMediaList.splice(index, 1);
  renderMediaPreview();
}

// SUBMIT PRODUCT FORM
function handleProductFormSubmit(e) {
  e.preventDefault();

  const name = formName.value.trim();
  const category = formCategory.value;
  const badge = formBadge.value.trim();
  const price = parseInt(formPrice.value, 10);
  const originalPrice = formOriginalPrice.value ? parseInt(formOriginalPrice.value, 10) : null;
  const stock = formStock.value;
  const gsm = formGsm.value.trim();
  const fit = formFit.value.trim();
  const color = formColor.value.trim();
  const description = formDescription.value.trim();

  // Collect checked sizes
  const selectedSizes = [];
  const sizeCheckboxes = productForm.querySelectorAll("input[name='sizes']:checked");
  sizeCheckboxes.forEach(cb => selectedSizes.push(cb.value));

  if (selectedSizes.length === 0) {
    selectedSizes.push("Free");
  }

  // Ensure at least one image exists, or assign default placeholder
  let finalMedia = [...tempMediaList];
  if (finalMedia.length === 0) {
    finalMedia.push({
      type: "image",
      url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
      caption: "Default Streetwear Placeholder"
    });
  }

  if (currentEditingId) {
    // Update existing product
    const index = adminProducts.findIndex(p => p.id === currentEditingId);
    if (index > -1) {
      adminProducts[index] = {
        ...adminProducts[index],
        name,
        category,
        badge,
        price,
        originalPrice,
        stock,
        gsm,
        fit,
        color,
        description,
        sizes: selectedSizes,
        media: finalMedia
      };
      showAdminToast(`Updated drop: "${name}"`);
    }
  } else {
    // Create brand new product
    const newProduct = {
      id: `aura-drop-${Date.now()}`,
      name,
      category,
      badge: badge || "New Drop",
      price,
      originalPrice,
      stock,
      gsm: gsm || "240 GSM French Terry",
      fit: fit || "Drop-Shoulder Boxy",
      color: color || "Vintage Washed",
      description: description || "Heavyweight custom cut streetwear piece by Aura Studios Khamgaon.",
      sizes: selectedSizes,
      media: finalMedia,
      featured: true
    };
    adminProducts.unshift(newProduct);
    showAdminToast(`New clothes drop "${name}" added successfully!`);
  }

  saveProducts(adminProducts);
  closeProductModal();
  loadAdminProducts();
}

// ================= BACKUP & CATALOG EXPORT/IMPORT =================
function initBackupListeners() {
  // Export JSON Backup
  if (exportCatalogBtn) {
    exportCatalogBtn.addEventListener("click", () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(adminProducts, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `aura-studios-drops-backup-${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showAdminToast("Catalog exported as JSON backup!");
    });
  }

  // Import JSON Backup
  if (importCatalogInput) {
    importCatalogInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (Array.isArray(imported)) {
            adminProducts = imported;
            saveProducts(adminProducts);
            loadAdminProducts();
            showAdminToast("Catalog successfully restored from backup!");
          } else {
            showAdminToast("Invalid backup file format.", "error");
          }
        } catch (err) {
          showAdminToast("Could not parse JSON file.", "error");
        }
        importCatalogInput.value = "";
      };
      reader.readAsText(file);
    });
  }

  // Reset to Default Drops
  if (resetCatalogBtn) {
    resetCatalogBtn.addEventListener("click", () => {
      if (confirm("Reset catalog to Aura Studios factory default drops? Any custom items will be restored to defaults.")) {
        adminProducts = resetProductsToDefault();
        loadAdminProducts();
        showAdminToast("Catalog restored to factory drops.");
      }
    });
  }
}
