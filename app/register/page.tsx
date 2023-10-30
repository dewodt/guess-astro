import { type Metadata } from "next";
import RegisterForm from "./register-form";

export const metadata: Metadata = {
  title: "Register | Guess Astro",
  description:
    "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
  metadataBase: new URL("https://astro.dewodt.com"),
  generator: "Next.js",
  applicationName: "Guess Astro",
  keywords: ["Guess Astro", "Astronomy", "Game"],
  colorScheme: "normal",
  category: "education",
  themeColor: "#2563EB",
  openGraph: {
    title: "Register | Guess Astro",
    description:
      "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
    url: "https://astro.dewodt.com/",
    siteName: "Guess Astro",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Register | Guess Astro",
    description:
      "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
  },
};

const RegisterPage = () => {
  return (
    <main className="flex flex-auto items-center justify-center p-5 sm:p-10">
      <RegisterForm />
    </main>
  );
};

export default RegisterPage;
