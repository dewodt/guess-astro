import { Html } from "@react-email/html";
import { Head } from "@react-email/head";
import { Container } from "@react-email/container";
import { Heading } from "@react-email/heading";
import { Text } from "@react-email/text";
import { Tailwind } from "@react-email/tailwind";
import { Button } from "@react-email/button";
import { Hr } from "@react-email/hr";
import { Img } from "@react-email/img";
import { Preview } from "@react-email/preview";
import { Font } from "@react-email/font";
import { Section } from "@react-email/section";
import { Column } from "@react-email/column";

const SignInTemplate = ({ url }: { url: string }) => {
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
        <Container>
          <Section className="text-center">
            <Heading className="text-left">
              Verify request to Guess Astro
            </Heading>
            <Text className="text-left">
              Click this button below if you want to verify sign in / sign up
              request to Guess Astro! After you clicked this, you will be signed
              in and redirected to the app.
            </Text>
            <Button
              href={url}
              className="cursor-pointer rounded-md bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2563EB]/90"
            >
              Verify Request
            </Button>
            <Text className="text-left font-semibold text-red-500">
              If you didn&apos;t request this, please ignore this email!
            </Text>
          </Section>

          <Hr className="mb-5" />

          <Section className="text-center">
            <Column align="center">
              <Img
                src={`https://astro.dewodt.com/guess-astro.png`}
                alt="Guess Astro Logo"
                width={32}
                height={32}
                className="text-center"
              />
              <Text>Guess Astro</Text>
            </Column>
          </Section>
        </Container>
      </Tailwind>
    </Html>
  );
};

export default SignInTemplate;
