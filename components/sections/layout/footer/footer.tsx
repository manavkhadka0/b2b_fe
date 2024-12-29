import { B2BNetworking } from "./b2b-networking";
import Footerbot from "./footerbot";
import { Newsletter } from "./newsletter";

export function Footer() {
  return (
    <>
      <Newsletter />
      <B2BNetworking />
      <Footerbot />
    </>
  );
}

export default Footer;
