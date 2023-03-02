import {ActionReducerMapBuilder} from "@reduxjs/toolkit";

//import * as actions from "@redux/actions/votes";
import {DAOState} from "@redux/store";
import {getMiniDao} from "@helpers/chelo/daos";

export const votingReducer = (builder: ActionReducerMapBuilder<DAOState>) => {
    //builder.addCase(actions.onLoadVotes.fulfilled, (state: DAOState, action) => {
    //if (!action.payload) return;
    //const {votes, daoId} = action.payload;
    //const [mini, _dao] = getMiniDao(state, ({id}) => daoId === id);
    //if (mini) {
    //mini.votes = votes;
    //mini.votesLength = String(votes.length);
    //}
    //});
    //builder.addCase(actions.onAddVote.fulfilled, (state: DAOState, action) => {
    //const {vote, daoId} = action.payload;
    //const [mini, _dao] = getMiniDao(state, ({id}) => daoId === id);
    //mini.votes.push(vote);
    //});
    //builder.addCase(actions.onUpdateVote.fulfilled, (state: DAOState, action) => {
    //const {voteId, miniDao, changes} = action.payload;
    //const [mini] = getMiniDao(state, ({id}) => id === miniDao);
    //const voteIndex = mini.votes.findIndex(({id}) => id === voteId);
    //mini.votes[voteIndex] = changes(mini.votes[voteIndex]);
    //});
    //builder.addCase(actions.onLoadVoteScript.fulfilled, (state: DAOState, action) => {
    //const {vote, daoId} = action.payload;
    //const [mini] = getMiniDao(state, ({id}) => daoId === id);
    //const voteIndex = mini.votes.findIndex(({id}) => id === vote.id);
    //mini.votes[voteIndex] = vote;
    //});
};
