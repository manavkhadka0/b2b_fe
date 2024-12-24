export default function ContactMap() {
  return (
    <div className="w-full lg:w-1/2 hidden lg:flex justify-center animate-fade-in">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3571.6444873119!2d87.28403667542418!3d26.467186276915573!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef759584bb1fd3%3A0x180d524a776a94c0!2sUdhyog%20Sangathan%20Morang!5e0!3m2!1sen!2snp!4v1734955731207!5m2!1sen!2snp"
        className="w-full h-full min-h-[600px] rounded-lg"
        style={{
          border: 0,
        }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}
