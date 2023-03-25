import React, {useState} from "react";
import {useRouter} from "next/router";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import Card from "@shared/components/common/Card";
import {Button, TextInput} from "@shared/components/common/Forms";
import {useAppDispatch} from "@redux/store";
import {useDaos} from "@shared/hooks/daos";
import ImageUpload from "@shared/components/common/ImageUpload";
import {DateTimePicker} from "@shared/components/common/DatePicker";
import {upload, uploadJson} from "@helpers/chelo";
import {onShowTransaction} from "@redux/actions";
import {calculateTimeInBlocks} from "@helpers/contracts";

type FormValues = {
  name: string;
  location: string;
  startTime: Date;
  endTime: Date;
  description: string;
  image: File | null;
};

const CreateEvent = () => {
  const router = useRouter();
  const {daos, loaded} = useDaos();
  const dispatch = useAppDispatch();
  const [uploading, setUploading] = useState(false);

  const handleNormalSubmit = async (values: FormValues) => {
    setUploading(true);
    const imageCid = await upload([values.image]);
    const numOfBlocksToWait = calculateTimeInBlocks({
      dateStart: values.startTime,
      dateEnd: values.endTime,
    });
    const data: ProposalRound["metadata"] = {
      title: values.name,
      description: values.description,
      image: imageCid,
      metadata: {
        startDate: values.startTime.getTime(),
        endDate: values.endTime.getTime(),
        location: values.location,
      },
    };
    const dataCid = await uploadJson(data);
    const dao = daos[daos.length - 1] as MiniDAO;

    dispatch(
      onShowTransaction({
        txs: [
          {
            to: dao.id,
            signature: "createRound(string,uint256,uint64)",
            args: [dataCid, 3, numOfBlocksToWait], //TODO calculate mint amount
          },
        ],
        dao: dao.id,
        type: "wallet",
        metadata: {
          cid: dataCid,
        },
      })
    );
    setUploading(false);
  };

  return (
    <>
      <div className="flex flex-col items-center w-full overflow-scroll pt-20 pb-4 h-full">
        <div className="w-full mb-20 flex justify-center gap-5">
          <Card className="w-full py-5 flex flex-col justify-center">
            <div className="border-b border-gray-200 pb-2 w-full flex justify-center">
              <span className="text-violet-500 font-semibold text-lg">Create Event</span>
            </div>
            <div className="px-5 flex flex-col w-full px-20 pt-5">
              <Formik
                onSubmit={handleNormalSubmit}
                initialValues={{
                  name: "",
                  location: "",
                  startTime: new Date(),
                  endTime: new Date(),
                  description: "",
                  image: null,
                }}
                validationSchema={Yup.object({
                  name: Yup.string().required("Name required"),
                  location: Yup.string().required("Location required"),
                  startTime: Yup.date().required("Start time required"),
                  endTime: Yup.date().required("End time required"),
                  description: Yup.string().required("Description required"),
                  image: Yup.mixed().required("Image required"),
                })}
              >
                {({errors, ...props}) => {
                  return (
                    <Form className="flex flex-col justify-between items-center w-full h-full">
                      <div className="w-full flex gap-3">
                        <TextInput
                          white
                          name="name"
                          classes={{root: "w-1/4 mb-4"}}
                          placeholder="Name"
                        />
                        <TextInput
                          white
                          name="location"
                          classes={{root: "w-3/4 mb-4"}}
                          placeholder="Location"
                        />
                      </div>
                      <div className="w-full flex gap-3">
                        <DateTimePicker
                          label="Start Date and Time"
                          value={props.values.startTime}
                          onChange={(date) => props.setFieldValue("startDate", date)}
                        />
                        <DateTimePicker
                          label="End Date and Time"
                          value={props.values.endTime}
                          onChange={(date) => props.setFieldValue("endDate", date)}
                        />
                      </div>
                      <TextInput
                        white
                        name="description"
                        classes={{root: "w-full mb-4"}}
                        placeholder="Description"
                      />
                      <ImageUpload
                        classes={{root: "w-full"}}
                        value={props.values.image}
                        onChange={(file) => props.setFieldValue("image", file)}
                      />
                      <Button
                        className="w-full p-2 bg-violet-500 text-sm text-white rounded-full font-semibold mt-8"
                        onClick={() => props.submitForm()}
                        disabled={uploading}
                      >
                        {uploading ? "Uploading" : "Save"}
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

export default CreateEvent;
