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

const commentsGrid = (params) => {
  const { names, paths, createdAt, commentText } = params;
  const d = (dividend, divisor) => (dividend - dividend % divisor) / divisor;
  const pathCol = (x) => {
    return (
      <div key={x+1000}>
        <img src={paths[d(x, 4)]} alt={names[d(x, 4)]} />
      </div>
    );
  };
  const nameCol = (x) => {
    return (
      <div key={x+2000}>
        <p>{names[d(x, 4)]}</p>
      </div>
    );
  };

  const createdAtCol = (x) => {
    return (
      <div key={x+3000}>
        <p>{createdAt[d(x, 4)]}</p>
      </div>
    );
  };

  const commentTextCol = (x) => {
    return (
      <div key={x+4000}>
        <p>{commentText[d(x, 4)]}</p>
      </div>
    );
  };

  const commentList = Array.from({ length: 4 * names.length }, (value, index) => {
    const colIndex = index % 4;
    const rowIndex = Math.floor(index / 4); 
  
    switch (colIndex) {
      case 0:
        return pathCol(rowIndex); 
      case 1:
        return nameCol(rowIndex); 
      case 2:
        return createdAtCol(rowIndex); 
      case 3:
        return commentTextCol(rowIndex); 
      default:
        return null;
    }
  });
  
  return <div className="comment-grid">{commentList}</div>;  
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
  } else if (Object.keys(modal.message ?? {}).join() === "names,paths,createdAt,commentText") {
    message = commentsGrid(modal.message);
    modalType = "comment-modal"
  }
  else {
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