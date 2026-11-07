import { styled } from "@/stitches.config";
import { keyframes } from "@stitches/react";

const fadeIn = keyframes({
  "0%": { opacity: 0, transform: "translateY(20px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

const gradientMove = keyframes({
  "0%": { backgroundPosition: "0% 50%" },
  "50%": { backgroundPosition: "100% 50%" },
  "100%": { backgroundPosition: "0% 50%" },
});

export const OnboardingContainer = styled("div", {
  // minHeight: '100vh',
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "$6",
  // background: 'linear-gradient(135deg, $whiteSmoke 0%, $grey 100%)',
  position: "relative",
  overflow: "hidden",
});

export const OnboardingCard = styled("div", {
  width: "100%",
  // maxWidth: '680px',
  backgroundColor: "$white",
  borderRadius: "$xl",
  boxShadow: "$xl",
  overflow: "hidden",
  animation: `${fadeIn} 0.6s ease-out`,
  position: "relative",
  zIndex: 1,
  "@md": {
    maxWidth: "720px",
  },
});

export const CardHeader = styled("div", {
  background: "linear-gradient(135deg, $primary 0%, $secondary 100%)",
  backgroundSize: "200% 200%",
  animation: `${gradientMove} 8s ease infinite`,
  padding: "$8 $6",
  color: "$white",
  textAlign: "center",

  "@md": {
    padding: "$10 $8",
  },
});

export const CardBody = styled("div", {
  padding: "$6",

  "@md": {
    padding: "$8",
  },
});

export const Logo = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "$3",
  marginBottom: "$4",
});

export const LogoIcon = styled("div", {
  width: "48px",
  height: "48px",
  borderRadius: "$lg",
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backdropFilter: "blur(10px)",
});

export const Title = styled("h1", {
  fontSize: "$2xl",
  fontWeight: "$bold",
  margin: 0,
  marginBottom: "$2",

  "@md": {
    fontSize: "$3xl",
  },
});

export const Subtitle = styled("p", {
  fontSize: "$md",
  opacity: 0.9,
  margin: 0,
});

export const FormSection = styled("div", {
  marginBottom: "$6",
});

export const SectionTitle = styled("h3", {
  fontSize: "$lg",
  fontWeight: "$semibold",
  color: "$darkGray",
  marginBottom: "$4",
  display: "flex",
  alignItems: "center",
  gap: "$2",

  "&::before": {
    content: '""',
    width: "4px",
    height: "20px",
    backgroundColor: "$primary",
    borderRadius: "$full",
  },
});

export const FormRow = styled("div", {
  display: "grid",
  gap: "$10",
  marginBottom: "$4",

  "@md": {
    gridTemplateColumns: "repeat(2, 1fr)",
  },

  variants: {
    single: {
      true: {
        "@md": {
          gridTemplateColumns: "1fr",
        },
      },
    },
  },
});

export const StepContent = styled("div", {
  animation: `${fadeIn} 0.4s ease-out`,
});

export const ButtonGroup = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  gap: "$4",
  marginTop: "$8",
  paddingTop: "$6",
  borderTop: "1px solid $grey",
});

export const ClinicChip = styled("div", {
  display: "inline-flex",
  alignItems: "center",
  gap: "$2",
  padding: "$2 $4",
  backgroundColor: "$grey",
  borderRadius: "$full",
  fontSize: "$sm",
  color: "$darkGray",
  marginRight: "$2",
  marginBottom: "$2",

  "& button": {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    alignItems: "center",
    color: "$sonicSilver",

    "&:hover": {
      color: "$warning",
    },
  },
});

export const ClinicsList = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  gap: "$2",
  marginTop: "$3",
});
