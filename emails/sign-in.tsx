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

const SignInEmail = ({ url }: { url: string }) => {
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
        Click this button below if you want to verify sign in / sign up request
        to Guess Astro! After you clicked this, you will be signed in and
        redirected to the app. If you didn&apos;t request this, please ignore
        this email!
      </Preview>
      <Tailwind>
        <Body className="bg-white">
          <Container className="mx-auto pb-12 pt-5">
            {/* Logo Section */}
            <Section className="mx-auto">
              <Img
                src="https://astro.dewodt.com/guess-astro-full.png"
                alt="Guess Astro Logo"
                className="mx-auto rounded-md"
                width={266}
                height={100}
              />
            </Section>

            {/* Content Section */}
            <Section className="text-center">
              {/* Title */}
              <Heading as="h1" className="text-left text-2xl">
                Verify Request to Guess Astro
              </Heading>

              {/* Description */}
              <Text className="my-5 text-left text-base">
                Click this button below if you want to verify sign in / sign up
                request to Guess Astro! After you clicked this, you will be
                signed in and redirected to the app.
              </Text>

              {/* Magic Link */}
              <Button
                href={url}
                className="cursor-pointer rounded-md bg-[#2563EB] px-6 py-4 text-sm font-semibold text-white hover:bg-[#2563EB]/90"
              >
                Verify Request
              </Button>

              {/* Warning */}
              <Text className="my-5 text-left text-base font-semibold text-red-500">
                *If you didn&apos;t request this, please ignore this email!*
              </Text>

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

export default SignInEmail;
