import {toBN} from "@helpers/index";
import {createReducer} from "@reduxjs/toolkit";
import * as actions from "../actions/daos";

const dao_state: {daos: DAO[]; loaded: boolean} = {
    daos: [],
    loaded: false,
};

export const daoReducer = createReducer(dao_state, (builder) => {
    builder
        .addCase(actions.onGetUserDaos.fulfilled, (state, action) => {
            state.daos.push(...action.payload);
            state.loaded = true;
        })
        .addCase(actions.onCreateProposal.fulfilled, (state, action) => {
            const {coreAddress, proposal} = action.payload;
            const dao = state.daos.find((dao: MiniDAO) => dao.id === coreAddress) as MiniDAO;
            if (dao) {
                if (!dao.proposals) {
                    dao.proposals = [];
                }
                dao.proposals.push(proposal);
            }
        })
        .addCase(actions.onVoteCast, (state, action) => {
            const {coreAddress, proposalId, support, votes} = action.payload;
            const dao = state.daos.find((dao: MiniDAO) => dao.id === coreAddress) as MiniDAO;
            if (dao && dao.proposals) {
                const proposal = dao.proposals.find((p) => p.proposalId === proposalId.toString());
                if (proposal) {
                    if (support == 1) {
                        proposal.votesYes = toBN(proposal.votesYes)
                            .add(votes.toString())
                            .toString();
                    } else {
                        proposal.votesNo = toBN(proposal.votesNo).add(votes.toString()).toString();
                    }
                }
            }
        })
        .addCase(actions.onProposalExecuted, (state, action) => {
            const {coreAddress, proposalId} = action.payload;
            const dao = state.daos.find(
                (dao: MiniDAO) => dao.token.address === coreAddress
            ) as MiniDAO;
            if (dao && dao.proposals) {
                const proposal = dao.proposals.find((p) => p.proposalId === proposalId.toString());
                if (proposal) {
                    proposal.executed = true;
                }
            }
        });
});
