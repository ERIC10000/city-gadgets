/**
 * Suggested specification fields per category, used by the vendor product
 * form so uploads follow each department's conventions. Keys match the
 * category slugs from the seed/DB.
 */
export const SPEC_TEMPLATES: Record<string, string[]> = {
  phones: ["Storage", "Display", "Chip", "Camera", "Battery"],
  consoles: ["Storage", "Connectivity", "Resolution", "Warranty"],
  "gaming-accessories": ["Compatibility", "Connection", "Warranty"],
  audio: ["Type", "Battery Life", "Connectivity", "Noise Cancellation"],
  cameras: ["Video Resolution", "Stabilization", "Water Resistance", "Battery"],
  wearables: ["Display", "Battery Life", "Water Resistance", "Sensors"],
  macbooks: ["Processor", "Memory", "Display", "Battery Life"],
  tablets: ["Storage", "Display", "Chip", "Connectivity"],
  streaming: ["Resolution", "Storage", "Remote"],
  accessories: ["Compatibility", "Connection"],
};

/** What's in the box per category — shown on the product page. */
export const COMES_WITH: Record<string, string[]> = {
  phones: ["USB-C charging cable", "SIM ejector tool", "Protective case"],
  consoles: ["1 wireless controller", "HDMI cable", "Power cable"],
  "gaming-accessories": ["USB-C cable", "Quick-start guide"],
  audio: ["Charging cable / case", "Spare ear tips", "Carry pouch"],
  cameras: ["Battery", "USB-C cable", "Mounting kit"],
  wearables: ["Charging cradle", "Extra strap size"],
  macbooks: ["MagSafe / USB-C charger", "Charging cable"],
  tablets: ["USB-C charging cable", "Power adapter"],
  streaming: ["Voice remote", "HDMI extender", "Power adapter"],
  accessories: ["Original packaging"],
};
