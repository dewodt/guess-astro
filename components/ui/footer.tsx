import Link from "next/link";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="flex flex-col items-center gap-4 border-t-2 border-t-border bg-background px-8 py-7 font-inter text-base sm:flex-row-reverse sm:justify-between lg:px-16 xl:text-lg">
      <div className="flex flex-row gap-8 sm:gap-12">
        {/* About */}
        <Link
          data-cy="footer-about"
          href="/about"
          className="font-medium text-muted-foreground xl:hover:text-foreground"
        >
          About
        </Link>

        {/* Privacy policy */}
        <Link
          data-cy="footer-privacy-policy"
          href="/privacy-policy"
          className="font-medium text-muted-foreground xl:hover:text-foreground"
        >
          Privacy Policy
        </Link>
      </div>

      {/* Copyright */}
      <p
        data-cy="footer-copyright"
        className="text-center font-medium text-muted-foreground"
      >
        Copyright © {year} Guess Astro
      </p>
    </footer>
  );
};

export default Footer;
