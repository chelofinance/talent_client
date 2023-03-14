import React from "react";
import {useRouter} from "next/router";
import {Form, Formik} from "formik";
import * as Yup from "yup";

import Card from "@shared/components/common/Card";
import {Button, TextInput} from "@shared/components/common/Forms";
import {useAppDispatch} from "@redux/store";
import {onShowTransaction} from "@redux/actions";
import {useDaos} from "@shared/hooks/daos";

type FormValues = {
  firstName: string;
  lastName: string;
  wallet: string;
};

const AddParticipant = () => {
  const router = useRouter();
  const {daos, loaded} = useDaos();
  const dispatch = useAppDispatch();
  const eventId = router.query.id;

  const handleNormalSubmit = (values: FormValues) => {
    const dao = daos[0] as MiniDAO;
    dispatch(
      onShowTransaction({
        txs: [
          {
            to: dao.token.address,
            signature: "mint(address to,uint256 amount)",
            args: [values.wallet, 100], //TODO calculate mint amount
          },
        ],
        dao: dao.id,
        type: "chelo",
      })
    );
  };

  return (
    <>
      <div className="flex flex-col items-center w-full overflow-scroll pt-20 pb-4 h-full">
        <div className="w-full mb-20 flex justify-center gap-5">
          <Card className="w-1/2 py-5 flex flex-col justify-center">
            <div className="border-b border-gray-200 pb-2 w-full flex justify-center">
              <span className="text-violet-500 font-semibold text-lg">Add Candidate List</span>
            </div>
            <div className="px-5 flex flex-col w-full px-20 pt-5">
              <div className="mb-4">
                <span className="text-sm text-gray-600">Details</span>
              </div>
              <Formik
                onSubmit={handleNormalSubmit}
                initialValues={{
                  firstName: "",
                  lastName: "",
                  wallet: "",
                }}
                validationSchema={Yup.lazy((values: FormValues) => {
                  return Yup.object({
                    firstName: Yup.string().required("Principal required"),
                    lastName: Yup.string().required("APR required"),
                    wallet: Yup.string().required("User wallet required"),
                  });
                })}
              >
                {({errors, ...props}) => {
                  return (
                    <Form className="flex flex-col justify-between items-center w-full h-full">
                      <TextInput
                        white
                        name="principal"
                        classes={{root: "w-full mb-4"}}
                        placeholder="First Name"
                      />
                      <TextInput
                        white
                        name="apr"
                        type="number"
                        classes={{root: "w-full mb-4"}}
                        placeholder="Last Name"
                      />
                      <TextInput
                        white
                        name="apr"
                        type="number"
                        classes={{root: "w-full"}}
                        placeholder="Wallet Address"
                      />
                      <Button
                        className="w-full p-2 bg-violet-500 text-sm text-white rounded-full font-semibold mt-8"
                        type="submit"
                      >
                        Save
                      </Button>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AddParticipant;
