"use client";
import { useModal } from "@/app/context/ModalContext";

/**
 * 
 * @param {object} namesAndPathsObj Contains 2 members:
 *  1) key "names" and value being an array of user name strings;
 *  2) key "paths" and value being an array of strings each representing a URL
 *      path to an avatar image.
 *  A participant/user is represented by a name & avatar path of equal index.
 * @returns DIV parent of a CSS Grid, with even children wrapping avatar image
 *  elements and odd children wrapping corresponding user names.
 */
const participantsGrid = (namesAndPathsObj) => {
  const { names, paths } = namesAndPathsObj;
  const d = (dividend, divisor) => (dividend - dividend % divisor) / divisor;
  const pathCol = (x) => {
    return (
      <div key={x}>
        <img src={paths[d(x, 2)]} alt={names[d(x, 2)]} />
      </div>
    );
  };
  const nameCol = (x) => {
    return (
      <div key={x}>
        <p>{names[d(x, 2)]}</p>
      </div>
    );
  };
  const partyList = Array.from({length: 2 * names.length}, (value, index) => {
    return index % 2 && nameCol(index) || pathCol(index);
  });
  return <div className="party-grid">{partyList}</div>;
};

export default function Modal() {
  const { modal, closeModal } = useModal();
  let modalType = "modal-content";

  if (!modal.isOpen) return null;

  /* The modal.message can be either a string or jsx wrapping user names and
   * avatar urls. Modify final case's message value or chain more conditions
   * for different modal content data in future features.
   */
  let message;

  if (typeof modal.message === "string") {
    message = <p>{modal.message}</p>;
  } else if (Object.keys(modal.message ?? {}).join() === "names,paths") {
    message = participantsGrid(modal.message);
  } else {
    message = (<></>);
  }

  return (
    <div className="modal-overlay">
      <div className={modalType}>
        <h2>{modal.title}</h2>
        {message}
        {modal.onConfirm && (
          <button onClick={modal.onConfirm}>Confirm</button>
        )}
        <button onClick={closeModal}>Close</button>
      </div>
    </div>
  );
};