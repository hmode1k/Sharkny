import { useEffect, useState } from "react";
import CardContainer from "./CardContainer";
import NavBar from "./NavBar";
import { supabase } from "../supabase-client";
import { useLocation, useParams } from "react-router";
import FullCardContainer from "./FullCardContainer";

function Profile() {
  const [name, setName] = useState("UserName");
  const [img, setImg] = useState(null);
  const [userId, setUserId] = useState(null);
  const [URLId, setURLId] = useState(null);
  const location = useLocation();
  const path = location.pathname.split("/");
  const { id } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      if (id === undefined) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const { error, data } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id);
        console.log(data);

        if (error) {
          console.error(error);
          return;
        }

        setName(data[0].full_name);
        setImg(data[0].avatar_url);
        setUserId(data[0].user_id);
        setURLId(data[0].id);
      } else {
        const { error, data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", id);

        if (error) {
          console.error(error);
          return;
        }

        setName(data[0].full_name);
        setImg(data[0].avatar_url);
        setUserId(data[0].user_id);
        setURLId(id);
      }
    };

    fetchUser();
  }, [id]);

  if (
    path.includes("library") ||
    path.includes("wishlist") ||
    path.includes("played")
  ) {
    return (
      <div>
        <NavBar></NavBar>
        <img src={img} alt="" className="w-50 h-50" />
        <h1>{name}</h1>
        <FullCardContainer header={path[3]} userId={userId}></FullCardContainer>
      </div>
    );
  } else {
    return (
      <>
        <div>
          <NavBar></NavBar>
          <img src={img} alt="" className="w-50 h-50" />
          <h1>{name}</h1>
          <CardContainer
            header="library"
            userId={userId}
            id={URLId}
          ></CardContainer>
          <CardContainer
            header="wishlist"
            userId={userId}
            id={URLId}
          ></CardContainer>
          <CardContainer
            header="played"
            userId={userId}
            id={URLId}
          ></CardContainer>
        </div>
      </>
    );
  }
}

export default Profile;
