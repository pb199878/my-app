import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { NumericFormat } from "react-number-format";
import "@fontsource/oswald";

// Custom component to format numbers as currency
const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(
  props,
  ref
) {
  const { onChange, ...other } = props;
  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        // Update with numeric string value (you can also use values.floatValue if preferred)
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      thousandSeparator
      prefix="$"
      valueIsNumericString
    />
  );
});

function LandTransferTaxCalculator() {
  const [price, setPrice] = useState(0);
  const [location, setLocation] = useState("toronto");
  const [isFirstTime, setIsFirstTime] = useState(false);

  const [provincialTax, setProvincialTax] = useState(0);
  const [municipalTax, setMunicipalTax] = useState(0);
  const [rebate, setRebate] = useState(0);
  const [totalTax, setTotalTax] = useState(0);

  // Calculate Ontario (Provincial) LTT
  const calculateOntarioLTT = (amount) => {
    let tax = 0;
    let remaining = amount;

    // 0.5% on first $55,000
    if (remaining > 55000) {
      tax += 55000 * 0.005;
      remaining -= 55000;
    } else {
      tax += remaining * 0.005;
      return tax;
    }

    // 1.0% on next $195,000 (up to $250,000)
    if (remaining > 195000) {
      tax += 195000 * 0.01;
      remaining -= 195000;
    } else {
      tax += remaining * 0.01;
      return tax;
    }

    // 1.5% on next $150,000 (up to $400,000)
    if (remaining > 150000) {
      tax += 150000 * 0.015;
      remaining -= 150000;
    } else {
      tax += remaining * 0.015;
      return tax;
    }

    // 2.0% on next $1,600,000 (up to $2,000,000)
    if (remaining > 1600000) {
      tax += 1600000 * 0.02;
      remaining -= 1600000;
    } else {
      tax += remaining * 0.02;
      return tax;
    }

    // 2.5% on amount above $2,000,000
    tax += remaining * 0.025;
    return tax;
  };

  // Calculate Toronto (Municipal) LTT — same bracket structure
  const calculateTorontoLTT = (amount) => {
    let tax = 0;
    let remaining = amount;

    // 0.5% on first $55,000
    if (remaining > 55000) {
      tax += 55000 * 0.005;
      remaining -= 55000;
    } else {
      tax += remaining * 0.005;
      return tax;
    }

    // 1.0% on next $195,000
    if (remaining > 195000) {
      tax += 195000 * 0.01;
      remaining -= 195000;
    } else {
      tax += remaining * 0.01;
      return tax;
    }

    // 1.5% on next $150,000
    if (remaining > 150000) {
      tax += 150000 * 0.015;
      remaining -= 150000;
    } else {
      tax += remaining * 0.015;
      return tax;
    }

    // 2.0% on next $1,600,000
    if (remaining > 1600000) {
      tax += 1600000 * 0.02;
      remaining -= 1600000;
    } else {
      tax += remaining * 0.02;
      return tax;
    }

    // 2.5% on next $1,000,000
    if (remaining > 1000000) {
      tax += 1000000 * 0.025;
      remaining -= 1000000;
    } else {
      tax += remaining * 0.025;
      return tax;
    }

    // 3.5% on next $1,000,000
    if (remaining > 1000000) {
      tax += 1000000 * 0.035;
      remaining -= 1000000;
    } else {
      tax += remaining * 0.035;
      return tax;
    }

    // 4.5% on next $1,000,000
    if (remaining > 1000000) {
      tax += 1000000 * 0.045;
      remaining -= 1000000;
    } else {
      tax += remaining * 0.045;
      return tax;
    }

    // 5.5% on next $5,000,000
    if (remaining > 5000000) {
      tax += 5000000 * 0.055;
      remaining -= 5000000;
    } else {
      tax += remaining * 0.055;
      return tax;
    }

    // 6.5% on next $10,000,000
    if (remaining > 10000000) {
      tax += 10000000 * 0.065;
      remaining -= 10000000;
    } else {
      tax += remaining * 0.065;
      return tax;
    }

    // 7.5% above $20,000,000
    tax += remaining * 0.075;
    return tax;
  };

  const handleCalculate = useCallback(() => {
    const numericPrice = parseFloat(price || "0");
    if (numericPrice < 0) {
      alert("Please enter a valid purchase price.");
      return;
    }

    // Calculate provincial LTT
    const provincial = calculateOntarioLTT(numericPrice);

    // Calculate municipal LTT if location is Toronto
    let municipal = 0;
    if (location.toLowerCase() === "toronto") {
      municipal = calculateTorontoLTT(numericPrice);
    }

    // Calculate rebates if first-time home buyer
    let provincialRebate = 0;
    let municipalRebate = 0;
    if (isFirstTime) {
      // Max $4,000 for Ontario portion
      provincialRebate = Math.min(4000, provincial);

      // Max $4,475 for Toronto portion
      if (location.toLowerCase() === "toronto") {
        municipalRebate = Math.min(4475, municipal);
      }
    }

    const totalRebate = provincialRebate + municipalRebate;
    const total = provincial - provincialRebate + (municipal - municipalRebate);

    setProvincialTax(provincial);
    setMunicipalTax(municipal);
    setRebate(totalRebate);
    setTotalTax(total);
  });

  useEffect(() => {
    handleCalculate();
  }, [price, location, handleCalculate]);

  return (
    <div style={{ paddingLeft: "40px", paddingRight: "40px" }}>
      <Grid
        container
        direction={"column"}
        spacing={4}
        paddingBottom={"2rem"}
        alignItems={"center"}
      >
        <Typography
          variant={"h5"}
          color="#090457"
          sx={{
            lineHeight: "1.5",
            fontFamily: "'Oswald', serif",
            fontSize: "40px",
          }}
        >
          Know the true land transfer cost
        </Typography>
        <Typography
          variant={"subtitle"}
          // fontSize={"17px"}
          // fontFamily={"serif"}
          sx={{
            lineHeight: "1.5",
            fontFamily: "'Oswald', sans-serif",
            fontSize: "24px",
            fontWeight: "300",
            maxWidth: "100%",
            color: "#696969",
            textAlign: "center",
          }}
        >
          You are subject to Land Transfer Tax in Ontario when purchasing a
          property. Use Irani Law Tax calculator so you’re not surprised by
          hidden costs later.
        </Typography>
        <Typography
          fontFamily={"serif"}
          sx={{
            lineHeight: "1.5",
            fontFamily: "'EB Garamond', serif",
            fontSize: "17px",
          }}
        >
          Complete the form below to receive your quote
        </Typography>
      </Grid>
      <Grid container spacing={3} direction={"column"}>
        <Grid container spacing={3} justifyContent={"space-between"}>
          <Grid container spacing={1} size={6}>
            <InputLabel
              sx={{
                fontSize: "17px",
                color: "#090457",
                fontFamily: "'Oswald', sans-serif",
              }}
            >
              Price (required)
            </InputLabel>
            <TextField
              fullWidth
              value={price}
              required
              id="outlined-basic"
              variant="outlined"
              placeholder="$ Enter amount"
              onChange={(e) => {
                setPrice(e.target.value);
              }}
              slotProps={{
                input: {
                  inputComponent: NumberFormatCustom,
                },
              }}
            />
          </Grid>
          <Grid container spacing={1} size={6}>
            <InputLabel
              sx={{
                fontSize: "17px",
                color: "#090457",
                fontFamily: "'Oswald', sans-serif",
              }}
            >
              Location
            </InputLabel>
            <Select
              fullWidth
              value={location}
              label="Location"
              onChange={(e) => {
                setLocation(e.target.value);
              }}
            >
              <MenuItem value={"toronto"}>Toronto</MenuItem>
              <MenuItem value={"other"}>Outside Toronto</MenuItem>
            </Select>
          </Grid>
        </Grid>
        <Grid container>
          <FormControlLabel
            control={
              <Checkbox
                size="large"
                checked={isFirstTime}
                onChange={(e) => {
                  setIsFirstTime(e.target.checked);
                  handleCalculate(e);
                }}
              />
            }
            label={
              <Typography sx={{ fontWeight: 100 }}>
                I am a first time home buyer
              </Typography>
            }
          />
        </Grid>
        <Grid
          container
          spacing={2}
          direction={"column"}
          style={{
            "outline-style": "solid",
            "outline-width": "thin",
            "padding-top": "1rem",
          }}
          alignItems={"center"}
        >
          <Grid container size={12} justifyContent={"center"}>
            <Grid>
              <Typography variant="h6" fontFamily={"serif"}>
                {"Determine Your Land Transfer Tax"}
              </Typography>
            </Grid>
          </Grid>
          <Grid size={12}>
            <hr></hr>
          </Grid>
          <Grid
            container
            direction={"column"}
            size={12}
            style={{
              "padding-left": "17rem",
              "padding-right": "17rem",
              "padding-bottom": "2rem",
            }}
          >
            <Grid container justifyContent={"space-between"}>
              <Typography
                variant="h6"
                fontFamily={"serif"}
              >{`Provincial:`}</Typography>
              <Typography variant="h6">{`${new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(provincialTax)}`}</Typography>
            </Grid>
            <Grid container justifyContent={"space-between"}>
              <Typography
                variant="h6"
                fontFamily={"serif"}
              >{`Municipal:`}</Typography>
              <Typography variant="h6">{`${new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(municipalTax)}`}</Typography>
            </Grid>
            <Grid container justifyContent={"space-between"}>
              <Typography
                variant="h6"
                fontFamily={"serif"}
              >{`Rebate:`}</Typography>
              <Typography variant="h6">{`${new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(rebate)}`}</Typography>
            </Grid>
            <Grid container justifyContent={"space-between"}>
              <Typography
                variant="h6"
                fontFamily={"serif"}
              >{`Land Transfer Tax:`}</Typography>
              <Typography variant="h6">{`${new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(totalTax)}`}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default LandTransferTaxCalculator;
