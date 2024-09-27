import "./userInfo.scss"
import { useUserStore } from "../../../lib/userStore";

const Userinfo = () => {

  const { currentUser } = useUserStore();

  return (
    <div className='userInfo'>
      <div className="user">
        <img src={currentUser.profileImg || "./profileImg.png"} alt="" />
        <h2>{currentUser.username}</h2>
      </div>
      {/* <div className="icons">
        <img src="./more.png" alt="" />
      </div> */}
    </div>
  )
}

export default Userinfo