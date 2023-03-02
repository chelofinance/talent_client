import React from "react";
import { BigNumberish, ethers } from "ethers";
import { Box } from "@mui/material";

import { formatValueWithDecimals } from "@helpers/erc";

const ANIMATION_MINIMUM_STEP_TIME = 80;

export interface FlowingBalanceProps {
  balance: string;
  /**
   * Timestamp in Subgraph's UTC.
   */
  balanceTimestamp: number;
  flowRate: string;
}

const FlowingBalance: React.FC<FlowingBalanceProps> = ({
  balance,
  balanceTimestamp,
  flowRate,
}): React.ReactElement => {
  const [weiValue, setWeiValue] = React.useState<BigNumberish>(balance);
  React.useEffect(() => setWeiValue(balance), [balance]);

  const balanceTimestampMs = React.useMemo(
    () => ethers.BigNumber.from(balanceTimestamp).mul(1000),
    [balanceTimestamp]
  );

  React.useEffect(() => {
    const flowRateBigNumber = ethers.BigNumber.from(flowRate);
    if (flowRateBigNumber.isZero()) {
      return; // No need to show animation when flow rate is zero.
    }

    const balanceBigNumber = ethers.BigNumber.from(balance);

    let stopAnimation = false;
    let lastAnimationTimestamp: DOMHighResTimeStamp = 0;

    const animationStep = (currentAnimationTimestamp: DOMHighResTimeStamp) => {
      if (stopAnimation) {
        return;
      }

      if (currentAnimationTimestamp - lastAnimationTimestamp > ANIMATION_MINIMUM_STEP_TIME) {
        const currentTimestampBigNumber = ethers.BigNumber.from(
          new Date().valueOf() // Milliseconds elapsed since UTC epoch, disregards timezone.
        );

        setWeiValue(
          balanceBigNumber.add(
            currentTimestampBigNumber.sub(balanceTimestampMs).mul(flowRateBigNumber).div(1000)
          )
        );

        lastAnimationTimestamp = currentAnimationTimestamp;
      }

      window.requestAnimationFrame(animationStep);
    };

    window.requestAnimationFrame(animationStep);

    return () => {
      stopAnimation = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balance, balanceTimestamp, flowRate]);

  return (
    <Box
      data-cy={"total-streamed"}
      component="span"
      sx={{
        textOverflow: "ellipsis",
        color: "white",
      }}
    >
      {formatValueWithDecimals({ value: weiValue.toString(), decimals: 18, maxDecimals: 4 })}
    </Box>
  );
};

export default FlowingBalance;
