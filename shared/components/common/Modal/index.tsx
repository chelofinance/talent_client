import * as React from "react";
import Box from "@mui/material/Box";
import {BoxProps} from "@mui/system";
import {ModalUnstyled} from "@mui/core";
import {XIcon} from "@heroicons/react/solid";

interface ModalProps {
  content: any;
  showModal: boolean;
  setShowModal: any;
  showBtn?: boolean;
  showBtnText?: string;
  boxProps?: BoxProps;
  disableClose?: boolean;
}

const style = {
  transform: "translate(-50%, -50%)",
  width: 400,
};

const Backdrop = (props) => (
  <div {...props} className="fixed right-0 bottom-0 top-0 left-0 bg-black opacity-50 -z-50"></div>
);

const ModalComp = ({
  content,
  showModal,
  setShowModal,
  showBtn = true,
  showBtnText = "Toggle modal",
  disableClose,
  boxProps,
}: ModalProps) => {
  const [open, setOpen] = React.useState(showModal);
  const handleClose = (e: Event, reason: string) => {
    if (["escapeKeyDown", "backdropClick"].indexOf(reason) === -1) {
      setOpen(false);
    }
  };

  const onModalClose = (e: any) => {
    setOpen(false);
    setShowModal(false);
  };

  React.useEffect(() => {
    setOpen(showModal);
  }, [showModal]);

  return (
    <ModalUnstyled
      open={open}
      onClose={handleClose}
      classes={{
        root: "fixed z-50 top-0 bottom-0 flex m-0 p-0 w-full h-full",
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      BackdropComponent={Backdrop}
    >
      <Box
        sx={style}
        className="flex flex-col items-center absolute top-1/2 left-1/2 bg-white rounded-md shadow-2xl shadow-black p-1"
        {...boxProps}
      >
        <div className="flex flex-row justify-end w-full h-4">
          <button
            onClick={onModalClose}
            disabled={disableClose}
            className={disableClose && "text-gray-400"}
          >
            <XIcon width={25} className="m-0" />
          </button>
        </div>
        {content}
      </Box>
    </ModalUnstyled>
  );
};

export default ModalComp;
