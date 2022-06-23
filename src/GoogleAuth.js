import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { signIn, signOut } from "./actions";

const GoogleAuth = (props) => {
  // console.log(props);
  const { isSignedIn, signIn, signOut } = props;
  // const [isSignedIn, setSignedIn] = useState(null);
  const auth = useRef(null);

  useEffect(() => {
    window.gapi.load("client:auth2", () => {
      window.gapi.client
        .init({
          clientId:
            "317735021920-m0csq0oijnf64tb18usu5q5d3agd71o0.apps.googleusercontent.com",
          scope: "email",
          plugin_name: "streamy",
        })
        .then(() => {
          auth.current = window.gapi.auth2.getAuthInstance();
          onAuthChange(auth.current.isSignedIn.get());
          auth.current.isSignedIn.listen(onAuthChange);
        });
    });
  }, [isSignedIn]);
  // console.log(isSignedIn);

  // const onAuthChange = () => {
  //   setSignedIn(auth.current.isSignedIn.get());
  // };

  const onAuthChange = (isSignedIn) => {
    if (isSignedIn) {
      signIn(auth.current.currentUser.get().getId());
    } else {
      signOut();
    }
  };

  const onSignIn = () => {
    return auth.current.signIn();
  };

  const onSignOut = () => {
    return auth.current.signOut();
  };

  if (isSignedIn === null) {
    return null;
  } else if (isSignedIn) {
    return (
      <button onClick={onSignOut} className="ui red google button">
        <i className="google icon" />
        Sign Out
      </button>
    );
  } else {
    return (
      <button onClick={onSignIn} className="ui red google button">
        <i className="google icon" />
        Sign In
      </button>
    );
  }
};

const mapStateToProps = (state) => {
  return { isSignedIn: state.auth.isSignedIn };
};

export default connect(mapStateToProps, { signIn, signOut })(GoogleAuth);
