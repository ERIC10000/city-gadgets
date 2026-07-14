/**
 * Parses the raw City Gadgets price list into structured seed data:
 *  - src/data/seed/products.generated.json (consumed by the app's local-fallback data layer)
 *  - supabase/seed.sql (INSERT statements for a real Supabase project)
 *
 * Run with: npm run seed:generate
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

type CategoryDef = {
  slug: string;
  name: string;
  icon: string;
  heroTagline: string;
  heroImage: string;
  imagePool: string[];
  specTemplate: (name: string) => Record<string, string>;
};

// Every ID below was downloaded and visually inspected (not just HTTP-200
// checked) to confirm it actually depicts the right product category —
// earlier passes left mismatches (a shoe, a running sneaker, a flatlay) in
// the pool from unverified guesses, so this list is the corrected set.
const IMG = (id: string) => `https://images.unsplash.com/photo-${id}?w=900&q=80&auto=format&fit=crop`;
const HERO = (id: string) => `https://images.unsplash.com/photo-${id}?w=1600&q=80&auto=format&fit=crop`;

function ramSpec(name: string): string | null {
  const m = name.match(/(\d+)\s*\/\s*(\d+)\s*(gb|tb)/i);
  if (m) return `${m[1]}GB RAM / ${m[2]}${m[3].toUpperCase()}`;
  return null;
}
function storageSpec(name: string): string | null {
  const m = name.match(/(\d+)\s*(gb|tb)\b/gi);
  if (!m) return null;
  return m[m.length - 1].toUpperCase().replace(/\s+/g, "");
}

const CATEGORIES: CategoryDef[] = [
  {
    slug: "consoles",
    name: "Gaming Consoles & Handhelds",
    icon: "sports_esports",
    heroTagline: "Next-gen power, zero compromise.",
    heroImage: HERO("1606813907291-d86efa9b94db"),
    imagePool: [
      IMG("1622297845775-5ff3fef71d13"), // PS5 console + DualSense
      IMG("1486401899868-0e435ed85128"), // PS4 console + controller
      IMG("1592155931584-901ac15763e3"), // DualShock controller close-up
      IMG("1580327344181-c1163234e5a0"), // two controllers on yellow bg
      IMG("1606813907291-d86efa9b94db"), // PS5 logo close-up
      IMG("1622979135225-d2ba269cf1ac"), // Meta Quest / Oculus headset
    ],
    specTemplate: (name) => ({
      Storage: storageSpec(name) ?? "Varies",
      Connectivity: /switch|steam deck|legion|rog/i.test(name) ? "Wi-Fi 6, Bluetooth 5.0" : "Wi-Fi 6, Bluetooth 5.1, USB-C",
      Resolution: /quest|vr/i.test(name) ? "Mixed Reality passthrough" : "Up to 4K HDR",
    }),
  },
  {
    slug: "gaming-accessories",
    name: "Gaming Accessories",
    icon: "sports_esports",
    heroTagline: "Level up your setup.",
    heroImage: HERO("1615663245857-ac93bb7c39e7"),
    imagePool: [
      IMG("1592155931584-901ac15763e3"), // DualShock controller
      IMG("1615663245857-ac93bb7c39e7"), // gaming mouse
      IMG("1580327344181-c1163234e5a0"), // two controllers
    ],
    specTemplate: () => ({
      Compatibility: "PS5 / PS4 / Xbox / Switch (model-specific)",
      Connection: "Wireless / USB-C",
      Warranty: "1 Year",
    }),
  },
  {
    slug: "audio",
    name: "Audio & Mics",
    icon: "headphones",
    heroTagline: "Studio-grade sound, anywhere.",
    heroImage: HERO("1546435770-a3e426bf472b"),
    imagePool: [
      IMG("1484704849700-f032a568e944"), // over-ear headphones, silver/brown
      IMG("1487215078519-e21cc028cb29"), // over-ear headphones, dark
      IMG("1524678606370-a47ad25cb82a"), // headphones on pastel background
      IMG("1546435770-a3e426bf472b"), // Sony headphones on desk
      IMG("1590658268037-6bf12165a8df"), // AirPods Pro in case
      IMG("1608156639585-b3a032ef9689"), // Apple EarPods
      IMG("1550009158-9ebf69173e03"), // Sony headphones on keyboard
    ],
    specTemplate: (name) => ({
      Type: /mic/i.test(name) ? "Wireless Lavalier Mic" : /earbuds|airpods/i.test(name) ? "In-ear" : "Over-ear",
      "Battery Life": /mic/i.test(name) ? "Up to 8 hrs" : "Up to 30 hrs (ANC on)",
      Connectivity: "Bluetooth 5.3",
    }),
  },
  {
    slug: "cameras",
    name: "Action Cameras & Gimbals",
    icon: "photo_camera",
    heroTagline: "Capture every angle in motion.",
    heroImage: HERO("1526406915894-7bcd65f60845"),
    imagePool: [
      IMG("1516035069371-29a1b244cc32"), // camera + lenses on black
      IMG("1502982720700-bfff97f2ecac"), // DSLR + lens, dramatic
      IMG("1500634245200-e5245c7574ef"), // Canon camera, white bg
      IMG("1526406915894-7bcd65f60845"), // full camera-gear flatlay incl. drone
    ],
    specTemplate: (name) => ({
      "Video Resolution": /8k/i.test(name) ? "8K30" : /hero 13|hero 11/i.test(name) ? "5.3K60" : "4K60",
      Stabilization: /gimbal|osmo|mobile/i.test(name) ? "3-Axis Mechanical + EIS" : "HyperSmooth / FlowState",
      "Water Resistance": /gopro|osmo pocket|insta360/i.test(name) ? "Waterproof to 10m" : "Splash resistant",
    }),
  },
  {
    slug: "wearables",
    name: "Smartwatches & Rings",
    icon: "watch",
    heroTagline: "Precision on your wrist.",
    heroImage: HERO("1508685096489-7aacd43bd3b1"),
    imagePool: [
      IMG("1579586337278-3befd40fd17a"), // Apple Watch, app grid
      IMG("1508685096489-7aacd43bd3b1"), // watch on wrist, lifestyle
      IMG("1434493907317-a46b5bbe7834"), // watch on wrist, close-up
    ],
    specTemplate: (name) => ({
      Display: /ring/i.test(name) ? "N/A (LED indicator)" : "Always-On Retina / AMOLED",
      "Battery Life": /ultra/i.test(name) ? "Up to 36 hrs" : /ring/i.test(name) ? "Up to 7 days" : "Up to 18 hrs",
      "Water Resistance": "5 ATM / IP68",
    }),
  },
  {
    slug: "macbooks",
    name: "Laptops & Computers",
    icon: "laptop_mac",
    heroTagline: "Pro-grade performance for work and play.",
    heroImage: HERO("1531297484001-80022131f5a1"),
    imagePool: [
      IMG("1541807084-5c52b6b3adef"), // clean MacBook on desk
      IMG("1531297484001-80022131f5a1"), // dramatic backlit laptop
      IMG("1580927752452-89d86da3fa0a"), // dramatic backlit laptop (alt angle)
    ],
    specTemplate: (name): Record<string, string> => {
      const isApple = /macbook|mac mini|imac/i.test(name);
      const isGaming = /rog|legion|predator|stealth|blade|zephyrus|alienware|helios/i.test(name);
      if (isApple) {
        return {
          Chip: /pro chip/i.test(name) ? "Apple M5 Pro" : /m5/i.test(name) ? "Apple M5" : /m4/i.test(name) ? "Apple M4" : "Apple Silicon",
          Memory: ramSpec(name) ?? "16GB Unified Memory",
          Display: /pro/i.test(name) ? '14–16" Liquid Retina XDR' : '13–15" Liquid Retina',
        };
      }
      return {
        Processor: isGaming ? "Intel Core i9 + RTX 40-series" : "Intel Core Ultra 7 / AMD Ryzen",
        Memory: "16GB RAM · 512GB–1TB SSD",
        Display: isGaming ? '16" QHD+ 240Hz' : '14–16" FHD+ / OLED',
        Warranty: "12 Months",
      };
    },
  },
  {
    slug: "tablets",
    name: "Tablets",
    icon: "tablet_mac",
    heroTagline: "A pro studio that fits in one hand.",
    heroImage: HERO("1585790050230-5dd28404ccb9"),
    imagePool: [
      IMG("1561154464-82e9adf32764"), // iPad in hand, lifestyle
      IMG("1585790050230-5dd28404ccb9"), // two iPads side by side
    ],
    specTemplate: (name): Record<string, string> => {
      const isApple = /ipad/i.test(name);
      return {
        Storage: storageSpec(name) ?? "128GB",
        Connectivity: /5g/i.test(name) ? "Wi-Fi + 5G" : "Wi-Fi",
        Chip: isApple
          ? /pro/i.test(name)
            ? "Apple M5"
            : /air/i.test(name)
              ? "Apple M4"
              : "Apple A16"
          : /surface/i.test(name)
            ? "Snapdragon X Plus"
            : "Snapdragon 8 / Octa-core",
      };
    },
  },
  {
    slug: "streaming",
    name: "Streaming Devices",
    icon: "tv",
    heroTagline: "Every app, every screen, instantly.",
    heroImage: HERO("1522869635100-9f4c5e86aa37"),
    imagePool: [
      IMG("1522869635100-9f4c5e86aa37"), // TV showing Netflix + remote
      IMG("1519558260268-cde7e03a0152"), // smart speaker + phone
    ],
    specTemplate: (name) => ({
      Resolution: /4k/i.test(name) ? "4K Ultra HD, HDR10+" : "Full HD",
      Storage: /apple tv/i.test(name) ? (storageSpec(name) ?? "64GB") : "8GB",
      Remote: "Voice remote included",
    }),
  },
  {
    slug: "accessories",
    name: "Tech Accessories",
    icon: "cable",
    heroTagline: "The small parts that make it perfect.",
    heroImage: HERO("1587829741301-dc798b83add3"),
    imagePool: [
      IMG("1587829741301-dc798b83add3"), // Apple Magic Keyboard
      IMG("1615663245857-ac93bb7c39e7"), // gaming/precision mouse
    ],
    specTemplate: (name) => ({
      Compatibility: /ipad|pencil/i.test(name) ? "iPad (model-specific)" : /mac|magic/i.test(name) ? "Mac (USB-C / Bluetooth)" : "Universal",
      Connection: /type c|touch id/i.test(name) ? "USB-C" : "Bluetooth",
    }),
  },
  {
    slug: "phones",
    name: "Latest Mobile Phones",
    icon: "smartphone",
    heroTagline: "The newest flagships, landing in Nairobi first.",
    heroImage: HERO("1512499617640-c74ae3a79d37"),
    imagePool: [
      IMG("1592750475338-74b7b21085ab"), // iPhone camera macro
      IMG("1511707171634-5f897ff02aa9"), // iPhone home screen on desk
      IMG("1598327105666-5b89351aff97"), // Android phone home screen
      IMG("1580910051074-3eb694886505"), // iPhone lock screen on bed
      IMG("1512941937669-90a1b58e7e9c"), // phone app icons close-up
      IMG("1512499617640-c74ae3a79d37"), // phone, dramatic blue lighting
    ],
    specTemplate: (name) => {
      const n = name.toLowerCase();
      const isApple = /iphone/.test(n);
      const isFold = /fold|flip/.test(n);
      return {
        Storage: storageSpec(name) ?? "128GB",
        Display: isFold ? "Foldable AMOLED" : isApple ? "Super Retina XDR OLED" : "AMOLED, 120Hz",
        Chip: isApple ? "Apple A19 Bionic" : /pixel/.test(n) ? "Google Tensor G5" : /galaxy/.test(n) ? "Snapdragon 8 Elite" : "Octa-core",
        Camera: /pro|ultra/.test(n) ? "Triple 50MP camera system" : "Dual 50MP camera system",
      };
    },
  },
];

const RAW_CATALOG: Record<string, string> = {
  consoles: `
Ps5 pro 2tb - 143k
Ps5 slim digital - 89k
Ps5 slim disk - 95k
Ps5 slim ghost of yutei - 112k
Ps5 slim 30th edition - 115k
Ps4 slim 500gb - 37k
Ps4 slim 1tb - 38k
Ps4 pro - 39k
Playstation portal - 41k
Ps5 disk drive - 19k
Playstation VR2 - 62k
Lenovo Legion go s 1tb - 104k
Lenovo Legion go s 512gb - 95k
Lenovo legion go 2 1tb - 250k
Steam deck oled 1tb - 145k
Steam deck oled 512gb - 99k
ROG XBO ALLY X 1TB - 150k
Xbox series s 512gb - 62k
Xbox series x 1tb disk - 93k
Xbox series x digital - 86k
Nintendo switch 2 - 69k
Nintendo Switch lite - 28k
Nintendo switch oled - 45k
Nintendo switch V2 - 39k
Quest 3 512gb - 78k
Quest 3 128gb - 69k
Quest 3s 128gb - 55k
Quest 3s Xbox - 65k
Anbernic RG556 - 32k
Ayaneo Pocket S - 78k
Analogue Pocket - 45k
Atari 2600+ - 18k
`,
  "gaming-accessories": `
Logitech flight York - 48k
Logitech flight pedals - 49k
XBOX PAD - 8k
XBOX SERIES ELITE PAD - 25k
Ps5 pad white - 9400
Ps5 edge controller - 29k
Ps5 wd ssd 1tb - 38k
Ps5 wd ssd 2tb - 58k
Ps4 fc26 - 5k
Ps5 fc26 - 5k
Ps5 cooling stand - 4500
Ps5 Charging Dock - 6000
Ps5 remote - 7k
Ps5 link adapter vr2 - 8500
Ps5 vr pc adapter - 11k
Nintendo switch 2 pro controller - 13500
Nintendo switch 2 joycon - 15k
Nintendo switch Joycon's - 10500
Nintendo switch 2 camera - 9500
Logitech G29 - 39k
Logitech g920 - 38k
Razer DeathAdder V3 Pro - 22k
Razer BlackWidow V4 Pro - 28k
SteelSeries Arctis Nova Pro Wireless - 45k
SteelSeries Apex Pro TKL - 35k
HyperX Cloud III Wireless - 18k
HyperX Alloy Origins 65 - 16k
Corsair K70 RGB Pro - 24k
Turtle Beach Stealth 700 Gen 3 - 22k
8BitDo Ultimate Controller - 12k
Elgato Stream Deck MK.2 - 22k
Thrustmaster T248 Racing Wheel - 48k
Samsung 990 Pro SSD 2tb - 32k
Seagate Game Drive 2tb - 14k
`,
  audio: `
Playstation pulse explore - 29k
Pulse 3d headset - 14k
Pulse elite headset - 19k
Pulse explore - 25k
Sony 1000X collexion - 120k
Sony Xm6 headphones - 47k
Sony Xm5 headphones - 32k
Sony Xm5 Earbuds - 25k
Airpods max 2 - 82k
Airpods 4 ANC - 25k
Airpods 4 (no anc) - 17.5k
Airpods 3 (no anc) - 16.5k
Hollyland Lark M2S Combo - 18k
Hollyland Lark Max 2 - 33.5k
DJI Mic mini - 16k
DJI Mic mini 2 - 19k
DJI Mic 3 - 43k
DJI Mic 2 - 32k
DJI Mic - 23k
Bose QuietComfort Ultra Headphones - 62k
Bose QuietComfort Earbuds Ultra - 45k
Sennheiser Momentum 4 Wireless - 55k
Sennheiser Accentum Plus - 28k
JBL Tour One M2 - 38k
JBL Charge 6 - 25k
JBL Flip 7 - 16k
Beats Studio Pro - 48k
Beats Fit Pro - 28k
Sonos Ace Headphones - 58k
Sonos Era 300 - 62k
Anker Soundcore Space One - 15k
Marshall Major V - 22k
Marshall Emberton III - 24k
Jabra Elite 10 Gen 2 - 32k
Bang & Olufsen Beoplay EX - 55k
Audio-Technica ATH-M50xBT2 - 28k
Skullcandy Crusher ANC 2 - 22k
`,
  cameras: `
DJI Osmo Mobile 7P - 19k
DJI Osmo Mobile 8 - 20k
DJI Osmo mobile 8p - 23k
DJI Osmo pocket 3 Combo - 78k
DJI Osmo pocket 4 Combo - 85.5k
DJI Action 6 enhanced - 69k
Insta360 Go 3s 128gb - 48k
Insta360 X4 8k - 48k
Insta360 X5 8k - 68k
Insta360 X5 8k essential - 84k
Insta360 Invisible Selfie Stick - 5500
Insta360 Invisible Selfie Stick with tripod - 5500
GOPRO Hero 13 - 53k
GOPRO Hero 11 mini - 35k
GOPRO Hero 13 battery - 7k
Sony ZV-1 II - 92k
Sony Alpha A6700 - 165k
Canon EOS R50 - 105k
Canon PowerShot V10 - 55k
Nikon Z30 - 98k
Fujifilm X-S20 - 175k
Fujifilm Instax Mini 12 - 12k
Panasonic Lumix G100 - 88k
Zhiyun Smooth 5S - 18k
Zhiyun Crane M3S - 42k
`,
  wearables: `
Apple Watch Series 10 42mm - 49k
Apple Watch Series 10 46mm - 50k
Apple Watch Series 11 42mm - 49.5k
Apple Watch Series 11 46mm - 55k
Apple Watch Se 3 40mm - 37k
Apple Watch Se 3 44mm - 41k
Apple Watch Ultra 3 - 104k
SAMSUNG watch ultra 2025 - 45k
SAMSUNG watch 6 40mm - 23.5k
SAMSUNG Watch 7 44mm - 25k
SAMSUNG Watch 8 40mm - 29k
SAMSUNG Watch 8 44mm - 32k
Samsung Galaxy ring - 45k
Garmin Fenix 8 - 95k
Garmin Venu 3 - 62k
Garmin Forerunner 265 - 58k
Fitbit Charge 6 - 22k
Fitbit Versa 4 - 32k
Huawei Watch GT 5 Pro - 45k
Huawei Band 9 - 8k
Amazfit GTR 4 - 25k
Amazfit Active 2 - 15k
Google Pixel Watch 3 - 52k
Xiaomi Smart Band 9 - 6k
Oura Ring Gen 4 - 48k
`,
  macbooks: `
Macbook air Neo 256gb - 100k
Macbook air Neo 512gb - 105k
Macbook air M5 16/512gb - 174k
Macbook air M5 16/1tb - 195k
Macbook air M5 24/1tb - 220k
Macbook pro M5 16/512gb - 250k
Macbook pro M5 16/1tb - 275k
Macbook pro M5 24/1tb - 280k
Macbook pro M5 pro chip 24/1tb - 335k
Mac mini m4 16/256gb - 135k
Dell XPS 15 (2025) - 265k
Dell Inspiron 15 - 78k
Dell Alienware m16 - 330k
HP Spectre x360 14 - 210k
HP Pavilion 15 - 72k
HP EliteBook 840 G11 - 165k
Lenovo ThinkPad X1 Carbon Gen 13 - 255k
Lenovo IdeaPad Slim 5 - 68k
Lenovo Legion Pro 7 - 320k
Asus ROG Zephyrus G16 - 340k
Asus Zenbook 14 OLED - 155k
Acer Swift Go 14 - 95k
Acer Predator Helios 16 - 310k
MSI Stealth 16 AI Studio - 335k
Razer Blade 15 - 380k
Microsoft Surface Laptop 7 - 185k
Samsung Galaxy Book4 Pro - 195k
Huawei MateBook X Pro - 210k
LG Gram 16 - 205k
`,
  tablets: `
iPad 11th A16 wifi 128gb - 66k
iPad 11th A16 5g 128gb - 77k
iPad 11th A16 5g 256gb - 96k
iPad Air 13" M4 128gb 5g - 135k
iPad Air 13" M4 128gb - 116k
iPad Air 11" M4 128gb - 93k
iPad Air 11" M4 128gb 5g - 115k
iPad Air 11" M4 256gb 5g - 132k
iPad Mini A17 Pro 128gb - 90k
iPad Mini A17 pro 128gb 5g - 100k
iPad Pro 11" M5 256gb 5g - 162k
iPad Pro 13" M5 256gb 5g - 175k
Samsung Galaxy Tab S10 Ultra - 165k
Samsung Galaxy Tab S10+ - 130k
Samsung Galaxy Tab A9+ - 38k
Lenovo Tab P12 - 55k
Xiaomi Pad 7 Pro - 62k
Huawei MatePad 12 X - 78k
Microsoft Surface Pro 11 - 185k
Honor Pad 9 - 42k
`,
  streaming: `
Mi stick 4k 1st gen - 6600
Mi stick 4k 2nd gen - 8k
Mi stick HD - 6500
Mi box s 3rd gen - 8500
Firestick hd - 5500
Firestick 4k 2nd gen - 6500
Firestick 4k - 6200
Firestick max - 9000
Apple tv 4k 128gb - 30k
Apple tv 4k 64gb - 23k
Google TV Streamer 4k - 14k
Google Chromecast HD - 7k
Roku Streaming Stick 4k - 9k
Roku Ultra - 13k
Nvidia Shield TV Pro - 32k
Amazon Fire TV Cube - 18k
`,
  accessories: `
Apple Magic Keyboard type c - 17k
Apple Magic Keyboard - 15k
Apple Magic Keyboard with touch id - 23k
Apple Pencil pro - 19k
Apple Pencil 2 - 15k
Apple Pencil Type c - 16k
Apple Keyboard 11" for m4 air - 50k
Apple Keyboard 13" for m4 air - 56k
Apple Keyboard 11" for 10.5" pro - 35k
Apple Keyboard 11" air 4th& 5th - 45k
Apple Keyboard 11" pro 1st-4th gen - 45k
Apple Keyboard 11" pro m5/m4 - 50k
Apple Keyboard 13" pro m5/m4 - 55k
Apple Airtag 2 1pack - 6k
Apple Airtag 2 4pack - 16.5k
Apple Magic Mouse 2 - 12.5k
Apple Magic Mouse 4 - 16.5k
Apple Magic Mouse 3 - 15k
Apple trackpad black - 25k
Logitech MX Master 3S - 14k
Logitech MX Keys S - 15k
Anker 737 Power Bank - 15k
Anker Prime 100W Charger - 12k
Belkin BoostCharge Pro 3-in-1 - 18k
UGREEN Nexode 100W Charger - 9k
Baseus 65W GaN Charger - 6k
Samsung 45W Travel Adapter - 5k
Spigen Tough Armor Case - 4k
Belkin Screen Protector Pack - 3k
`,
  // Not in the client's original price list — added on request to fill out
  // the "Latest Mobile Phones" route with the brands that actually move in
  // the Nairobi market: Apple/Samsung/Google at the top end, Tecno/Infinix/
  // Xiaomi for the volume-driving mid and budget tiers.
  phones: `
iPhone 17 Pro Max 256gb - 185k
iPhone 17 Pro Max 512gb - 210k
iPhone 17 Pro 256gb - 165k
iPhone 17 128gb - 130k
iPhone Air 256gb - 145k
iPhone 16e 128gb - 95k
Samsung Galaxy S26 Ultra 256gb - 175k
Samsung Galaxy S26 Ultra 512gb - 195k
Samsung Galaxy S26+ 256gb - 140k
Samsung Galaxy Z Fold 7 - 250k
Samsung Galaxy Z Flip 7 - 155k
Samsung Galaxy A56 256gb - 45k
Google Pixel 10 Pro 256gb - 150k
Google Pixel 10 128gb - 110k
Tecno Camon 40 Pro - 32k
Tecno Phantom X3 - 55k
Infinix Note 50 Pro - 28k
Xiaomi Redmi Note 14 Pro - 35k
Xiaomi 15 Ultra 512gb - 155k
Xiaomi Poco X7 Pro - 42k
OnePlus 13 256gb - 120k
OnePlus 13R 256gb - 78k
OnePlus Nord 4 - 52k
Oppo Find X8 Pro - 135k
Oppo Reno 12 - 52k
Vivo X200 Pro - 128k
Vivo V40 5g - 48k
Realme 13 Pro Plus - 55k
Realme GT 7 Pro - 72k
Honor Magic 7 Pro - 130k
Honor 200 5g - 60k
Huawei Pura 70 Pro - 140k
Huawei Nova 13 - 65k
Nothing Phone 3 - 82k
Motorola Edge 50 Pro - 58k
Motorola Razr 50 Ultra - 115k
Nokia XR21 - 45k
Asus ROG Phone 9 - 145k
Sony Xperia 1 VI - 155k
Google Pixel 9 Pro Fold - 235k
Samsung Galaxy S26 128gb - 120k
`,
};

// Hand-picked flagship items to feature on the homepage / hero slider.
const FEATURED_NAMES = new Set([
  "ps5 pro 2tb",
  "macbook pro m5 pro chip 24/1tb",
  "apple watch ultra 3",
  "quest 3 512gb",
  "ipad pro 13\" m5 256gb 5g",
  "gopro hero 13",
  "xbox series x 1tb disk",
  "sony xm6 headphones",
  "iphone 17 pro max 256gb",
  "samsung galaxy s26 ultra 256gb",
]);

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/["']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Keyword → brand. Order matters: compound/specific patterns come before
// generic ones, and anything that could be a false-positive substring (e.g.
// "nova") is matched via the parent brand keyword instead.
function inferBrand(name: string): string {
  const n = name.toLowerCase();
  // Storage / components
  if (/wd ssd|western digital/.test(n)) return "Western Digital";
  if (/seagate/.test(n)) return "Seagate";
  // Gaming platforms & peripherals
  if (/playstation|^ps5|^ps4|pulse/.test(n)) return "Sony PlayStation";
  if (/xbox/.test(n)) return "Microsoft Xbox";
  if (/nintendo/.test(n)) return "Nintendo";
  if (/steam deck/.test(n)) return "Valve";
  if (/quest/.test(n)) return "Meta";
  if (/anbernic/.test(n)) return "Anbernic";
  if (/ayaneo/.test(n)) return "Ayaneo";
  if (/analogue/.test(n)) return "Analogue";
  if (/atari/.test(n)) return "Atari";
  if (/steelseries/.test(n)) return "SteelSeries";
  if (/hyperx/.test(n)) return "HyperX";
  if (/corsair/.test(n)) return "Corsair";
  if (/turtle beach/.test(n)) return "Turtle Beach";
  if (/8bitdo/.test(n)) return "8BitDo";
  if (/elgato/.test(n)) return "Elgato";
  if (/thrustmaster/.test(n)) return "Thrustmaster";
  if (/razer/.test(n)) return "Razer";
  if (/logitech/.test(n)) return "Logitech";
  // Laptops & computers
  if (/asus|\brog\b|zenbook/.test(n)) return "Asus";
  if (/lenovo|legion|thinkpad|ideapad/.test(n)) return "Lenovo";
  if (/\bdell\b|xps|inspiron/.test(n)) return "Dell";
  if (/\bhp\b|spectre|pavilion|elitebook/.test(n)) return "HP";
  if (/acer|predator|swift/.test(n)) return "Acer";
  if (/\bmsi\b|stealth/.test(n)) return "MSI";
  if (/\blg\b|gram/.test(n)) return "LG";
  if (/surface|microsoft/.test(n)) return "Microsoft";
  // Cameras & gimbals
  if (/dji/.test(n)) return "DJI";
  if (/insta360/.test(n)) return "Insta360";
  if (/gopro/.test(n)) return "GoPro";
  if (/canon/.test(n)) return "Canon";
  if (/nikon/.test(n)) return "Nikon";
  if (/fujifilm|instax/.test(n)) return "Fujifilm";
  if (/panasonic|lumix/.test(n)) return "Panasonic";
  if (/zhiyun/.test(n)) return "Zhiyun";
  if (/hollyland/.test(n)) return "Hollyland";
  // Audio
  if (/bose/.test(n)) return "Bose";
  if (/sennheiser/.test(n)) return "Sennheiser";
  if (/\bjbl\b/.test(n)) return "JBL";
  if (/beats/.test(n)) return "Beats";
  if (/sonos/.test(n)) return "Sonos";
  if (/anker|soundcore/.test(n)) return "Anker";
  if (/marshall/.test(n)) return "Marshall";
  if (/jabra/.test(n)) return "Jabra";
  if (/bang & olufsen|beoplay/.test(n)) return "Bang & Olufsen";
  if (/audio-technica|ath-/.test(n)) return "Audio-Technica";
  if (/skullcandy/.test(n)) return "Skullcandy";
  // Wearables
  if (/garmin|fenix|forerunner/.test(n)) return "Garmin";
  if (/fitbit/.test(n)) return "Fitbit";
  if (/amazfit/.test(n)) return "Amazfit";
  if (/oura/.test(n)) return "Oura";
  // Streaming
  if (/roku/.test(n)) return "Roku";
  if (/nvidia|shield tv/.test(n)) return "Nvidia";
  if (/firestick|fire tv|amazon/.test(n)) return "Amazon";
  // Phone / tablet / accessory brands
  if (/oneplus/.test(n)) return "OnePlus";
  if (/oppo/.test(n)) return "Oppo";
  if (/vivo/.test(n)) return "Vivo";
  if (/realme/.test(n)) return "Realme";
  if (/honor/.test(n)) return "Honor";
  if (/huawei|matebook|matepad/.test(n)) return "Huawei";
  if (/nothing/.test(n)) return "Nothing";
  if (/motorola|moto edge/.test(n)) return "Motorola";
  if (/nokia/.test(n)) return "Nokia";
  if (/belkin/.test(n)) return "Belkin";
  if (/ugreen/.test(n)) return "UGREEN";
  if (/baseus/.test(n)) return "Baseus";
  if (/spigen/.test(n)) return "Spigen";
  if (/tecno/.test(n)) return "Tecno";
  if (/infinix/.test(n)) return "Infinix";
  if (/xiaomi|redmi|mi stick|mi box|\bmi pad\b|poco/.test(n)) return "Xiaomi";
  if (/pixel|chromecast|google/.test(n)) return "Google";
  if (/samsung|galaxy/.test(n)) return "Samsung";
  if (/sony/.test(n)) return "Sony";
  if (/airpods|apple|macbook|mac mini|ipad|imac|iphone/.test(n)) return "Apple";
  return "City Gadgets";
}

// Small deterministic hash so re-runs produce identical stock/rating data.
function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

type SeedProduct = {
  slug: string;
  name: string;
  brand: string;
  category_slug: string;
  price: number;
  compare_at_price: number | null;
  condition: "new" | "refurbished";
  is_featured: boolean;
  badge: string | null;
  stock_quantity: number;
  rating: number;
  review_count: number;
  description: string;
  specs: Record<string, string>;
  images: { url: string; alt: string }[];
};

function parsePrice(raw: string): number {
  const trimmed = raw.trim();
  const hasK = /k$/i.test(trimmed);
  const numeric = parseFloat(trimmed.replace(/k$/i, ""));
  return Math.round(hasK ? numeric * 1000 : numeric);
}

const products: SeedProduct[] = [];
const seenSlugs = new Map<string, number>();

for (const category of CATEGORIES) {
  const raw = RAW_CATALOG[category.slug];
  if (!raw) continue;
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  lines.forEach((line, idx) => {
    const match = line.match(/^(.+?)\s*-\s*([\d.]+\s*k?)$/i);
    if (!match) {
      console.warn(`Could not parse line in ${category.slug}: "${line}"`);
      return;
    }
    const name = match[1].trim();
    const price = parsePrice(match[2]);
    const baseSlug = slugify(name);
    const count = seenSlugs.get(baseSlug) ?? 0;
    seenSlugs.set(baseSlug, count + 1);
    const slug = count === 0 ? baseSlug : `${baseSlug}-${count + 1}`;

    const seed = hashSeed(slug);
    const isFeatured = FEATURED_NAMES.has(name.toLowerCase());
    // ~65% of items carry an RRP "was" price. The discount depth is drawn
    // deterministically across a wide band (12%–68%) so the deals grids show
    // the varied, punchy markdowns of a real refurb marketplace rather than a
    // single flat number.
    const onSale = seed % 20 >= 7;
    const discountPct = onSale ? 12 + (seed % 57) : 0; // 12–68
    const compareAtPrice = onSale ? Math.round(price / (1 - discountPct / 100) / 100) * 100 : null;
    const stock = seed % 23; // 0-22, occasional "out of stock" for realism
    const rating = Math.round((3.8 + (seed % 13) / 10) * 10) / 10; // 3.8 - 5.0
    const reviewCount = 4 + (seed % 320);

    let badge: string | null = null;
    if (stock === 0) badge = "Out of Stock";
    else if (isFeatured) badge = "Best Seller";
    else if (onSale && discountPct >= 40) badge = "Hot Deal";
    else if (onSale) badge = "Sale";
    else if (idx < 2) badge = "New Arrival";

    const image = category.imagePool[seed % category.imagePool.length];

    products.push({
      slug,
      name,
      brand: inferBrand(name),
      category_slug: category.slug,
      price,
      compare_at_price: compareAtPrice,
      condition: "new",
      is_featured: isFeatured,
      badge,
      stock_quantity: stock,
      rating,
      review_count: reviewCount,
      description: `The ${name} from ${inferBrand(name)}, available now at City Gadgets with genuine warranty and same-day Nairobi delivery. ${category.heroTagline}`,
      specs: category.specTemplate(name),
      images: [
        { url: image, alt: `${name} product photo` },
        { url: category.imagePool[(seed + 1) % category.imagePool.length], alt: `${name} lifestyle photo` },
      ],
    });
  });
}

const outDir = join(process.cwd(), "src", "data", "seed");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "products.generated.json"), JSON.stringify(products, null, 2));
writeFileSync(
  join(outDir, "categories.generated.json"),
  JSON.stringify(
    CATEGORIES.map(({ slug, name, icon, heroTagline, heroImage }) => ({ slug, name, icon, heroTagline, heroImage })),
    null,
    2,
  ),
);

// --- SQL seed for a real Supabase project ---
function sqlEscape(value: string): string {
  return value.replace(/'/g, "''");
}
function sqlJson(value: unknown): string {
  return `'${sqlEscape(JSON.stringify(value))}'::jsonb`;
}

const sqlLines: string[] = [];
sqlLines.push("-- Generated by scripts/generate-seed.ts — do not edit by hand.");
sqlLines.push("begin;");
sqlLines.push("delete from public.product_images;");
sqlLines.push("delete from public.products;");
sqlLines.push("delete from public.categories;");

for (const category of CATEGORIES) {
  sqlLines.push(
    `insert into public.categories (slug, name, icon, hero_tagline, hero_image) values ('${sqlEscape(category.slug)}', '${sqlEscape(
      category.name,
    )}', '${sqlEscape(category.icon)}', '${sqlEscape(category.heroTagline)}', '${sqlEscape(category.heroImage)}');`,
  );
}

for (const p of products) {
  sqlLines.push(
    `insert into public.products (slug, name, brand, category_id, price, compare_at_price, condition, is_featured, badge, stock_quantity, rating, review_count, description, specs, status) values (` +
      `'${sqlEscape(p.slug)}', '${sqlEscape(p.name)}', '${sqlEscape(p.brand)}', (select id from public.categories where slug = '${sqlEscape(
        p.category_slug,
      )}'), ${p.price}, ${p.compare_at_price ?? "null"}, '${p.condition}', ${p.is_featured}, ${
        p.badge ? `'${sqlEscape(p.badge)}'` : "null"
      }, ${p.stock_quantity}, ${p.rating}, ${p.review_count}, '${sqlEscape(p.description)}', ${sqlJson(p.specs)}, 'published') returning id;`,
  );
  p.images.forEach((img, i) => {
    sqlLines.push(
      `insert into public.product_images (product_id, url, alt_text, sort_order) values ((select id from public.products where slug = '${sqlEscape(
        p.slug,
      )}'), '${sqlEscape(img.url)}', '${sqlEscape(img.alt)}', ${i});`,
    );
  });
}
sqlLines.push("commit;");

const sqlDir = join(process.cwd(), "supabase");
mkdirSync(sqlDir, { recursive: true });
writeFileSync(join(sqlDir, "seed.sql"), sqlLines.join("\n") + "\n");

console.log(`Generated ${products.length} products across ${CATEGORIES.length} categories.`);
console.log(`-> src/data/seed/products.generated.json`);
console.log(`-> src/data/seed/categories.generated.json`);
console.log(`-> supabase/seed.sql`);
