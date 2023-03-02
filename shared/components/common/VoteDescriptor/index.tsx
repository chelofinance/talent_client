import {addressEqual, getDateDay} from "@helpers/index";
import {useGetPools} from "@shared/hooks/utils";
import React from "react";
import EthAddress from "../EthAddress";

const DescriptorWrapper: React.FunctionComponent<{}> = ({children}) => (
  <div className="flex flex-col text-gray-400">{children}</div>
);

const describeSettings = ({setting}): string[] => {
  const pools = useGetPools();

  if (setting.minApr) return [` - Min Apr: ${setting.minApr}`, ` - Max Apr: ${setting.maxApr}`];

  if (setting.minDuration)
    return [` - Min Duration: ${setting.minDuration}`, ` - Max Duration: ${setting.maxDuration}`];

  if (setting.pool) {
    const pool = pools.find(({address}) => addressEqual(address, setting.pool));
    return [
      ` - Max Principal: ${setting.maxPrincipal}`,
      ` - Min Principal: ${setting.minPrincipal}`,
      ` - Token: ${pool.token.symbol}`,
    ];
  }

  if (setting.maxDefaulted) return [` - Max Defaulted: ${setting.maxDefaulted}`];

  if (setting.maxPools) return [` - Max Pools: ${setting.maxPools}`];

  if (setting.managerDuration) return [` - Manager Duration: ${setting.managerDuration}`];

  return [];
};

export const VoteDescriptor: React.FunctionComponent<{
  parsedScript: AragonVote["parsedScript"][0];
}> = ({parsedScript}) => {
  const {type, meta} = parsedScript;

  if (type === "loan")
    return (
      <DescriptorWrapper>
        <span>Create loan {`${meta.loan.id < 0 ? "" : `#${meta.loan.id}`}`}:</span>
        <span>{` - Principal: ${meta.loan.principal + `${meta.loan.token.symbol}`}`}.</span>
        <span>
          {` - Collateralized: ${meta.loan.hasCollateral ? `Yes. with collateral #${meta.loan.collateralId}.` : "No."
            }`}
        </span>
        <span>{` - Duration: ${Math.floor(Number(meta.loan.duration) / (3600 * 24))} days`}.</span>
      </DescriptorWrapper>
    );

  if (type === "mark_defaulted")
    return (
      <DescriptorWrapper>
        <span>Mark loan {`${meta.loan.id < 0 ? "" : `#${meta.loan.id}`}`} as defaulted:</span>
        <span>{` - Principal: ${meta.loan.principal + `${meta.loan.token.symbol}`}`}.</span>
        <span>
          {` - Collateralized: ${meta.loan.hasCollateral ? `Yes. with collateral #${meta.loan.collateralId}.` : "No."
            }`}
        </span>
        <span>{` - Expire date: ${getDateDay(Number(meta.loan.repaymentDate) * 3600)}`}.</span>
      </DescriptorWrapper>
    );

  if (type === "mark_resolved")
    return (
      <DescriptorWrapper>
        <span>Mark loan {`${meta.loan.id < 0 ? "" : `#${meta.loan.id}`}`} as defaulted:</span>
        <span>{` - Principal: ${meta.loan.principal + `${meta.loan.token.symbol}`}`}.</span>
        <span>
          {` - Collateralized: ${meta.loan.hasCollateral ? `Yes. with collateral #${meta.loan.collateralId}.` : "No."
            }`}
        </span>
        <span>{` - Expire date: ${getDateDay(Number(meta.loan.repaymentDate) * 3600)}`}.</span>
      </DescriptorWrapper>
    );

  if (type === "create_pool")
    return (
      <DescriptorWrapper>
        <span>Create lending pool:</span>
        <span className="flex">
          {` - Token address:`}
          <EthAddress address={meta.pool.token.address} clipboard classes={{root: "ml-4"}} />
        </span>
        <span>{` - Token symbol: ${meta.pool.token.symbol}`}</span>
      </DescriptorWrapper>
    );

  if (type === "pool_deposit")
    return (
      <DescriptorWrapper>
        <span>Deposit on pool:</span>
        <span>{` - Amount: ${meta.deposit}${meta.pool.token.symbol}`}</span>
        <span>{` - Pool: ${meta.pool.address}`}</span>
      </DescriptorWrapper>
    );

  if (type === "setting") {
    const description = describeSettings(meta);
    if (description.length > 0)
      return (
        <DescriptorWrapper>
          <span>Update settings:</span>
          {description.map((desc) => (
            <span>{desc}</span>
          ))}
        </DescriptorWrapper>
      );
    return <></>;
  }

  if (type === "add_members")
    return (
      <DescriptorWrapper>
        <span>Update member list</span>
      </DescriptorWrapper>
    );

  return <></>;
};
