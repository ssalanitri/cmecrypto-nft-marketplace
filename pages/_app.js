/*!

=========================================================
* NextJS Material Dashboard v1.1.0 based on Material Dashboard React v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-material-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/nextjs-material-dashboard/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import App from "next/app";
import Head from "next/head";
import Router from "next/router";
import "../assets/css/nextjs-material-dashboard.css?v=1.1.0";

import PageChange from "../components/PageChange/PageChange.js";

Router.events.on("routeChangeStart", (url) => {
  console.log(`Loading: ${url}`);
  document.body.classList.add("body-page-transition");

  ReactDOM.render(
    <PageChange path={url} />,
    document.getElementById("page-transition")
  );
});

Router.events.on("routeChangeComplete", () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
  document.body.classList.remove("body-page-transition");
});
Router.events.on("routeChangeError", () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
  document.body.classList.remove("body-page-transition");
});

export default class Home extends App {
  componentDidMount() {
    let comment = document.createComment(`

=========================================================
* * NextJS Material Dashboard v1.1.0 based on Material Dashboard React v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-material-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/nextjs-material-dashboard/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

`);
    document.insertBefore(comment, document.documentElement);
  }
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    const Layout = Component.layout || (({ children }) => <>{children}</>);

    return (
      <>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <link
            rel="shortcut icon"
            href={require("../assets/img/favicon.png")}
          />
          <link
            rel="apple-touch-icon"
            sizes="76x76"
            href={require("../assets/img/apple-icon.png")}
          />
          {/* Fonts and icons */}
          <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet"
          />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </>
    );
  }
}
