import {createReducer} from "@reduxjs/toolkit";

import * as actions from "../actions";

type TokensState = {
    erc20: Record<string, ERC20>;
    erc721: Record<string, ERC721>;
    //erc1155: Record<string, ERC1155>;
};

const tokens_state: TokensState = {
    erc20: {},
    erc721: {},
    //erc1155: {},
};

export const tokensReducer = createReducer(tokens_state, (builder) => {});
