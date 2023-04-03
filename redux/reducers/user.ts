import {createReducer} from "@reduxjs/toolkit";

import {ConnectionType} from "@helpers/connection";
import * as actions from "../actions";
import {TransactionMeta} from "types";

type UserState = {
    account: {
        address: string;
        wallet: ConnectionType;
        networkId: SupportedNetworks;
        subscribed: boolean;
    };
    transaction: {
        tx: TransactionMeta;
        open: boolean;
        metadata?: unknown;
    };
    assets: {
        erc721: {address: string; id: string}[];
        erc20: {address: string; balance: string}[];
    };
    error: {
        open: boolean;
        code: string;
        message: string;
    };
};

//create a default info for the Type UserState
const user_state: UserState = {
    account: {
        address: "",
        wallet: ConnectionType.INJECTED,
        networkId: null,
        subscribed: false,
    },
    transaction: {
        tx: {
            txs: [],
            type: "wallet",
        },
        open: false,
    },
    assets: {
        erc721: [],
        erc20: [],
    },
    error: {
        open: false,
        code: "",
        message: "",
    },
};

export const userReducer = createReducer(user_state, (builder) => {
    builder.addCase(actions.onConnectWallet.fulfilled, (state: UserState, action) => {
        state.account.address = action.payload.account;
        state.account.wallet = action.payload.wallet;
        state.account.networkId = action.payload.networkId;
    });

    builder.addCase(actions.onUpdateError, (state: UserState, action) => {
        state.error = {...state.error, ...action.payload};
    });

    builder.addCase(actions.onSwitchNetwork.fulfilled, (state: UserState, action) => {
        state.account.networkId = action.payload.network;
    });

    builder.addCase(actions.onShowTransaction, (state: UserState, action) => {
        if (action.payload === false || action.payload === true)
            state.transaction.open = action.payload;
        else {
            state.transaction = {
                tx: {...action.payload},
                open: action.payload.showModal !== undefined ? action.payload.showModal : true,
                metadata: action.payload.metadata,
            };
        }
    });

    builder.addCase(actions.onSubscribeEvents.fulfilled, (state: UserState, action) => {
        state.account.subscribed = action.payload;
    });

    //error handling
    builder.addCase(actions.onSwitchNetwork.rejected, (state: UserState, action) => {
        state.error = action.payload;
    });

    builder.addCase(actions.onLoadWalletAssets.rejected, (state: UserState, action) => {
        state.error = action.payload;
    });

    builder.addCase(actions.onConnectWallet.rejected, (state: UserState, action) => {
        state.error = action.payload;
    });
});
