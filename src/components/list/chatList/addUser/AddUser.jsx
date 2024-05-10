import "./addUser.scss";
import { toast } from "react-toastify";
import { db } from "../../../../lib/firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { useUserStore } from "../../../../lib/userStore";

const AddUser = () => {
  const [user, setUser] = useState(null);

  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchTerm = formData.get("searchTerm");

    try {
      const usernameQuery = query(
        collection(db, "chatheads"),
        where("username", "==", searchTerm)
      );

      const emailQuery = query(
        collection(db, "chatheads"),
        where("email", "==", searchTerm)
      );

      // Execute the username query
      const usernameSnapshot = await getDocs(usernameQuery);

      if (!usernameSnapshot.empty) {
        // User found by username
        setUser(usernameSnapshot.docs[0].data());
        return;
      }

      // Execute the email query if no user is found by username
      const emailSnapshot = await getDocs(emailQuery);

      if (!emailSnapshot.empty) {
        // User found by email
        setUser(emailSnapshot.docs[0].data());
      } else {
        // Handle case where no user is found
        setUser(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
      // Check if the user is already added
      const userChatsDoc = await getDoc(doc(userChatsRef, currentUser.id));
      const chats = userChatsDoc.data().chats;

      const alreadyAdded = chats.some((chat) => chat.receiverId === user.id);

      if (alreadyAdded) {
        // Show toast notification if user is already added
        toast.error('User is already added to chat');
        return;
      }

      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Enter Username or Email" name="searchTerm" />
        <button>Search</button>
      </form>
      {user && (
        <div className="user">
          <div className="detail" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div>
              <img src={user.profileImg || "./profileImg.png"} alt="" />
            </div>
            <div>
              <div>
              {user.username}
              </div>
              <div style={{fontSize:'12px', color:'rgb(200, 200, 200)'}}>{user.email}</div>
            </div>
          
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
