import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import ViewRequestModal from "./ViewRequestModal";
import AsideWrapper from "./AsideWrapper";
import NavBar from "./NavBar";
import { useAuth } from "../AuthContext";

function RequestsPage() {
  const [requests, setRequests] = useState(null);
  const [userId, setUserId] = useState(null);
  const [modalRequest, setModalRequest] = useState(null);
  const [openSection, setOpenSection] = useState(null);
  const [requester, setRequester] = useState(null);
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const toggleSection = (name) => {
    setOpenSection((prev) => (prev === name ? null : name));
  };

  const handleDelete = async (id) => {
    console.log("started delete");
    const { error } = await supabase
      .from("requests")
      .delete("")
      .eq("id", id)
      .eq("requester_id", userId);

    if (error) {
      console.error(error);
      setToastType("error");
      setToast("Error Deleting");
      return;
    }

    setToastType("success");
    setToast("Request Deleted");
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
      setToastType("error");
      setToast("Error Deleting");
      return;
    }
    setToastType("success");
    setToast(`Request ${status}`);
  };

  useEffect(() => {
    const fetchRequests = async () => {
      const { data: userId } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user?.id);

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
      const sortedRequests = [...data].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      );

      setRequests(sortedRequests);
      setLoading(false);
    };

    fetchRequests();
  }, [user?.id]);

  return loading ? (
    <>loading</>
  ) : (
    <>
      <div>
        <NavBar></NavBar>
        <div className="h-full w-full sm:grid sm:grid-cols-[150px_minmax(200px,_1fr)]">
          <AsideWrapper></AsideWrapper>
          <div className="text-text-primary p-4 flex flex-col gap-5">
            <div className="text-text-primary">
              <div className="flex gap-10">
                <h1 className="pbe-4"> Pending Requests</h1>
                <h1
                  onClick={() => toggleSection("pending")}
                  className="cursor-pointer"
                >
                  {openSection === "pending" ? <>↑</> : <>↓</>}
                </h1>
              </div>
              <div>
                <ul
                  className={`${openSection === "pending" ? "max-h-80" : "max-h-0"} overflow-scroll transition-all flex flex-col gap-4 px-4`}
                >
                  {requests.map((req) => {
                    return req.requested_id === userId ? (
                      req.request_status === "pending" ? (
                        <>
                          <li className="w-full border-white border-1 rounded-xl flex items-center justify-between p-4">
                            <div className="flex items-center gap-10 max-sm:gap-5">
                              <img
                                src={req.requester.avatar_url}
                                alt=""
                                className="w-20 h-20 object-cover rounded-[50%] max-sm:w-15 max-sm:h-15"
                              />
                              <div className="flex flex-col gap-2">
                                <h1 className="max-sm:text-sm">
                                  {req.requester.full_name}
                                </h1>
                                <h2 className="text-text-muted max-sm:text-xs">
                                  {req.created_at?.slice(0, 10)}
                                </h2>
                              </div>
                              <h2
                                className={`${
                                  req.request_status === "pending"
                                    ? "text-yellow-500"
                                    : req.request_status === "completed"
                                      ? "text-green-500"
                                      : req.request_status === "accepted"
                                        ? "text-green-500"
                                        : "text-red-500"
                                } max-sm:text-sm`}
                              >
                                {req.request_status}
                              </h2>
                            </div>
                            <div className="flex flex-col gap-5 max-sm:gap-3">
                              <button
                                onClick={() => {
                                  setIsOpen(true);
                                  setModalRequest(req);
                                }}
                                className="px-4 bg-accent-primary rounded-xl max-sm:text-xs max-sm:px-0"
                              >
                                See Request
                              </button>
                              {req.request_status === "pending" ? (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      handleUpdate("completed", req.id);
                                    }}
                                    className="px-4 bg-green-500 rounded-xl max-sm:text-xs max-sm:px-2"
                                  >
                                    Complete
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleUpdate("rejected", req.id);
                                    }}
                                    className="px-4 bg-red-500 rounded-xl max-sm:text-xs max-sm:px-2"
                                  >
                                    Reject
                                  </button>
                                </div>
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
                            </div>
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
              <div className="flex gap-10">
                <h1 className="pbe-4">Requests</h1>
                <h1
                  onClick={() => toggleSection("requests")}
                  className="cursor-pointer"
                >
                  {openSection === "requests" ? <>↑</> : <>↓</>}
                </h1>
              </div>
              <div>
                <ul
                  className={`${openSection === "requests" ? "max-h-80" : "max-h-0"} overflow-scroll transition-all flex flex-col gap-4 px-4`}
                >
                  {requests.map((req) => {
                    return req.requested_id === userId ? (
                      <>
                        <li className="w-full border-white border-1 flex items-center justify-between p-4 rounded-xl">
                          <div className="flex items-center gap-10 max-sm:gap-5">
                            <img
                              src={req.requester.avatar_url}
                              alt=""
                              className="w-20 h-20 object-cover rounded-[50%] max-sm:w-15 max-sm:h-15"
                            />
                            <div className="flex flex-col gap-2 ">
                              <h1 className="max-sm:text-sm">
                                {req.requester.full_name}
                              </h1>
                              <h2 className="text-text-muted max-sm:text-xs">
                                {req.created_at?.slice(0, 10)}
                              </h2>
                            </div>
                            <h2
                              className={`${
                                req.request_status === "pending"
                                  ? "text-yellow-500"
                                  : req.request_status === "completed"
                                    ? "text-green-500"
                                    : req.request_status === "accepted"
                                      ? "text-green-500"
                                      : "text-red-500"
                              } max-sm:text-sm`}
                            >
                              {req.request_status}
                            </h2>
                          </div>
                          <div className="flex flex-col gap-5 max-sm:gap-4">
                            <button
                              onClick={() => {
                                setIsOpen(true);
                                setModalRequest(req);
                              }}
                              className="px-4 bg-accent-primary rounded-xl max-sm:text-xs max-sm:px-2"
                            >
                              See Request
                            </button>
                            {req.request_status === "pending" ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    handleUpdate("completed", req.id);
                                  }}
                                  className="px-4 bg-green-500 rounded-xl max-sm:text-xs max-sm:px-2"
                                >
                                  Complete
                                </button>
                                <button
                                  onClick={() => {
                                    handleUpdate("rejected", req.id);
                                  }}
                                  className="px-4 bg-red-500 rounded-xl max-sm:text-xs max-sm:px-2"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : req.request_status === "accepted" ? (
                              <></>
                            ) : (
                              <></>
                            )}
                          </div>
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
              <div className="flex gap-10">
                <h1 className="pbe-4 "> My Requests</h1>
                <h1
                  onClick={() => toggleSection("your-requests")}
                  className="cursor-pointer"
                >
                  {openSection === "your-requests" ? <>↑</> : <>↓</>}
                </h1>
              </div>
              <div>
                <ul
                  className={`${openSection === "your-requests" ? "max-h-80" : "max-h-0"} overflow-scroll transition-all flex flex-col gap-2 px-4`}
                >
                  {requests.map((req) => {
                    return req.requester_id === userId ? (
                      <>
                        <li className="w-full h-40 border-white border-1 rounded-2xl flex items-center justify-between p-4">
                          <div className="flex gap-10 items-center max-sm:gap-5">
                            <img
                              src={req.requested.avatar_url}
                              alt=""
                              className="w-20 h-20 object-cover rounded-[50%] max-sm:2-15 max-sm:h-15"
                            />
                            <div className="flex flex-col gap-2">
                              <h1 className="max-sm:text-sm">
                                {req.requested.full_name}
                              </h1>
                              <h2 className="text-text-muted max-sm:text-xs">
                                {req.created_at?.slice(0, 10)}
                              </h2>
                            </div>
                            <h2
                              className={`${
                                req.request_status === "pending"
                                  ? "text-yellow-500"
                                  : req.request_status === "completed"
                                    ? "text-green-500"
                                    : req.request_status === "accepted"
                                      ? "text-green-500"
                                      : "text-red-500"
                              } max-sm:text-sm`}
                            >
                              {req.request_status}
                            </h2>
                          </div>
                          <div className="flex flex-col max-sm:gap-4 gap-5">
                            <button
                              onClick={() => {
                                setIsOpen(true);
                                setModalRequest(req);
                                setRequester(req.requester_id);
                              }}
                              className="px-4 bg-accent-primary rounded-xl max-sm:text-xs max-sm:px-2"
                            >
                              See Request
                            </button>
                            {req.request_status === "pending" ? (
                              <>
                                <button
                                  onClick={() => {
                                    handleDelete(req.id);
                                  }}
                                  className="px-4 bg-red-500 rounded-xl max-sm:text-xs max-sm:px-2"
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
                          </div>
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
          <div>
            {toast.length === 0 ? (
              <></>
            ) : (
              <>
                <h1
                  className={`absolute left-[50%] bottom-5 border-1 px-4 rounded-xl text-text-primary ${toastType === "error" ? "bg-red-500/20 border-red-500" : "bg-green-500/20 border-green-500"}`}
                >
                  {toast}
                </h1>
              </>
            )}
          </div>
        </div>
      </div>
      {isOpen ? (
        <>
          <ViewRequestModal
            setModalOpen={setIsOpen}
            modalRequest={modalRequest}
            handleDelete={handleDelete}
            handleUpdate={handleUpdate}
            requester={requester}
          ></ViewRequestModal>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
export default RequestsPage;
