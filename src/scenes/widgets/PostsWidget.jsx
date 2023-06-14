import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, setBuildings } from "state";
import PostWidget from "./PostWidget";
import { getWardBusinesses, getUsername } from "helper/helper";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const query = useSelector((state) => state.searchQuery);
  const [user, setUser] = useState();
  const [wardbusinesses, setWardbusinesses] = useState([]);
  const [filteredbusiness, setFiltered] = useState([]);

  useEffect(() => {
    getUsername().then((user) => setUser(user));
  }, []);

  useEffect(() => {
    if (user !== undefined) {
      getWardBusinesses({ ward: user?.ward }).then(({ data }) => {
        console.log(data)
        setWardbusinesses(data);
        dispatch(setBuildings(data))
        localStorage.setItem("buildings",JSON.stringify(data))
      });
    }
  }, [user]);

  useEffect(() => {
    let filtered = wardbusinesses.filter((el) => {
      const {
        building_number,
        payment_status,
        street,
        type_of_structure,
      } = el;
      const filteredEl = {
        building_number,
        payment_status,
        street,
        type_of_structure,
      };

      for (const key in filteredEl) {
        if (
          filteredEl[key]?.toString().toLowerCase().includes(query.toLowerCase())
        ) {
          return true;
        }
      }
      return false;
    });
    setFiltered(filtered);
  }, [query, wardbusinesses]);

  const businessesToRender = query ? filteredbusiness : wardbusinesses;

  return (
    <>
      {businessesToRender.map(
        ({
          building_number,
          floors,
          type_of_structure,
          street,
          description,
          payment_status,
          _id
        }) => (
          <PostWidget
            key={building_number}
            postUserId={userId}
            building_number={building_number}
            description={description}
            floors={floors}
            type_of_structure={type_of_structure}
            street={street}
            payment_status={payment_status}
            id={_id}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;
