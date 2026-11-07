import {
  Stepper,
  Step,
  StepLabel,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@/stitches.config";

interface StepIndicatorProps {
  activeStep: number;
  steps: string[];
}

const StepperWrapper = styled("div", {
  marginBottom: "$4",
});

export const StepIndicator = ({ activeStep, steps }: StepIndicatorProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <StepperWrapper>
      <Stepper
        activeStep={activeStep}
        alternativeLabel={!isMobile}
        orientation={isMobile ? "horizontal" : "horizontal"}
        sx={{
          "& .MuiStepConnector-line": {
            borderColor: "#EDEDF1",
            borderWidth: 2,
          },
          "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
            borderColor: "#50893E",
          },
          "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
            borderColor: "#50893E",
          },
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel
              sx={{
                "& .MuiStepLabel-label": {
                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                  fontWeight: 500,
                  "&.Mui-active": {
                    color: "#50893E",
                    fontWeight: 600,
                  },
                  "&.Mui-completed": {
                    color: "#50893E",
                  },
                },
              }}
            >
              {!isMobile && label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </StepperWrapper>
  );
};
