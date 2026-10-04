/**
 * Aura Studios - Streetwear Brand Data & Configuration
 * Location: Waman Nagar, Khamgaon (Maharashtra, PIN: 444303)
 * WhatsApp: +91 7020563263
 * Instagram: @aurastudios
 */

const AURA_CONFIG = {
  brandName: "Aura Studios",
  tagline: "Raw Khamgaon Streetwear // 240+ GSM Heavyweight Silhouettes",
  location: "Waman Nagar, Khamgaon, Buldhana District, Maharashtra - 444303",
  shortLocation: "Waman Nagar, Khamgaon - 444303",
  phone: "+91 7020563263",
  whatsappNumber: "917020563263",
  instagramHandle: "aurastudios",
  instagramUrl: "https://instagram.com/aurastudios",
  googleMapsUrl: "https://maps.google.com/?q=Waman+Nagar+Khamgaon",
  timings: "11:00 AM – 9:30 PM (Open all 7 days)",
  perks: "Same-Day In-Store Pickup for Khamgaon & Shegaon Residents",
  adminUser: "aura studio",
  adminPass: "aurastudio1221"
};

// Default high-res streetwear catalog
const DEFAULT_PRODUCTS = [
  {
    id: "aura-drop-01",
    name: "Phantom Heavyweight Oversized Tee",
    category: "Oversized Tees",
    price: 899,
    originalPrice: 1499,
    gsm: "240 GSM French Terry",
    fit: "Drop-Shoulder Boxy Silhouette",
    color: "Vintage Washed Charcoal",
    stock: "In Stock",
    featured: true,
    badge: "Bestseller",
    description: "Crafted from 100% combed cotton 240 GSM French Terry fabric with pre-shrunk bio-wash. Features custom dropped shoulders, reinforced thick ribbed collar, and raw edge bottom stitching for the authentic raw street look.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80",
        caption: "Front Angle - Charcoal Wash"
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
        caption: "Fit & Fabric Texture"
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80",
        caption: "Street Styling Drop"
      }
    ]
  },
  {
    id: "aura-drop-02",
    name: "Acid-Wash Cyberpunk Boxy Hoodie",
    category: "Heavyweight Hoodies",
    price: 1799,
    originalPrice: 2999,
    gsm: "380 GSM Brushed Fleece",
    fit: "Ultra-Boxy Baggy Fit",
    color: "Acid Mineral Wash Black",
    stock: "In Stock",
    featured: true,
    badge: "Winter Drop",
    description: "380 GSM ultra-heavyweight brushed fleece hoodie treated with a specialized acid mineral distress wash. Deep double-layered hood without drawstrings for clean minimalist aesthetic, and heavy ribbed cuffs.",
    sizes: ["M", "L", "XL", "XXL"],
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80",
        caption: "Cyberpunk Acid Hoodie"
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80",
        caption: "Side Hood & Sleeve Detail"
      }
    ]
  },
  {
    id: "aura-drop-03",
    name: "Raw-Hem Utility Parachute Cargos",
    category: "Cargos",
    price: 1499,
    originalPrice: 2499,
    gsm: "Heavyweight Cotton Ripstop",
    fit: "Baggy Relaxed with Ankle Bungee Cord",
    color: "Matte Tactical Black",
    stock: "In Stock",
    featured: true,
    badge: "Trending",
    description: "Engineered tactical streetwear cargo pants with 6 oversized utility bellows pockets, heavy-duty snap buttons, reinforced knee darts, and adjustable elastic bungee cords at hem for tapered or balloon fit.",
    sizes: ["S", "M", "L", "XL"],
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80",
        caption: "Utility Parachute Fit"
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1000&q=80",
        caption: "Tactical Pocket Architecture"
      }
    ]
  },
  {
    id: "aura-drop-04",
    name: "Monochrome Aura Signature Graphic Tee",
    category: "Oversized Tees",
    price: 799,
    originalPrice: 1299,
    gsm: "240 GSM Combed Cotton",
    fit: "Oversized Street Cut",
    color: "Off-White / Jet Black Print",
    stock: "In Stock",
    featured: true,
    badge: "Core Collection",
    description: "Minimalist brutalist typography on the reverse featuring 'AURA STUDIOS // 444303 KHAMGAON' and subtle high-density silicone micro-logo on the left chest. Thick 1.25-inch Lycra ribbed collar.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80",
        caption: "Signature Monochrome Tee"
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=1000&q=80",
        caption: "Back Print Silhouette"
      }
    ]
  },
  {
    id: "aura-drop-05",
    name: "Vintage Washed Boxy Tee - Charcoal Acid",
    category: "Acid Wash",
    price: 949,
    originalPrice: 1599,
    gsm: "260 GSM Heavy Cotton",
    fit: "Boxy Cut Dropped Shoulder",
    color: "Acid Wash Grey",
    stock: "Low Stock",
    featured: false,
    badge: "Limited Drop",
    description: "Custom hand-distressed acid wash giving each piece a completely 1-of-1 distinct marble pattern. Heavyweight 260 GSM fabric that holds its architectural silhouette all day.",
    sizes: ["M", "L", "XL"],
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=1000&q=80",
        caption: "Charcoal Acid Wash"
      }
    ]
  },
  {
    id: "aura-drop-06",
    name: "Khamgaon Underground Oversized Hoodie",
    category: "Heavyweight Hoodies",
    price: 1899,
    originalPrice: 3199,
    gsm: "400 GSM Super-Heavy Fleece",
    fit: "Oversized Streetwear Cut",
    color: "Deep Obsidian Black",
    stock: "In Stock",
    featured: false,
    badge: "Exclusive",
    description: "Our heaviest drop yet. 400 GSM luxury brushed interior fleece built for chilly Maharashtra winters and night rides. Features custom metal aglets and kangaroo utility pocket.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1000&q=80",
        caption: "Underground Obsidian Hoodie"
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80",
        caption: "Heavy Fabric Silhouette"
      }
    ]
  }
];

