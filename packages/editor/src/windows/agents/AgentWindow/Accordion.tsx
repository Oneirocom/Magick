// GENERATED 
// Import necessary dependencies
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React from "react";
import styles from "./index.module.scss";

/**
 * Custom Accordion styled component
 */
const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion
    disableGutters
    elevation={0}
    square
    {...props}
    classes={{ root: styles.accordion }}
  />
))(({ theme }) => ({
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

/**
 * Custom AccordionSummary styled component
 */
const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

/**
 * Custom AccordionDetails styled component
 */
const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

// Define the Props interface for CustomizedAccordion
interface Props {
  title: string;
  children: React.ReactNode;
}

/**
 * CustomizedAccordion component
 * @param title - Title of the accordion
 * @param children - Children components to be displayed within the accordion
 */
export default function CustomizedAccordion({ title, children }: Props) {
  // State to manage the accordion expansion
  const [expanded, setExpanded] = React.useState<string | false>("panel1");

  /**
   * Function to handle accordion expansion state change
   * @param panel - Identifier of the accordion panel
   * @returns a function to be called when the accordion state changes
   */
  const handleChange =
    (panel: string) =>
    (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  // Render the CustomizedAccordion component
  return (
    <div className={styles["mg-btm-medium"]}>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails classes={{ root: styles.collapse }}>
          {children}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}