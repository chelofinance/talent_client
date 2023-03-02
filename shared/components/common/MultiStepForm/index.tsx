import React from "react";
import { Formik, FormikConfig, FormikProps, Form } from "formik";

import Button from "@shared/components/common/Forms/Button";
import { Step, StepLabel, Stepper } from "@mui/material";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/solid";

interface MultiStepFormProps<T> extends FormikConfig<T> {
  customLoading?: boolean;
  onSubmit(args: T): any;
  stepper?: boolean;
  forms: {
    fields: (keyof T)[];
    element: React.FunctionComponent<Partial<FormikProps<T>>>;
    props?: Object;
    title: string;
  }[];
}

const ORANGE_CUSTOM = "#FA7B1F";

export const MultiStepForm = <T extends unknown>(props: MultiStepFormProps<T>) => {
  const { forms, customLoading, stepper, ...rest } = props;
  const [current, setCurrent] = React.useState(0);
  const { element: CurrentElement, props: elementProps, fields } = forms[current];
  const isLastSection = current === forms.length - 1;
  console.log({ isLastSection });

  return (
    <div className="flex flex-col items-center w-full h-full">
      <Formik {...rest}>
        {({ submitForm, isSubmitting, errors, ...props }) => {
          const hasErrors = Object.keys(errors).some((err) => fields.includes(err as keyof T));
          return (
            <Form className="flex flex-col justify-between items-center w-full h-full">
              <div className="w-full mt-10 flex justify-between mb-12">
                <Button
                  disabled={current === 0}
                  className={`bg-transparent font-semibold ${
                    current == 0 ? "text-gray-400" : "text-orange_custom"
                  } flex items-center`}
                  type="button"
                  onClick={() =>
                    setCurrent((prev) => (prev - 1 >= 0 ? prev - 1 : forms.length - 1))
                  }
                >
                  <ArrowLeftIcon width={20} className="mr-2" />
                  Back
                </Button>
                <Button
                  type="button"
                  disabled={hasErrors}
                  loading={customLoading !== undefined ? customLoading : isSubmitting}
                  className="bg-transparent font-semibold text-orange_custom flex items-center"
                  onClick={() => {
                    if (isLastSection) return submitForm();
                    setCurrent((prev) => (prev + 1) % forms.length);
                  }}
                >
                  {isLastSection ? (
                    ""
                  ) : (
                    <>
                      Next
                      <ArrowRightIcon width={20} className="ml-2" />
                    </>
                  )}
                </Button>
              </div>
              <div className="w-2/3 h-full">
                {stepper && (
                  <Stepper activeStep={current} alternativeLabel classes={{ root: "mb-16" }}>
                    {forms.map(({ title }) => (
                      <Step
                        key={title}
                        sx={{
                          "& .MuiStepLabel-root .Mui-active": {
                            color: ORANGE_CUSTOM, // circle color (ACTIVE)
                          },
                          "& .MuiStepLabel-root .Mui-completed": {
                            color: ORANGE_CUSTOM, // circle color (COMPLETED)
                          },
                          "& .MuiStepLabel-label": {
                            color: "black", // circle color (COMPLETED)
                          },
                        }}
                      >
                        <StepLabel>{title}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                )}
                <CurrentElement
                  {...props}
                  errors={errors}
                  submitForm={submitForm}
                  isSubmitting={isSubmitting}
                  {...elementProps}
                />
                <div className="w-full my-10 flex justify-end">
                  {isLastSection && (
                    <Button
                      type="button"
                      disabled={hasErrors}
                      loading={customLoading !== undefined ? customLoading : isSubmitting}
                      className="bg-green-400 py-2 px-10 text-white font-semibold rounded-md"
                      onClick={() => {
                        submitForm();
                      }}
                    >
                      Save
                    </Button>
                  )}
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default MultiStepForm;
