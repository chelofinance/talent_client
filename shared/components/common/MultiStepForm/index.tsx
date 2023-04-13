import React from "react";
import {Formik, FormikConfig, FormikProps, Form} from "formik";
import Button from "@shared/components/common/Forms/Button";
import {Step, StepLabel, Stepper} from "@mui/material";

interface MultiStepFormProps<T> extends FormikConfig<T> {
  customLoading?: boolean;
  onSubmit(args: T): any;
  stepper?: boolean;
  forms: {
    fields: (keyof T)[];
    element: React.FunctionComponent<Partial<FormikProps<T> & {hasErrors: boolean}>>;
    props?: Object;
    title: string;
  }[];
}

const VIOLET_500 = "#7C3AED";

export const MultiStepForm = <T extends unknown>(props: MultiStepFormProps<T>) => {
  const {forms, customLoading, stepper, ...rest} = props;
  const [current, setCurrent] = React.useState(0);
  const {element: CurrentElement, props: elementProps, fields} = forms[current];
  const isLastSection = current === forms.length - 1;

  return (
    <div className="flex flex-col items-center w-full h-full">
      <Formik {...rest}>
        {({submitForm, isSubmitting, errors, ...props}) => {
          const hasErrors = Object.keys(errors).some((err) => fields.includes(err as keyof T));
          console.log({hasErrors, values: props.values});
          return (
            <Form className="flex flex-col justify-between items-center w-full h-full">
              <div className="w-full flex justify-between items-center mb-20">
                <Button
                  disabled={current === 0}
                  className={`bg-transparent font-semibold ${current == 0 ? "text-gray-400" : "text-violet-500"
                    } flex items-center`}
                  type="button"
                  onClick={() =>
                    setCurrent((prev) => (prev - 1 >= 0 ? prev - 1 : forms.length - 1))
                  }
                >
                  Prev
                </Button>
                <Button
                  type="button"
                  disabled={hasErrors}
                  className={`bg-transparent font-semibold flex items-center ${hasErrors ? "text-gray-400" : "text-violet-500"
                    }`}
                  onClick={() => {
                    if (isLastSection) return submitForm();
                    setCurrent((prev) => (prev + 1) % forms.length);
                  }}
                >
                  {isLastSection ? "" : "Next"}
                </Button>
              </div>
              {stepper && (
                <Stepper activeStep={current} alternativeLabel classes={{root: "mb-3 w-full"}}>
                  {forms.map(({title}) => (
                    <Step
                      key={title}
                      sx={{
                        "& .MuiStepLabel-root .Mui-active": {
                          color: VIOLET_500, // circle color (ACTIVE)
                        },
                        "& .MuiStepLabel-root .Mui-completed": {
                          color: VIOLET_500, // circle color (COMPLETED)
                        },
                        "& .MuiStepLabel-label": {
                          color: "black", // text color
                        },
                      }}
                    >
                      <StepLabel>{title}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              )}
              <div className="w-full h-full mt-20">
                <CurrentElement
                  {...props}
                  errors={errors}
                  submitForm={submitForm}
                  isSubmitting={isSubmitting}
                  hasErrors={hasErrors}
                  {...elementProps}
                />
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default MultiStepForm;
