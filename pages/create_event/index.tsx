import React, {useState} from "react";
import {useRouter} from "next/router";
import * as Yup from "yup";
import {TextInput} from "@shared/components/common/Forms";
import {useAppDispatch} from "@redux/store";
import {useDaos} from "@shared/hooks/daos";
import ImageUpload from "@shared/components/common/ImageUpload";
import {DateTimePicker} from "@shared/components/common/DatePicker";
import {upload, uploadJson} from "@helpers/chelo";
import {onShowTransaction} from "@redux/actions";
import {calculateTimeInBlocks} from "@helpers/contracts";
import MultiStepForm from "@shared/components/common/MultiStepForm";
import {Button} from "@shared/components/common/Forms/Button";
import EventCard from "@shared/components/talent/EventCard";
import {ipfsToHttp} from "@helpers/index";

const UPLOADING_TAG = "uploading";

type FormValues = {
  name: string;
  location: string;
  endTime: Date;
  description: string;
  image: string;
  fileImage: File | null;
  numberOfWinners: number;
};

const CreateEvent = () => {
  const router = useRouter();
  const {daos, loaded} = useDaos();
  const dispatch = useAppDispatch();
  const [uploading, setUploading] = useState(false);

  const handleNormalSubmit = async (values: FormValues) => {
    setUploading(true);
    try {
      const numOfBlocksToWait = calculateTimeInBlocks({
        dateStart: new Date(),
        dateEnd: values.endTime,
      });
      const data: ProposalRound["metadata"] = {
        title: values.name,
        description: values.description,
        image: values.image,
        metadata: {
          startDate: new Date().getTime(),
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
              args: [dataCid, values.numberOfWinners, numOfBlocksToWait], //TODO calculate mint amount
            },
          ],
          dao: dao.id,
          type: "wallet",
          metadata: {
            cid: dataCid,
          },
        })
      );
    } catch (err) {
      console.log("ERROR", err);
    }
    setUploading(false);
  };

  return (
    <div className="flex flex-col items-center w-full overflow-scroll pb-4 h-full">
      <div className="w-full mb-20 flex justify-center gap-5 px-10">
        <div className="w-full py-5 flex flex-col justify-center">
          <MultiStepForm
            stepper
            onSubmit={handleNormalSubmit}
            initialValues={{
              name: "",
              location: "",
              endTime: new Date(),
              description: "",
              image: "",
              fileImage: null,
              numberOfWinners: 1,
            }}
            validationSchema={Yup.object({
              name: Yup.string().required("Name required"),
              location: Yup.string().required("Location required"),
              endTime: Yup.date()
                .min(new Date(), "Start time must be in the future")
                .required("Start time required"),
              description: Yup.string().required("Description required"),
              image: Yup.string()
                .test("notUploading", (image) => image !== UPLOADING_TAG)
                .required("Image required"),
              fileImage: Yup.mixed().required("Image required"),
              numberOfWinners: Yup.number()
                .required("Number of winners required")
                .min(1, "Minimum number of winners is 1"),
            })}
            forms={[
              {
                fields: ["name", "description", "location"],
                element: ({values}) => (
                  <div className="flex justify-center">
                    <div className="flex flex-col justify-center lg:w-2/3 md:w-full">
                      <div className="flex justify-center gap-4">
                        <TextInput
                          white
                          name="name"
                          classes={{root: "w-1/2 mb-4"}}
                          placeholder="Name"
                        />
                        <TextInput
                          white
                          name="location"
                          classes={{root: "w-1/2 mb-4"}}
                          placeholder="Location"
                        />
                      </div>
                      <TextInput
                        white
                        lines={8}
                        name="description"
                        classes={{root: "w-full mb-4"}}
                        placeholder="Description"
                      />
                    </div>
                  </div>
                ),
                title: "Event Details",
              },
              {
                fields: ["image"],
                element: ({setFieldValue, values}) => (
                  <div className="flex justify-center">
                    <div className="flex flex-col justify-center items-center lg:w-1/2 md:w-full">
                      <ImageUpload
                        classes={{root: "w-2/3 h-72 flex justify-center items-center"}}
                        value={values.fileImage}
                        onChange={(file) => setFieldValue("fileImage", file)}
                      />
                      <div className="bg-gray-300"></div>
                      <Button
                        className={`w-1/3 p-2 bg-${values.image === UPLOADING_TAG ? "gray-300" : "violet-500"
                          } text-white rounded-xl font-bold mt-4`}
                        disabled={values.image === UPLOADING_TAG}
                        onClick={async () => {
                          setFieldValue("image", UPLOADING_TAG);
                          const imageCid = `${await upload([values.fileImage])}/${values.fileImage.name
                            }`;
                          setFieldValue("image", imageCid);
                        }}
                      >
                        {values.image === UPLOADING_TAG
                          ? "Uploading..."
                          : values.image
                            ? "Update"
                            : "Upload"}
                      </Button>
                    </div>
                  </div>
                ),
                title: "Add Photo",
              },
              {
                fields: ["endTime"],
                element: () => (
                  <div className="flex justify-center">
                    <div className="flex flex-col justify-center lg:w-1/2 md:w-full">
                      <DateTimePicker name="endTime" label="End Date" placeholder="End time" />
                    </div>
                  </div>
                ),
                title: "Date Configuration",
              },
              {
                fields: ["numberOfWinners"],
                element: () => (
                  <div className="flex justify-center">
                    <div className="flex flex-col justify-center lg:w-1/2 md:w-full">
                      <TextInput
                        type="number"
                        white
                        label="Number of winners"
                        name="numberOfWinners"
                        classes={{root: "w-full mb-4"}}
                        placeholder="Number of Winners"
                      />
                    </div>
                  </div>
                ),
                title: "Number of Winners",
              },
              {
                fields: [],
                element: ({values, hasErrors, isSubmitting}) => (
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-2/3 flex flex-col items-end">
                      <EventCard
                        image={ipfsToHttp(values.image)}
                        eventTitle={values.name}
                        title={"Event Info"}
                        startDate={new Date().getTime()}
                        endDate={values.endTime.getTime()}
                        location={values.location}
                        numberOfWinners={values.numberOfWinners}
                        isFinished={false}
                        description={values.description}
                      />

                      <Button
                        className={`w-1/3 p-2 bg-${hasErrors || isSubmitting ? "gray-300" : "violet-500"
                          } text-white rounded-xl font-bold mt-4`}
                        disabled={hasErrors}
                        onClick={async () => {}}
                      >
                        {isSubmitting ? "Uploading..." : "Submit"}
                      </Button>
                    </div>
                  </div>
                ),
                title: "Review and Create",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
