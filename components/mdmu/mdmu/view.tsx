import Hero from "./hero";
import About from "./about";
import { Video } from "./video";
import { Objective } from "./objective";
import { Advantage } from "./advantage";
import { FacebookFeed } from "./facebook-feed";
import { Form } from "./form";
import Contact from "./contact";

export default function MDMUView() {
  return (
    <>
      <Hero />
      <About />
      <Video />
      <Objective />
      <FacebookFeed />
      <Form />
      <Contact />
    </>
  );
}
