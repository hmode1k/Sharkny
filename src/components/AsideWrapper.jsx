import Aside from "./Aside";

function AsideWrapper() {
  return (
    <>
      <div className="max-sm:w-full max-sm:flex max-sm:justify-center max-sm:items-center bg-main text-text-primary">
        <Aside className=""></Aside>
      </div>
    </>
  );
}
export default AsideWrapper;
