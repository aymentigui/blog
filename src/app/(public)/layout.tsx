import FooterPublic from "@/components/my/footer-from";
import DivStart from "@/components/my/public/div-start";
import HeaderPublic from "@/components/my/public/header";
import ScrollFixer from "@/components/my/public/ScrollFixer";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="min-h-screen flex flex-col ">
      <DivStart />
      <ScrollFixer />
      <div className="h-10"></div>
      {/* Header */}
      <HeaderPublic />
      {children}
      <FooterPublic/>
    </div>
  );
}
