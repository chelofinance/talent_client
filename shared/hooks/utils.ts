import React from "react";

export const useLoading = <T extends Record<string, boolean>>(initState: T) => {
  const [loading, setLoading] = React.useState<T>(initState);

  const handleSetLoading = (field: keyof T, value?: boolean) => {
    if (value === undefined) value = !loading[field];
    setLoading((prev) => ({...prev, [field]: value}));
  };

  return [loading, handleSetLoading] as [T, typeof handleSetLoading];
};
