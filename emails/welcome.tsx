import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Tailwind,
  Button,
  Hr,
  Img,
  Preview,
  Font,
  Section,
} from "@react-email/components";

const WelcomeEmail = () => {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: "https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>
        We can&apos;t wait for you to try Guess Astro! At Guess Astro, our
        mission is to make learning about astronomical objects an engaging and
        seamless experience. Whether you&apos;re gearing up for the Astronomy
        National/International Science Olympiad or simply exploring the wonders
        of the universe, we&apos;ve got you covered.
      </Preview>
      <Tailwind>
        <Body className="bg-white">
          <Container className="mx-auto pb-12 pt-5">
            {/* Logo Section */}
            <Section className="mx-auto mb-2">
              <Img
                src="https://astro.dewodt.com/guess-astro-full.png"
                alt="Guess Astro Logo"
                className="mx-auto rounded-md"
                width={300}
                height={158}
              />
            </Section>

            {/* Content Section */}
            <Section className="text-center">
              {/* Title */}
              <Heading as="h1" className="text-left text-2xl">
                Welcome to Guess Astro!
              </Heading>

              {/* Paragraph Description */}
              <Text className="my-5 text-left text-base">
                We can&apos;t wait for you to try Guess Astro! At Guess Astro,
                our mission is to make learning about astronomical objects an
                engaging and seamless experience. Whether you&apos;re gearing up
                for the Astronomy National/International Science Olympiad or
                simply exploring the wonders of the universe, we&apos;ve got you
                covered.
              </Text>

              {/* Play Now Button */}
              <Button
                href="https://astro.dewodt.com/"
                className="cursor-pointer rounded-md bg-[#2563EB] px-8 py-4 text-sm font-semibold text-white hover:bg-[#2563EB]/90"
              >
                Play Now
              </Button>

              <Hr className="my-5" />

              {/* Footer */}
              <Text className="my-0 text-left text-sm">
                Copyright © 2023 Guess Astro
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
