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
        // Add this case in your reducer (inside builder)
        .addCase(actions.onRoundCreated.fulfilled, (state, action) => {
            const {round, daoId} = action.payload;
            const dao = state.daos.find((dao: MiniDAO) => dao.id === daoId) as MiniDAO;
            if (dao) {
                if (!dao.rounds) {
                    dao.rounds = [];
                }
                dao.rounds.push(round);
            }
        })

        .addCase(actions.onCreateProposal.fulfilled, (state, action) => {
            const {coreAddress, proposal} = action.payload;
            const dao = state.daos.find((dao: MiniDAO) => dao.id === coreAddress) as MiniDAO;
            if (dao) {
                if (!dao.rounds) {
                    dao.rounds = [];
                }
                const roundIndex = dao.rounds.findIndex((round) => round.id === proposal.roundId);
                dao.rounds[roundIndex].proposals.push(proposal);
            }
        })
        .addCase(actions.onVoteCast, (state, action) => {
            const {coreAddress, proposalId, support, votes} = action.payload;
            const dao = state.daos.find((dao: MiniDAO) => dao.id === coreAddress) as MiniDAO;
            const round = dao.rounds?.find((round) =>
                round.proposals.some((prop) => prop.id === proposalId.toString())
            );

            if (dao && dao.rounds) {
                const proposal = round.proposals.find((prop) => prop.id === proposalId.toString());
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
                (dao: MiniDAO) => dao.id.toLowerCase() === coreAddress.toLowerCase()
            ) as MiniDAO;
            const round = dao.rounds?.find((round) =>
                round.proposals.some((prop) => prop.id === proposalId.toString())
            );

            if (dao && round) {
                const proposal = round.proposals.find((prop) => prop.id === proposalId.toString());
                if (proposal) {
                    proposal.executed = true;
                }
            }
        });
});
