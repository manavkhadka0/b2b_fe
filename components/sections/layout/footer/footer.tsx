import { B2BNetworking } from "./b2b-networking";
import Footerbot from "./footerbot";
import { Newsletter } from "./newsletter";

export function Footer() {
  return (
    <>
      <footer className="border-t bg-background">
        <Newsletter />
        <B2BNetworking />
      </footer>
      <Footerbot />
    </>
  );
}

export default Footer;
