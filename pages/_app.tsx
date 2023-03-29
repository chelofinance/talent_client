import "tailwindcss/tailwind.css";
import {wrapper} from "../redux/store";
import {Provider} from "react-redux";
import {registerLocale} from "react-datepicker";
import es from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";
import * as Yup from "yup";
import {ethers} from "ethers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";

import Web3Provider from "@shared/components/common/Web3Provider";
import Layout from "../shared/layout";
import "../shared/styles/index.scss";

registerLocale("es", es);

Yup.addMethod(Yup.string, "isEthAddress", function (message: string) {
  return this.test("test-name", message, function (value) {
    const {createError, path} = this;
    return ethers.utils.isAddress(value) || createError({path, message});
  });
});

function MyApp({Component, ...rest}) {
  const {store, props} = wrapper.useWrappedStore(rest);
  return (
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Web3Provider>
          <Layout>
            <Component {...props.pageProps} />
          </Layout>
        </Web3Provider>
      </LocalizationProvider>
    </Provider>
  );
}

export default MyApp;