// Instagram Lookbook Data
const LOOKBOOK_ITEMS = [
  {
    id: "look-01",
    title: "Night Drop // Khamgaon Central",
    fit: "Phantom Tee (XL) + Parachute Cargos",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    instagramUrl: "https://instagram.com/aurastudios",
    likes: "420+"
  },
  {
    id: "look-02",
    title: "Acid Wash Street Silhouette",
    fit: "Acid Boxy Hoodie (L)",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
    instagramUrl: "https://instagram.com/aurastudios",
    likes: "389+"
  },
  {
    id: "look-03",
    title: "Minimalist Monochrome Session",
    fit: "Aura Signature 240 GSM Tee",
    image: "https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?auto=format&fit=crop&w=800&q=80",
    instagramUrl: "https://instagram.com/aurastudios",
    likes: "512+"
  },
  {
    id: "look-04",
    title: "Urban Parachute Mobility",
    fit: "Raw-Hem Utility Cargos (Matte Black)",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
    instagramUrl: "https://instagram.com/aurastudios",
    likes: "614+"
  },
  {
    id: "look-05",
    title: "Winter Fleece Layering",
    fit: "400 GSM Heavyweight Hoodie",
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80",
    instagramUrl: "https://instagram.com/aurastudios",
    likes: "740+"
  },
  {
    id: "look-06",
    title: "Waman Nagar In-Store Fit Check",
    fit: "Vintage Washed Boxy Tee",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80",
    instagramUrl: "https://instagram.com/aurastudios",
    likes: "890+"
  }
];

// Local Storage Helper Functions
const STORAGE_KEYS = {
  PRODUCTS: "aura_studios_products_v1",
  LOOKBOOK: "aura_studios_lookbook_v1",
  CART: "aura_studios_cart_v1",
  ADMIN_AUTH: "aura_studios_auth_session"
};

function getStoredProducts() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading stored products:", e);
  }
  // Initialize with defaults if empty
  saveProducts(DEFAULT_PRODUCTS);
  return DEFAULT_PRODUCTS;
}

function saveProducts(products) {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return true;
  } catch (e) {
    console.error("Error saving products:", e);
    return false;
  }
}

function resetProductsToDefault() {
  saveProducts(DEFAULT_PRODUCTS);
  return DEFAULT_PRODUCTS;
}
