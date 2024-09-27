import React, { useState, useEffect } from "react";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import List from "./components/list/List";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setOpen(true); 
  };

  const handleConfirmLogout = () => {
    auth.signOut(); 
    setOpen(false); 
  };

  const handleCancelLogout = () => {
    setOpen(false);
  };

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      {currentUser ? (
        <>
          <List />
          {chatId && <Chat />}
          {/* {chatId && <Detail />} */}
          <button className="logout" onClick={handleLogout}>
            Logout
          </button>


          {/* Dialog for confirming logout */}
          <Dialog open={open} onClose={handleCancelLogout}>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogContent>
              <DialogContentText>Are you sure you want to sign out?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelLogout}>Cancel</Button>
              <Button onClick={handleConfirmLogout} color="primary">
                Logout
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <Login />
      )}
      <Notification />
    </div>
  );
};

export default App;
