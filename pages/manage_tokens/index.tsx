import React, {useState} from "react";
import SearchIcon from "@mui/icons-material/Search";
import {useAppDispatch, useAppSelector} from "@redux/store";
import {useDaos} from "@shared/hooks/daos";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AvatarElement from "@shared/components/common/AvatarElement";
import EthAddress from "@shared/components/common/EthAddress";
import Card from "@shared/components/common/Card";
import {onShowTransaction} from "@redux/actions";
import {getInterface} from "@helpers/contracts";
import {TextInput} from "@shared/components/common/Forms";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import {Fade} from "@mui/material";

const tokenSelected = {
  Alumni: {id: "1", name: "Alumni"},
  Talent: {id: "2", name: "Talent"},
  Sponsor: {id: "3", name: "Sponsor"},
};

const ManageTokens = () => {
  const {daos} = useDaos();
  const dispatch = useAppDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedList, setSelectedList] = useState(tokenSelected.Alumni);
  const [showForm, setShowForm] = useState(false);
  const [newMembers, setNewMembers] = useState([{wallet: ""}]);

  const handleRemoveMember = (member: {account: string; stake: string; role: string}) => {
    const dao = daos[0];
    // Remove member logic here
    dispatch(
      onShowTransaction({
        txs: [
          {
            to: dao.token.address,
            signature: "burn(address,uint,uint)",
            args: [member.account, member.role, 1],
          },
        ],
        dao: dao.id,
        type: "wallet",
      })
    );
  };

  const handleAddMember = () => {
    setShowForm(true);
  };

  const renderList = () => {
    const list = daos[0].members.filter((member) => member.role === selectedList.id);
    const filteredList = filterMembers(list);

    return (
      <Card className="p-4 min-w-96">
        <h2 className="text-2xl mb-4">{selectedList.name}</h2>
        <div className="flex items-center mb-4">
          <SearchIcon />
          <TextInput
            white
            noFormik
            classes={{root: "w-full ml-2"}}
            placeholder="Search address"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="h-64 overflow-y-auto">
          {filteredList.length > 0 ? (
            filteredList.map((member, index) => (
              <div
                key={index}
                className="flex justify-between items-center mb-4 rounded-md px-4 py-2"
              >
                <AvatarElement
                  address={member.account}
                  infoComponent={<EthAddress address={member.account || ""} length={10} />}
                />
                <button
                  onClick={() => handleRemoveMember(member)}
                  className="text-violet-500 rounded-md p-2"
                >
                  <DeleteIcon />
                </button>
              </div>
            ))
          ) : (
            <div className="my-3 justify-center flex text-gray-600">
              There are no {selectedList.name} members
            </div>
          )}
        </div>
        <div className="flex justify-center w-full">
          <button
            onClick={handleAddMember}
            className="bg-violet-500 text-white rounded-md px-4 py-2 hover:bg-violet-600"
          >
            Add Member
          </button>
        </div>
      </Card>
    );
  };

  const handleAddNewMemberField = () => {
    setNewMembers([...newMembers, {wallet: ""}]);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setNewMembers([{wallet: ""}]);
  };

  const handleFormSubmit = (values: {newMembers: {wallet: string}[]}) => {
    const dao = daos[0];
    const token = getInterface("ERC1155");
    const mintCalldata = values.newMembers.map(({wallet}) =>
      token.encodeFunctionData("mint", [wallet, selectedList.id, 1, []])
    );

    dispatch(
      onShowTransaction({
        txs: [
          {
            to: dao.token.address,
            signature: "multicall(bytes[])",
            args: [mintCalldata],
          },
        ],
        dao: dao.id,
        type: "wallet",
      })
    );
  };

  const handleRemoveNewMemberField = (index: number) => {
    setNewMembers(newMembers.filter((_, i) => i !== index));
  };

  const renderForm = () => {
    return (
      <Formik
        initialValues={{newMembers}}
        onSubmit={handleFormSubmit}
        validationSchema={Yup.object({
          newMembers: Yup.array().of(
            Yup.object({
              wallet: (Yup.string().required("User wallet required") as any).isEthAddress(),
            })
          ),
        })}
      >
        {({errors, ...props}) => (
          <Form className="flex flex-col justify-between w-full">
            <Card className="p-4 min-w-96">
              <h2 className="text-2xl mb-4">Add {selectedList.name} members</h2>
              <div className="flex flex-col items-center">
                {newMembers.map((member, index) => (
                  <div key={index} className="w-full mb-3 flex items-center">
                    <TextInput
                      white
                      name={`newMembers.${index}.wallet`}
                      classes={{root: "w-full"}}
                      placeholder="Wallet Address"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewMemberField(index)}
                      className="text-violet-500 ml-2"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                ))}
                <div
                  onClick={handleAddNewMemberField}
                  className="text-violet-500 px-4 py-2 m-0"
                  style={{margin: 0}}
                >
                  <AddIcon />
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex justify-between gap-4 w-full">
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-violet-500 text-white rounded-md px-4 py-2 hover:bg-violet-600"
                    onClick={() => props.handleSubmit()}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </Card>
          </Form>
        )}
      </Formik>
    );
  };

  const filterMembers = (list) => {
    if (searchQuery.trim() === "") return list;
    return list.filter((member) =>
      member.account.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
  };

  return (
    <>
      <div className="flex flex-col items-center w-full pt-20 pb-4 h-full">
        <div className="w-full mb-20 flex justify-center gap-5">
          {Object.values(tokenSelected).map((token) => (
            <button
              key={token.id}
              onClick={() => setSelectedList(token)}
              className={`bg-${selectedList.id === token.id ? "violet-500 text-white" : "violet-200"
                } rounded-md px-4 py-2 hover:bg-violet-400`}
            >
              {token.name}
            </button>
          ))}
        </div>
        <div className="relative w-96">
          <Fade in={!showForm} timeout={200}>
            <div className="absolute w-full">{renderList()}</div>
          </Fade>
          <Fade in={showForm} timeout={200}>
            <div className="absolute w-full">{renderForm()}</div>
          </Fade>
        </div>
      </div>
    </>
  );
};

export default ManageTokens;
