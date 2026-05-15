import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import ViewRequestModal from "./ViewRequestModal";
import NavBar from "./NavBar";

function RequestsPage() {
  const [requests, setRequests] = useState(null);
  const [userId, setUserId] = useState(null);
  const [modalRequest, setModalRequest] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id) => {
    console.log("started delete");
    const { error } = await supabase
      .from("requests")
      .delete("")
      .eq("id", id)
      .eq("requester_id", userId);

    if (error) {
      console.error(error);
    } else {
      console.log("success");
    }
  };

  const handleUpdate = async (status, id) => {
    const { error } = await supabase
      .from("requests")
      .update({
        request_status: status,
      })
      .eq("id", id);
    if (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: userId } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id);

      console.log(userId[0].id);
      setUserId(userId[0].id);

      const { data } = await supabase
        .from("requests")
        .select(
          `
    *,
    requester:profiles!requests_requester_id_fkey(*),
    requested:profiles!requests_requested_id_fkey(*)
  `,
        )
        .or(`requester_id.eq.${userId[0].id},requested_id.eq.${userId[0].id}`);
      console.log(data);
      setRequests(data);
      setLoading(false);
    };

    fetchRequests();
  }, []);

  return loading ? (
    <>loading</>
  ) : (
    <>
      <div>
        <NavBar></NavBar>
        <div>
          <h1> Pending Requests</h1>
          <div>
            <ul>
              {requests.map((req) => {
                return req.requested_id === userId ? (
                  req.request_status === "pending" ? (
                    <>
                      <li className="w-full h-40 border-black border-2 flex items-center gap-10 p-4">
                        <img
                          src={req.requester.avatar_url}
                          alt=""
                          className="w-20 h-20 object-cover"
                        />
                        <h1>{req.requester.full_name}</h1>
                        <h2 className="text-red-500">{req.request_status}</h2>
                        <button
                          onClick={() => {
                            setIsOpen(true);
                            setModalRequest(req);
                          }}
                        >
                          expand
                        </button>
                        {req.request_status === "pending" ? (
                          <>
                            <button
                              onClick={() => {
                                handleUpdate("accepted", req.id);
                              }}
                            >
                              accept
                            </button>
                            <button
                              onClick={() => {
                                handleUpdate("rejected", req.id);
                              }}
                            >
                              reject
                            </button>
                          </>
                        ) : req.request_status === "accepted" ? (
                          <>
                            <button
                              onClick={() => {
                                handleUpdate("completed", req.id);
                              }}
                            >
                              completed
                            </button>
                          </>
                        ) : (
                          <></>
                        )}
                      </li>
                    </>
                  ) : (
                    <></>
                  )
                ) : (
                  <></>
                );
              })}
            </ul>
          </div>
        </div>
        <div>
          <h1>Requests</h1>
          <div>
            <ul>
              {requests.map((req) => {
                return req.requested_id === userId ? (
                  <>
                    <li className="w-full h-40 border-black border-2 flex items-center gap-10 p-4">
                      <img
                        src={req.requester.avatar_url}
                        alt=""
                        className="w-20 h-20 object-cover"
                      />
                      <h1>{req.requester.full_name}</h1>
                      <h2 className="text-red-500">{req.request_status}</h2>
                      <button
                        onClick={() => {
                          setIsOpen(true);
                          setModalRequest(req);
                        }}
                      >
                        expand
                      </button>
                      {req.request_status === "pending" ? (
                        <>
                          <button
                            onClick={() => {
                              handleUpdate("accepted", req.id);
                            }}
                          >
                            accept
                          </button>
                          <button
                            onClick={() => {
                              handleUpdate("rejected", req.id);
                            }}
                          >
                            reject
                          </button>
                        </>
                      ) : req.request_status === "accepted" ? (
                        <>
                          <button
                            onClick={() => {
                              handleUpdate("completed", req.id);
                            }}
                          >
                            completed
                          </button>
                        </>
                      ) : (
                        <></>
                      )}
                    </li>
                  </>
                ) : (
                  <></>
                );
              })}
            </ul>
          </div>
        </div>
        <div>
          <h1>Your Requests</h1>
          <div>
            <ul>
              {requests.map((req) => {
                return req.requester_id === userId ? (
                  <>
                    <li className="w-full h-40 border-black border-2 flex items-center gap-10 p-4">
                      <img
                        src={req.requested.avatar_url}
                        alt=""
                        className="w-20 h-20 object-cover"
                      />
                      <h1>{req.requested.full_name}</h1>
                      <h2 className="text-red-500">{req.request_status}</h2>
                      <button
                        onClick={() => {
                          setIsOpen(true);
                          setModalRequest(req);
                        }}
                      >
                        expand
                      </button>
                      {req.request_status === "pending" ? (
                        <>
                          <button
                            onClick={() => {
                              handleUpdate("accepted", req.id);
                            }}
                          >
                            accept
                          </button>
                          <button
                            onClick={() => {
                              handleUpdate("rejected", req.id);
                            }}
                          >
                            reject
                          </button>
                          <button
                            onClick={() => {
                              handleDelete(req.id);
                            }}
                          >
                            cancel
                          </button>
                        </>
                      ) : req.request_status === "accepted" ? (
                        <>
                          <button
                            onClick={() => {
                              handleUpdate("completed", req.id);
                            }}
                          >
                            completed
                          </button>
                        </>
                      ) : (
                        <></>
                      )}
                    </li>
                  </>
                ) : (
                  <></>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      {isOpen ? (
        <>
          <ViewRequestModal
            setModalOpen={setIsOpen}
            modalRequest={modalRequest}
          ></ViewRequestModal>
        </>
      ) : (
        <>
          <h2>closed</h2>
        </>
      )}
    </>
  );
}
export default RequestsPage;
