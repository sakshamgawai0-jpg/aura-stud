# Aura Studios — Streetwear E-Commerce Web Application
**Flagship Location:** Waman Nagar, Khamgaon, Buldhana District, Maharashtra (PIN: 444303)  
**WhatsApp Orders & Hotline:** `+91 7020563263`  
**Instagram:** `@aurastudios` ([https://instagram.com/aurastudios](https://instagram.com/aurastudios))  

---

## ⚡ Project Overview
Aura Studios is an ultra-responsive, dark-aesthetic streetwear e-commerce web platform engineered for modern oversized apparel, heavyweight fabrics (240+ GSM French Terry & 380 GSM fleece), and parachute tactical cargos.

The application includes:
1. **Modern Streetwear Storefront (`index.html`)**
   - Dark mode cyberpunk aesthetic (`#0a0c10` deep slate, `#181c25` matte charcoal, `#ccff00` neon lime accents).
   - Running marquee top announcement bar.
   - Interactive category pill filters (`All Drops`, `Oversized Tees`, `Acid Wash`, `Heavyweight Hoodies`, `Cargos`).
   - Live instant product search.
   - Dynamic product cards with active size selectors (`S`, `M`, `L`, `XL`, `XXL`), live INR price calculation, and discount badges.
   - **Direct WhatsApp 1-Tap CTA ("Chat to Buy")**:
     Auto-encodes message to `+917020563263`:
     > *"Hey Aura Studios! I want to order the [Product Name] in Size [Selected Size] (₹[Price]). Is this available for pickup at Waman Nagar or delivery in Khamgaon?"*
   - **Slide-Over Interactive Cart Drawer**:
     - Quantity controls, size badges, and remove actions.
     - Pickup / Delivery selector (`Store Pickup at Waman Nagar (Free)` or `Local Delivery in Khamgaon / Shegaon`).
     - Customer name and delivery landmark inputs.
     - **"Complete Order on WhatsApp"** button formatting complete order details, itemization, and totals into an instant WhatsApp checkout message.
   - **Fabric & Craftsmanship Architecture**: Detailed specs on 240 GSM French Terry, 380 GSM thermal brushed fleece, and tactical ripstop parachute fabrics.
   - **Instagram Lookbook Masonry Grid**: 6 street styling showcase items linked to `@aurastudios`.
   - **Inbuilt Google Map & Store Locator**:
     - Embedded dark-mode Google Map centered on `Waman Nagar, Khamgaon, Maharashtra 444303`.
     - Full address, daily hours (11:00 AM – 9:30 PM), direct navigation link, and phone details.
   - **Mobile Sticky Bottom Bar**: Quick 44px+ touch navigation between Drops, Store Map, Bag, and direct WhatsApp.
   - **Floating WhatsApp Widget**: Corner widget with breathing pulse animation for direct customer inquiries.

---

## 🔐 Owner Admin Panel (`admin.html`)
The Admin Panel allows the store owners to manage clothes drops, change price tags at any time, and attach unlimited photos and videos.

### Admin Credentials:
- **Username:** `aura studio`
- **Password:** `aurastudio1221`

### Key Admin Features:
1. **Changeable Price Tag Anytime**:
   - Each drop in the admin list features an **Inline Instant Price Editor**: Change the price value and click "Save" to immediately update the live storefront.
2. **Unlimited Photos & Videos**:
   - **NO LIMIT** on the number of photos or videos you can add to any product.
   - Add photos by pasting an image URL OR by clicking **"Upload From Device"** (selects single or multiple image files directly from your phone/computer and converts them for local persistence).
   - Add videos by pasting direct video URLs (MP4, YouTube embed, or Instagram links).
   - Real-time preview strip with deletion and reordering capability.
3. **Full Drops Management**:
   - Add new variety of clothes with category, GSM specs, fit silhouette, colorway, description, and available sizes (`S`, `M`, `L`, `XL`, `XXL`).
   - Modify stock status (`In Stock`, `Low Stock`, `Pre-Order`, `Sold Out`) anytime.
   - Delete drops with confirmation.
4. **Backup & Restore**:
   - **Export Catalog**: Downloads a complete `.json` file backup of your entire catalog.
   - **Import Catalog**: Restores or imports products from any `.json` backup file.
   - **Reset to Factory Drops**: Restores default showcase drops with one click.
5. **Direct Store Channels**:
   - Direct header links to WhatsApp `+91 7020563263` and Instagram `@aurastudios`.

---

## 📁 Directory Structure
```
c:\Users\sandi\.antigravity-ide\aura-studios\
├── index.html                  # Main streetwear storefront
├── admin.html                  # Secure owner admin console
├── README.md                   # Complete brand & platform documentation
├── assets/
│   ├── css/
│   │   └── style.css           # Custom streetwear aesthetic styles & animations
│   ├── js/
│   │   ├── products.js         # Brand configuration, default drops & storage helpers
│   │   ├── app.js              # Storefront catalog, cart, WhatsApp orders & lookbook
│   │   └── admin.js            # Admin authentication, price manager & unlimited media uploader
│   └── images/                 # Local image assets
```

---

## 🚀 Running Locally
You can run the web application using any local HTTP server:
```powershell
# Using Python:
python -m http.server 8899 --directory "c:\Users\sandi\.antigravity-ide\aura-studios"

# Using Node.js (npx):
npx serve "c:\Users\sandi\.antigravity-ide\aura-studios"
```
Then visit:
- **Storefront:** [http://localhost:8899/index.html](http://localhost:8899/index.html)
- **Admin Portal:** [http://localhost:8899/admin.html](http://localhost:8899/admin.html)
