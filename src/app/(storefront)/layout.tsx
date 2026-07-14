import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";
import { CartHydrator } from "@/components/cart/CartHydrator";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CartHydrator />
      <Header />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
      <WhatsAppFAB />
    </>
  );
}
