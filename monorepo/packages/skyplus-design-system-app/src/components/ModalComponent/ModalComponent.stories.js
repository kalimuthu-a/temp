import ModalComponent from './ModalComponent';

export default {
  title: 'Skyplus/Modal',
  component: ModalComponent,
};

export const PrimaryModal = () => {
  const onCloseHandler = () => {
    alert('modal close event');
  };

  const modalContent = () => {
    return (
      <div className="modal-content">
        <div className="modal-header">
          <h2>Modal Header</h2>
        </div>
        <div className="modal-body">
          <p>Some text in the Modal Body</p>
          <p>Some other text...</p>
        </div>
        <div className="modal-footer">
          <h3>Modal Footer</h3>
        </div>
      </div>
    );
  };

  const modalcontainer = `
    background-color: red;
  `;
  return (
    <ModalComponent
      modalWrapperClass={modalcontainer}
      // modalContentClass="modal-body"
      onCloseHandler={onCloseHandler}
      modalContent={modalContent}
    />
  );
};
